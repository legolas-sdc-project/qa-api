const Sequelize = require('sequelize');

const db = new Sequelize('postgresql://chiaoling:@localhost:5432/sdc');

module.exports = db;