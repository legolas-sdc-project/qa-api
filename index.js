const express = require('express');
const { Pool, Client } = require("pg");
// const pgp = require('pg-promise')(/* initialization options */);

const app = express();
app.set('port', process.env.PORT || 3000);

const credentials = {
  user: "chiaoling",
  host: "localhost",
  database: "sdc",
  password: "",
  port: 5432,
};

const db = new Client(credentials);

db.connect();


// pg-promise
// db.one('SELECT name FROM users WHERE id = 40344')
//   .then(user => {
//       console.log(user.name); // print user name;
//   })
//   .catch(error => {
//       console.log(error); // print the error;
//   });
  
app.get('/', function (req, res, next) {
  db.query('SELECT * FROM qa_schema.questions where id = 1', (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(JSON.stringify(result.rows));
    }
  });
});

app.listen(3000, function () {
  console.log('Server is running on Port 3000');
});