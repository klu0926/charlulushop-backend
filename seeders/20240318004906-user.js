'use strict';
const bcrypt = require('bcrypt')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const name = process.env.USERNAME
const password = process.env.PASSWORD

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const passwordHashed = bcrypt.hashSync(password, 10)

    const admin = {
      name: process.env.USERNAME,
      password: passwordHashed,
    }
    return queryInterface.bulkInsert('Users', [admin])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users')
  }
};
