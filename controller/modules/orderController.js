const responseJSON = require('../../helpers/responseJSON')
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


      // 計算數量
      let activeOrders = 0
      let completedOrders = 0
      let inCompletedOrder = 0

      orders.forEach(o => {
        // 未取消的訂單 總數 (全部)
        if (o.status !== '取消訂單') {
          activeOrders++
        }
        // 完成的訂單 總數
        if (o.status === '交易完成') {
          completedOrders++
        }
        // 未完成的訂單 總數
        if (o.status !== '交易完成' && o.status !== '取消訂單') {
          inCompletedOrder++
        }
      })

      res.render('orderPage', { page: 'orders', orders, totalPrice, completedOrders, activeOrders, inCompletedOrder, })
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET Orders', null, err.message))
    }
  }

}
module.exports = orderController