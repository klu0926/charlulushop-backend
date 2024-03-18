'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // for this small project, I don't use join table, I use array of item id, and store with array convert to string
    }
  }
  Order.init({
    buyerName: DataTypes.STRING,
    buyerEmail: DataTypes.STRING,
    buyerIG: DataTypes.STRING,
    price: DataTypes.INTEGER,
    itemsIds: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};