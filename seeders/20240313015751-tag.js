'use strict'

const tagSeed = [
  { name: '夏露露' },
  { name: '美好Station' },
  { name: '每日文藝' },
  { name: '熊熊上文具' },
  { name: 'Prettier Art' },
  { name: '無日隨記' },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Tags', tagSeed)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Tags')
  },
}
