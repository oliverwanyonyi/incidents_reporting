'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('chat_users',{
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    user: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'users', 
        key: 'id'
      },
      onDelete:"CASCADE"
    }   ,
    chat_id: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'chats',
        key: 'id'
      },
      onDelete:"CASCADE"
    },
   })
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('chat_users')
  }
};
