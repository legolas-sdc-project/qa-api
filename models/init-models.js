var DataTypes = require("sequelize").DataTypes;
var _answers = require("./answers");
var _photos = require("./photos");
var _products = require("./products");
var _questions = require("./questions");

function initModels(sequelize) {
  var answers = _answers(sequelize, DataTypes);
  var photos = _photos(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var questions = _questions(sequelize, DataTypes);

  photos.belongsTo(answers, { as: "answer", foreignKey: "answer_id"});
  answers.hasMany(photos, { as: "photos", foreignKey: "answer_id"});
  answers.belongsTo(questions, { as: "question", foreignKey: "question_id"});
  questions.hasMany(answers, { as: "answers", foreignKey: "question_id"});

  return {
    answers,
    photos,
    products,
    questions,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
