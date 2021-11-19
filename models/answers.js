const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('answers', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'questions',
        key: 'id'
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    answerer_name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    answerer_email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    reported: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    helpfulness: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'answers',
    schema: 'qa_schema',
    timestamps: false,
    indexes: [
      {
        name: "answers_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
