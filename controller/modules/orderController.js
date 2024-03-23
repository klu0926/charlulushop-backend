
const { or } = require('sequelize')
const responseJSON = require('../../helpers/responseJSON')
const { Order } = require('../../models')
const { getOrders } = require('../api/orderApi').services

const orderController = {
  // query; email, ig
  getOrders: async (req, res, next) => {
    try {
      const orders = await getOrders()  // optional (email, ig)

      // 總金額 (要扣除狀態為'取消訂單'的訂單) 
      const totalPrice = orders.reduce((total, order) => {
        if (order.status !== '取消訂單') {
          return total + order.price
        }
        return total
      }, 0)


      // 未取消的訂單總數
      let activeOrders = 0
      orders.forEach(o => {
        if (o.status !== '取消訂單') {
          activeOrders++
        }
      })
      // 完成的訂單總數
      let completedOrders = 0
      orders.forEach(o => {
        if (o.status === '交易完成') {
          completedOrders++
        }
      })

      res.render('orderPage', { page: 'orders', orders, totalPrice, completedOrders, activeOrders })
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET Orders', null, err.message))
    }
  }

}
module.exports = orderController