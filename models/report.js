'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  report.init({ 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      boardId:{
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      postId:{
        type: DataTypes.INTEGER
      },
      description: {
        type: DataTypes.STRING
      },
      userId:{
        allowNull: false,
        type: DataTypes.STRING
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    }, {
      sequelize,
      modelName: 'report',
  });
  return report;
};