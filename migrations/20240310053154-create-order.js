'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      buyerName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      buyerEmail: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      buyerIG: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      orderItemIds: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};