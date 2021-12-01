const Sequelize = require('sequelize');
const pw = require('../config.js');

const db = new Sequelize(`postgresql://postgres:${pw}@54.241.225.132:5432/postgres`);

module.exports = db;