'use strict';

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
      position:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      designation:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      location:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      address:{
        type: Sequelize.STRING,
        allowNull: true,
      },
     
      password:{
        type: Sequelize.STRING,
        allowNull: false,
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
