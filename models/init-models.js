var { DataTypes } = require("sequelize");
var _answers = require("./answers.js");
var _photos = require("./photos.js");
var _questions = require("./questions.js");

function initModels(sequelize) {
  var answers = _answers(sequelize, DataTypes);
  var photos = _photos(sequelize, DataTypes);
  var questions = _questions(sequelize, DataTypes);

  photos.belongsTo(answers, { as: "answer", foreignKey: "answer_id"});
  answers.hasMany(photos, { as: "photos", foreignKey: "answer_id"});
  answers.belongsTo(questions, { as: "question", foreignKey: "question_id"});
  questions.hasMany(answers, { as: "answers", foreignKey: "question_id"});

  return {
    answers,
    photos,
    questions,
  };
}
module.exports = initModels;
