'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item_Tag extends Model {
    static associate(models) {
    }
  }
  Item_Tag.init({
    itemId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Item_Tag',
  });
  return Item_Tag;
};