'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Statuses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      isLock: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      reason: {
        type: Sequelize.STRING,
        defaultValue: '備貨中，暫時休店'
      },
      message: {
        type: Sequelize.STRING,
        defaultValue: '請待夏洛特IG更新開店時間！'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Statuses');
  }
};