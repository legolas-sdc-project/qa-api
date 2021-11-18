const express = require('express');
const pgp = require('pg-promise')(/* initialization options */);

const app = express();
app.set('port', process.env.PORT || 3000);

const connectionString = 'postgres://chiaoling:@localhost:5432/sdc';

const db = new Client({
  connectionString: connectionString;
});

// pg-promise
// db.one('SELECT name FROM users WHERE id = 40344')
//   .then(user => {
//       console.log(user.name); // print user name;
//   })
//   .catch(error => {
//       console.log(error); // print the error;
//   });
  
app.get('/', function (req, res, next) {
  client.query('SELECT * FROM Employee where id = $1', [1], function (err, result) {
      if (err) {
          console.log(err);
          res.status(400).send(err);
      }
      res.status(200).send(result.rows);
  });
});

app.listen(3000, function () {
  console.log('Server is running on Port 3000');
});