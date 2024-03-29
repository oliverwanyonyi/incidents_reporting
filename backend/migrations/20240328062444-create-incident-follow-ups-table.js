'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) { 
    await queryInterface.createTable('incident_follow_ups',{
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    incident_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'incidents',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
  
  });
  },

  async down (queryInterface, Sequelize) {
  await queryInterface.dropTable("incident_follow_ups")
  }
};
