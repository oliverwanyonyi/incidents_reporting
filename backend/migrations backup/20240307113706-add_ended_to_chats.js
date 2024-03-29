'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn('chats', 'ended', {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  });
  },

  async down (queryInterface, Sequelize) {
  await  queryInterface.dropColumn('chats', 'ended');
  }
  
};
