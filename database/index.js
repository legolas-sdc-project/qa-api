const {Sequelize, Model, DataTypes} = require('sequelize');

const db = new Sequelize('postgresql://chiaoling:@localhost:5432/sdc');

module.exports = {
  findOne: (req, res) => {
    const id = req.params.id;
    Questions.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Question with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Question with id=" + id
      });
    });
  }
}