const express = require('express');
// const bodyParser = require('body-parser');
const db = require('./database/index.js');

var initModels = require("./models/init-models");
var models = initModels(db);

// Parse incoming requests data (https://github.com/expressjs/body-parser)
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

const app = express();
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
  models.questions.findAll({ limit: 10 })
  .then(data => {
    res.send(JSON.stringify(data));
  });
});

// ANSWERS

// req url1 = /qa/questions/553458/answers
// req url2 = /qa/questions/553458/answers?page=1&count=5
app.get('/api/qa/questions/:id/answers', (req, res) => {
  // id = req.params.id
  // page = req.query.page
  // count = req.query.count
});

// helpful
app.put('api/qa/answers/:answer_id/helpful', (req, res) => {
  
});

// report - 0 or 1 bit
app.put('api/qa/answers/:answer_id/report', (req, res) => {
  
});


// QUESTIONS

// req url = /qa/questions?product_id=40344
app.get('/api/qa/questions', (req, res) => {
  // id = req.query.product_id
  res.send();
});

// helpful - increment int
app.put('api/qa/questions/:question_id/helpful', (req, res) => {
  
});

// report - 0 or 1 bit
app.put('api/qa/questions/:question_id/report', (req, res) => {
  
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