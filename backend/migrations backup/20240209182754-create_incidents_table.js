'use strict';

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
        type: Sequelize.INTEGER, 
        allowNull: true,
        references:{
          model:"counties",
          key:'id'
        },
        onDelete:"CASCADE"

      },
      sub_county: {
        type: Sequelize.INTEGER, 
        allowNull: true,
        references:{
          model:"sublocations",
          key:'id'
        },
        onDelete:"CASCADE"

      },
      ward: {
        type: Sequelize.INTEGER, 
        allowNull: true,
        references:{
          model:"wards",
          key:'id'
        },
        onDelete:"CASCADE"

      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      lat: {
        type: Sequelize.STRING, // Adjust data type based on precision needed
        allowNull: true,
      },
      lon: {
        type: Sequelize.STRING, // Adjust data type based on precision needed
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("reported", "investigation_in_progress", "resolved", "rejected"),
        allowNull: false,
        defaultValue: "reported", // Adjust the default status as needed
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
