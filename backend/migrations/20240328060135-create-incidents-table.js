'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.createTable('incidents',{
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      incident_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      incident: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      county: {
        type: Sequelize.STRING, 
        allowNull:false
      },
      sub_county: {
        type: Sequelize.STRING, 
        allowNull:false
      },
      ward: {
        type: Sequelize.STRING, 
        allowNull: false

      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      lat: {
        type: Sequelize.STRING, 
        allowNull: true,
      },
      lon: {
        type: Sequelize.STRING, 
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("reported", "investigation_in_progress", "resolved", "rejected"),
        allowNull: false,
        defaultValue: "reported", 
      },
      reporter_id:{
        type: Sequelize.INTEGER,
        allowNull:true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      assignedTo:{
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: true,
        onDelete:"SET NULL"
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
    await queryInterface.dropTable('incidents')
  }
};