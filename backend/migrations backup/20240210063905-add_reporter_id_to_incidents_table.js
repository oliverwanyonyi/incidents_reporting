'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("incidents", "reporter_id", {
      type: Sequelize.INTEGER,
      allowNull:true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropColumn("incidents", "reporter_id", {
      type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
    });
  }
};
