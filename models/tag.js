'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      Tag.belongsToMany(models.Item, {
        through: models.Item_Tag,
        foreignKey: 'tagId',
        as: 'items',
        onDelete: 'CASCADE'
      })
    }
  }
  Tag.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      icon: DataTypes.BLOB,
    },
    {
      sequelize,
      modelName: 'Tag',
    }
  )
  return Tag
}

// when Tag is deleted, all related Item_Tag will also be deleted
// Item is not effected
