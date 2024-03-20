'use strict'

const data = {
  name: '商品',
  description: '產品的介紹，希望大家可以多多買買，消費多多',
  price: 100,
}
const amount = 10

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const seeds = []
    for (let i = 1; i <= amount; i++) {
      seeds.push({
        ...data,
        name: data.name.concat(i),
      })
    }
    return queryInterface.bulkInsert('Items', seeds)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Items')
  },
}
