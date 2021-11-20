const express = require('express');
// const bodyParser = require('body-parser');
const db = require('./database/index.js');

var initModels = require("./models/init-models");
var models = initModels(db);

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

const app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {

});

// QUESTIONS

//req url = /qa/questions?product_id=40344
app.route('/api/qa/questions')
  .get((req, res) => {
    const product_id = req.query.product_id;
    const page = req.query.page || 1;
    const offset = (page - 1) * 3;
    
    models.questions.findAll(
      { 
        attributes: { exclude: ['asker_email'] }, 
        where: { 
          product_id: product_id, 
          reported: '0'
        },
        offset: offset,
        limit: 3,
      }
    )
    .then(data => {
      res.send(JSON.stringify(data));
    })
    .catch(error => {
      res.send(error);
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
  
});

// report - 0 or 1 bit
app.put('api/qa/questions/:question_id/report', (req, res) => {
  
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
      attributes: { exclude: ['answerer_email'] }, 
      where: { 
        question_id: question_id, 
        reported: '0'
      },
      offset: offset,
      limit: count,
    }
  )
  .then(data => {
    res.send(JSON.stringify(data));
  })
  .catch(error => {
    res.send(error);
  })
})
.post((req, res) => {
    
});

// helpful
app.put('api/qa/answers/:answer_id/helpful', (req, res) => {
  
});

// report - 0 or 1 bit
app.put('api/qa/answers/:answer_id/report', (req, res) => {
  
});


// check express server connection
app.listen(3000, function () {
  console.log('Server is running on Port 3000');
});

// check postgres DB connection
db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });