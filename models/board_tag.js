'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class board_tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  board_tag.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    tagId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    boardId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    updatedAt: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'board_tag',
  });
  return board_tag;
};