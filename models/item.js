'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      Item.hasMany(models.Image, {
        foreignKey: 'itemId',
        as: 'images',
        onDelete: 'CASCADE',
      })
      Item.belongsToMany(models.Tag, {
        through: models.Item_Tag,
        foreignKey: 'itemId',
        as: 'tags',
      })
    }
  }
  Item.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Item',
    }
  )
  return Item
}
