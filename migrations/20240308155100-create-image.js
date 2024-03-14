'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      imageName: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 'image',
      },
      imageData: {
        allowNull: false,
        type: Sequelize.BLOB('long'),
      },
      itemId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      isCover: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('Images')
  },
}
