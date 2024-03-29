"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "county", {
      type: Sequelize.INTEGER,
      allowNull: true, // Adjust as needed
      references: {
        model: "counties",
        key: "id",
      },
      onDelete: "CASCADE",
      after:"address"
    });

    await queryInterface.addColumn("users", "sub_county", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "sublocations",
        key: "id",
      },
      onDelete: "CASCADE",
      after:"county"
    });

    await queryInterface.addColumn("users", "ward", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "wards",
        key: "id",
      },
      onDelete: "CASCADE",
      after:"sub_county"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'county');
    await queryInterface.removeColumn('users', 'sub_county');
    await queryInterface.removeColumn('users', 'ward');
  },
};
