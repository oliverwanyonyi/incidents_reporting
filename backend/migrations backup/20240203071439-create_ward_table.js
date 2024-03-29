'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.createTable( 'wards',{
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
      sublocation_id:{
        type:Sequelize.INTEGER,
        references:{
          model: 'sublocations',
          key: 'id',
        },
        onDelete:"CASCADE"
      }
    })
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('ward')
  }
};
