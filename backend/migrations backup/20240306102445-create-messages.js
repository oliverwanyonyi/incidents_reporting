'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sender: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // Assuming you have a users table
          key: 'id'
        },
        onDelete:"CASCADE"
      },
     
      receiver: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // Assuming you have a users table
          key: 'id'
        },
        onDelete:"CASCADE"
      },
     
      message: {
        allowNull: false,
        type: Sequelize.STRING
      },
      chat_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'chats',
          key: 'id'
        },
        onDelete:"CASCADE"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
     
      
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('messages');
  }
};