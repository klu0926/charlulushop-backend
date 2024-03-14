'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item_Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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