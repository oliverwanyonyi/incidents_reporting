'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  await queryInterface.createTable("sublocations",{
    id:{
      type:Sequelize.INTEGER,
      autoIncrement:true,
      primaryKey: true,
      allowNull:false
    },
    name:{
      allowNull: false,
      type: Sequelize.STRING,
      unique:true
    },
    county_id:{
      type:Sequelize.INTEGER,
      references:{
        model: 'counties',
        key: 'id',
      },
      onDelete:"CASCADE"
    }
  })
  },
  async down (queryInterface, Sequelize) { 
    await queryInterface.dropTable('sublocation')
  }
};
