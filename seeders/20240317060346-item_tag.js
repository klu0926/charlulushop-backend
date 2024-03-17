'use strict';
const { Tag, Item } = require('../models');

function randomIndex(length) {
  return Math.floor(Math.random() * length)
}
const ItemTagsPerItem = 5

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const tags = await Tag.findAll()
      const items = await Item.findAll()
      const itemTags = []

      // For each item
      for (let i = 0; i < items.length; i++) {
        const currentItem = items[i]

        // Randomly pick 5 tagId for an item
        const tagsArray = []
        while (tagsArray.length < 5) {
          const tagId = tags[randomIndex(tags.length)].id
          if (tagId !== undefined && !tagsArray.includes(tagId)) {
            tagsArray.push(tagId)
          }
        }
        // Push 5 Item_Tag object to itemTags array
        for (const id of tagsArray) {
          itemTags.push({
            itemId: currentItem.id,
            tagId: id
          })
        }
      }
      await queryInterface.bulkInsert('Item_Tags', itemTags)

    } catch (err) {
      console.log(err)
    }


  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Item_Tags')
  }
};
