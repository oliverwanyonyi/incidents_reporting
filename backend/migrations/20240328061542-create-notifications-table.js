'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      initiator_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model:"users",
          key:'id'
        },
        onDelete:"CASCADE"
      },
      receiver_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model:"users",
          key:'id'
        },
        onDelete:"CASCADE"
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('notifications');
  }
};
