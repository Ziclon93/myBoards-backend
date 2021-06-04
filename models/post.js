'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  post.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    boardId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    x: {
      allowNull: false,
      type: DataTypes.FLOAT
    },
    y: {
      allowNull: false,
      type: DataTypes.FLOAT
    },
    rotation: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    resourceUrl: {
      allowNull: false,
      type: DataTypes.STRING
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'post',
  });
  return post;
};