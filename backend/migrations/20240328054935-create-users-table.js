'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('users',{
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      full_name:{
        type: Sequelize.STRING,
        allowNull: false,
      },phone:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      email:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      password:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      county: {
        type: Sequelize.STRING,
        allowNull: true, 
       
      },
      sub_county: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ward: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      active:{
        type:DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, 
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
