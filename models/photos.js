const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('photos', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    answer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'answers',
        key: 'id'
      }
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'photos',
    schema: 'qa_schema',
    timestamps: false,
    indexes: [
      {
        name: "photos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
