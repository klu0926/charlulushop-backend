'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.hasMany(models.Block, {
        foreignKey: 'postId',
        as: 'blocks',
        onDelete: 'CASCADE',
      })
    }
  }
  Post.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.STRING,
    cover: DataTypes.STRING,
    block_order: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};