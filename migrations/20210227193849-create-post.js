'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      boardId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      userId:{
        allowNull: false,
        type: Sequelize.STRING
      },
      x: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      y: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      size: {
        type: Sequelize.INTEGER
      },
      rotation: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      resourceUrl: {
        type: Sequelize.STRING
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('posts');
  }
};