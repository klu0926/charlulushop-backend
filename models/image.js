'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      Image.belongsTo(models.Item, {
        foreignKey: 'itemId',
        as: 'item',
      })
    }
  }
  Image.init(
    {
      imageName: DataTypes.STRING,
      imageData: DataTypes.BLOB,
      isCover: DataTypes.BOOLEAN,
      itemId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Image',
    }
  )
  return Image
}
