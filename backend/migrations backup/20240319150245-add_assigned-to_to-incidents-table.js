"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("incidents", "assigned_to", {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: true,
      after: "status",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("incidents", "assigned_to");
  },
};
