'use strict'

const tagSeed = [
  { name: '全新' },
  { name: '二手' },
  { name: '紙膠帶' },
  { name: '手帳本' },
  { name: '印章' },
  { name: '貼紙' },
  { name: '雜貨' },
  { name: '筆類' },
  { name: '書籍' },
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
