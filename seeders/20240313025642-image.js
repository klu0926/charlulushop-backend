'use strict'
const { Item } = require('../models')
const fs = require('fs')
const path = require('path')
const coverPath = path.join(__dirname, '../public/images/cover_blue.png')
const picturePath = path.join(__dirname, '../public/images/picture_grey.png')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const items = await Item.findAll()
    const coverFile = fs.readFileSync(coverPath)
    const pictureFile = fs.readFileSync(picturePath)

    const seeds = []
    // each item 1 cover 2 pictures
    for (let i = 0; i < items.length; i++) {
      const itemId = items[i].id
      // cover
      seeds.push({
        imageName: 'Cover',
        imageData: coverFile,
        isCover: true,
        itemId: itemId,
      })
      // 2 picture
      for (let j = 0; j < 2; j++) {
        seeds.push({
          imageName: 'Picture',
          imageData: pictureFile,
          isCover: false,
          itemId: itemId,
        })
      }
    }
    return queryInterface.bulkInsert('Images', seeds)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Images')
  },
}
