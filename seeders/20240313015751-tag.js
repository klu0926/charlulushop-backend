'use strict'

const tagSeed = [
  { name: '夏露露' },
  { name: '美好Station' },
  { name: '每日文藝' },
  { name: '熊熊上文具' },
  { name: 'Prettier Art' },
  { name: '無日隨記' },
  { name: 'Mara in mars' },
  { name: '最貴的男人' },
  { name: '台灣價值Win' },
  { name: '愛手藝' },
  { name: '紙膠帶' },
  { name: '明信片' },
  { name: '印章' },
  { name: '海報' },
  { name: '本本' },
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
