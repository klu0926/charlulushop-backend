
const responseJSON = require('../../helpers/responseJSON')
const { Order } = require('../../models')
const { getOrders } = require('../api/orderApi').services

const orderController = {
  // query; email, ig
  getOrders: async (req, res, next) => {
    try {
      const orders = await getOrders()  // optional (email, ig)

      // total price 
      const totalPrice = orders.reduce((total, order) => {
        return total + order.price
      }, 0)

      res.render('orderPage', { page: 'orders', orders, totalPrice })
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET Orders', null, err.message))
    }
  }

}
module.exports = orderController