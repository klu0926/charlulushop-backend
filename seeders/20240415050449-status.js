'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      return queryInterface.bulkInsert('statuses', [{
        isLock: true,
      }])
    } catch (err) {
      console.error('statuses seeder error: ', err)
      throw err
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('statuses')

  }
};
