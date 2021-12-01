const dotenv = require('dotenv');
const express = require('express');
const { QueryTypes } = require('sequelize');
const axios = require('axios');
const cors = require('cors');
// require('newrelic');
const db = require('./database/index.js');
var initModels = require("./models/init-models");
var models = initModels(db);

dotenv.config();

const app = express();
app.use(cors({
  origin: '*'
}));

app.get('/', (req, res) => {
  res.send('Connected to server!');
});

app.get('/api/', (req, res) => {
  res.send('Welcome to my awesome API server!');
});

const transformUrls = (answer) => {
  let urls = [];
  answer.photos.forEach(url => urls.push((url.url)))
  return urls;
}

//req url = /qa/questions?product_id=40344
app.route('/api/qa/questions')
  .get((req, res) => {
    const product_id = req.query.product_id;
    const page = req.query.page || 1;
    const offset = (page - 1) * 3;
    
    models.questions.findAll(
      { 
        attributes: { exclude: ['product_id', 'asker_email'] }, 
        where: { 
          product_id: product_id, 
          reported: false
        },
        offset: offset,
        limit: 3,
        include: [
          {
            model: models.answers, as: 'answers',
            attributes: [['answer_id', 'id'], 'body', 'date', 'answerer_name', 'helpfulness'],
            include: [
              {   
                model: models.photos, as: 'photos',
                attributes: ['url'],
                raw: true,
              }
            ],
            group: ['answer_id']
          }
        ],
        group: ['question_id']
      }
    )
    .then(questions => {
      
      questions.forEach(question => {
        var result = {};
        question.dataValues.answers.forEach(answer => {
          answer = JSON.stringify(answer);
          answer = JSON.parse(answer);
          result[answer.id] = answer;
          result[answer.id].photos = transformUrls(answer);
        })
        question.dataValues.answers = result;
      })
      return questions;
    })
    .then(result => {
      res.status = 200;
      res.json({
        product_id: product_id,
        results: result
      });
    })
    .catch(error => {
      console.log(error);
    })
  })
.post((req, res) => {
  if (!req.query.product_id) {
    res.status(400).send({
    message: "product id can not be empty!"
    });
    return;
  }
  const { body, name, email } = req.body;
  models.questions.create({
    product_id: req.query.product_id,
    question_body: body,
    question_date: db.literal('CURRENT_TIMESTAMP'),
    asker_name: name, 
    asker_email: email,
    reported: 0,
    question_helpfulness: 0
  })
  .then(data => {
    res.send(JSON.stringify(data) + ' POSTED!');
  })
  .catch(error => {
    console.log(error);
  })
})

// Model.increment('number', { where: { foo: 'bar' });
// helpful - increment int
app.put('/api/qa/questions/:question_id/helpful', (req, res) => {
  models.questions.update(
    { 
      question_helpfulness: db.literal('question_helpfulness + 1') 
    }, 
    { where: { 
      question_id: req.params.question_id
    } 
  })
  .then(() => {
    res.send(`question id: ${req.params.question_id}'s helpfulness updated`);
  })
  .catch( error => {
    console.log(error);
  })
});

// report - 0 or 1 bit
app.put('/api/qa/questions/:question_id/report', (req, res) => {
  models.questions.update(
    { 
      reported: 1
    }, 
    { where: { 
      question_id: req.params.question_id
    } 
  })
  .then(() => {
    res.send(`question id: ${req.params.question_id} has been reported`);
  })
  .catch( error => {
    console.log(error);
  })
});

// ANSWERS

// req url1 = /qa/questions/553458/answers
// req url2 = /qa/questions/553458/answers?page=1&count=5
app.route('/api/qa/questions/:id/answers')
.get((req, res) => {
  const question_id = req.params.id;
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  const offset = (page - 1) * count;
  
  models.answers.findAll(
    { 
      attributes: { exclude: ['question_id', 'answerer_email', 'reported'] }, 
      where: { 
        question_id: question_id, 
        reported: false
      },
      offset: offset,
      limit: count,
      include: [
        {   
          model: models.photos, as: 'photos',
          attributes: ['url'],
          raw: true,
        }
      ],
      group: ['answer_id']
    }
  )
  .then(answers => {
    answers = JSON.stringify(answers);
    answers = JSON.parse(answers);
    answers.forEach(answer => {
      answer.photos = transformUrls(answer);
    })
    return answers;
  })
  .then(data => {
    res.status = 200;
    res.json({
      question: question_id,
      page: page,
      count: count,
      results: data
    });
  })
  .catch(error => {
    res.send(error);
  })
})
.post((req, res) => {
  const { body, name, email, photos } = req.body;
  models.questions.create({
    question_id: req.query.question_id,
    body: body,
    date_written: db.literal('CURRENT_TIMESTAMP'),
    answerer_name: name, 
    answerer_email: email,
    reported: 0,
    helpfulness: 0
  })
  .then(data => {
    res.send(JSON.stringify(data) + ' POSTED!');
  })
  .catch(error => {
    console.log(error);
  })
});

// helpful
app.put('/api/qa/answers/:answer_id/helpful', (req, res) => {
  models.answers.update({ 
      helpfulness: db.literal('helpfulness + 1') 
    }, 
    { where: { 
      answer_id: req.params.answer_id
    } 
  })
  .then(() => {
    res.send(`answer id: ${req.params.answer_id}'s helpfulness updated`);
  })
  .catch( error => {
    console.log(error);
  })
});

// report - 0 or 1 bit
app.put('/api/qa/answers/:answer_id/report', (req, res) => {
  models.answers.update({ 
      reported: 1
    }, 
    { where: { 
      answer_id: req.params.answer_id
    } 
  })
  .then(() => {
    res.send(`answer id: ${req.params.answer_id} has been reported`);
  })
  .catch( error => {
    console.log(error);
  })
});

/////////////////////////////////////////////

// OTHER API CALLS - Re-direct to Atelier API

app.get('/api/reviews', (req, res) => {
  const product_id = req.query.product_id;
  axios({
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/reviews?product_id=${product_id}`,
    method: 'get',
    headers: {
      'Authorization': process.env.API_TOKEN
    }
  }).then(reviewsData => {
    res.json(reviewsData.data);
  }).catch(error => {
    console.log(error);
  })
})

app.get('/api/reviews/meta', (req, res) => {
  const product_id = req.query.product_id;
  axios({
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/reviews/meta?product_id=${product_id}`,
    method: 'get',
    headers: {
      'Authorization': process.env.API_TOKEN
    }
  }).then(reviewsData => {
    res.json(reviewsData.data);
  }).catch(error => {
    console.log(error);
  })
})

app.get('/api/products', (req, res) => {
  axios({
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/products`,
    method: 'get',
    headers: {
      'Authorization': process.env.API_TOKEN
    }
  }).then(productData => {
    res.json(productData.data);
  }).catch(error => {
    console.log(error);
  })
})

app.get('/api/products/:product_id', (req, res) => {
  const product_id = req.params.product_id;
  axios({
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/products/${product_id}`,
    method: 'get',
    headers: {
      'Authorization': process.env.API_TOKEN
    }
  }).then(productData => {
    res.json(productData.data);
  }).catch(error => {
    console.log(error);
  })
})

app.get('/api/products/:product_id/styles', (req, res) => {
  const product_id = req.params.product_id;
  axios({
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/products/${product_id}/styles`,
    method: 'get',
    headers: {
      'Authorization': process.env.API_TOKEN
    }
  }).then(productData => {
    res.json(productData.data);
  }).catch(error => {
    console.log(error);
  })
})

app.get('/api/products/:product_id/related', (req, res) => {
  const product_id = req.params.product_id;
  axios({
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/products/${product_id}/related`,
    method: 'get',
    headers: {
      'Authorization': process.env.API_TOKEN
    }
  }).then(productData => {
    res.json(productData.data);
  }).catch(error => {
    console.log(error);
  })
})

// check express server connection
app.listen(process.env.PORT, function () {
  console.log('Server is running on Port 3010');
});

// check postgres DB connection
db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  