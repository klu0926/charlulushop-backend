'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Block extends Model {
    static associate(models) {
      Block.belongsTo(models.Post, {
        foreignKey: 'postId',
        as: 'post',
        onDelete: 'CASCADE'
      })
    }
  }
  Block.init({
    postId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    data: DataTypes.STRING,
    meta_tag: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Block',
  });
  return Block;
};