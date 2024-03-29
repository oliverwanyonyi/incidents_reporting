'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const currentDate = new Date();
    const rolesData = [
      { name: 'system-admin', createdAt: currentDate, updatedAt: currentDate },
      { name: 'ward-admin', createdAt: currentDate, updatedAt: currentDate },
      { name: 'ward-officer', createdAt: currentDate, updatedAt: currentDate },
      { name: 'user', createdAt: currentDate, updatedAt: currentDate }
    ];

    return queryInterface.bulkInsert('roles', rolesData);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', null, {});
  }
};
