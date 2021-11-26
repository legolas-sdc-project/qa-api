const dotenv = require('dotenv');
const express = require('express');
const request = require('supertest');
// const bodyParser = require('body-parser');
const { QueryTypes } = require('sequelize');
const db = require('./database/index.js');
const axios = require('axios');

var initModels = require("./models/init-models");
var models = initModels(db);

dotenv.config();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
const app = express();

app.get('/api/', (req, res) => {
  res.send('Welcome to my awesome API server!');
});

// const records = await db.query('select 1 as `answer_id.bar.baz`', {
//   nest: true,
//   type: QueryTypes.SELECT
// });

// {
//   '5181045': {
//     'id': 5181045,
//     'body': 'sdsdsdsd//dsds',
//     'date': '2021-11-10T00:00:00.000Z',
//     'answerer_name': 'tes',
//     'helpfulness': 5,
//     'photos': [
//       'a',
//       'b',
//       'c',
//       'd',
//       'e'
//     ]
//   }
// }

// const returnUrls = (url) => {
//   console.log(url);
// }

const transformAnswer = (answer) => {

  answer.photos = transformPhotos(answer.dataValues.id);
  return answer;
}

const transformPhotos = (answer_id) => {
  let urls = [];
  models.photos.findAll({
    attribute: ['url'],
    where: { answer_id: answer_id}
  }).then(photos => {
    photos.forEach(photo => {
      urls.push(photo.dataValues.url);
    })
  })
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
          reported: '0'
        },
        offset: offset,
        limit: 3,
        include: [
          {
            model: models.answers, as: 'answers',
            attributes: [['answer_id', 'id'], 'body', 'date', 'answerer_name', 'helpfulness'],
          }
        ],
        group: ['question_id']
      }
    )
    .then(questions => {
      // const all = async () => {
      //   const promises = questions.map((question) => transformAnswers(question.dataValues.answers));
      //   const result = await Promise.all(promises);
      //   console.log('.all done');
      //   return result;
      // };
      // const testResult = all();
      // console.log(JSON.stringify(testResult));
      // return testResult;
      
      questions.forEach(question => {
        var result = {};
        question.dataValues.answers.forEach(answer => {
          result[answer.dataValues.id] = transformAnswer(answer);
        })
        question.dataValues.answers = result;
      })
      return questions;
    })
    .then(result => {
      res.json({
        product_id: product_id,
        answers: result
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
  models.questions.create({
    product_id: req.query.product_id,question_body: req.body.question_body,question_date: req.body.question_date,asker_name: req.body.asker_name, asker_email:req.body.asker_email,
    reported: req.body.reported,
    question_helpfulness: req.body.question_helpfulness
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
app.put('api/qa/questions/:question_id/helpful', (req, res) => {
  questions.update({question_helpfulness: question_helpfulness++}, {where: req.params.question_id})
  .then(response => {
    res.send(response);
  })
  .catch( error => {
    console.log(error);
  })
});

// report - 0 or 1 bit
app.put('api/qa/questions/:question_id/report', (req, res) => {
  questions.update({reported: 1}, {where: req.params.question_id})
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
        reported: '0'
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
  .then(data => {
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
    
});

// helpful
app.put('api/qa/answers/:answer_id/helpful', (req, res) => {
  answers.update({helpfulness: helpfulness++}, {where: req.params.answer_id})
  .then(response => {
    res.send(response);
  })
  .catch( error => {
    console.log(error);
  })
});

// report - 0 or 1 bit
app.put('api/qa/answers/:answer_id/report', (req, res) => {
  questions.update({reported: 1}, {where: req.params.question_id})
});

/////////////////////////////////////////////

// OTHER API CALLS - Re-direct to Atelier API

app.get('/api/reviews', (req, res) => {
  console.log(req.params, req.query);
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

// Photos
// Return photo urls as an array
const returnUrls = () => {
  
}

// QUESTIONS

// Atelier Questions/Answers
// app.get('/api/qa/questions', (req, res) => {
//   const product_id = req.query.product_id;
//   axios({
//     url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/qa/questions?product_id=${product_id}`,
//     method: 'get',
//     headers: {
//       'Authorization': process.env.API_TOKEN
//     }
//   }).then(data => {
//     console.log(data.data);
//     res.send(data.data)
//   }).catch(error => {
//     console.log(error);
//   })
// })

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
  