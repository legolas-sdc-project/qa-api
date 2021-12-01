const Sequelize = require('sequelize');
const pw = require('../config.js');

const ip = '54.193.215.206';
const db = new Sequelize(`postgresql://postgres:${pw}@${ip}:5432/postgres`);
// const db = new Sequelize(`postgresql://chiaoling:@localhost:5432/sdc`);

module.exports = db;