"use strict";

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "active", {
      type:DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, 
      after:"password"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "active");
  },
};
