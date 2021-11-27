const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('questions', {
    question_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    question_body: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    question_date: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    asker_name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    asker_email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    question_helpfulness: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reported: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'questions',
    schema: 'qa_schema',
    timestamps: false,
    indexes: [
      {
        name: "questions_pkey",
        unique: true,
        fields: [
          { name: "question_id" },
        ]
      },
    ]
  });
};
