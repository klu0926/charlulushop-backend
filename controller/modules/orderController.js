const responseJSON = require('../../helpers/responseJSON')
const { getOrders } = require('../api/orderApi').services

const orderController = {
  // query; email, ig
  getOrders: async (req, res, next) => {
    try {
      const { filter = '全部', search } = req.query
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


      let filteredOrders = orders
      // 每一次都抓全部，要是使用filter, search 功能就在這邊filter
      // 全部訂單就使用原本的 orders

      // 還未完成的定單 
      if (filter === '未完成') {
        filteredOrders = orders.filter(order => order.status !== '交易完成')
      }
      // 已經完成的訂單 
      if (filter === '完成') {
        filteredOrders = orders.filter(order => order.status === '交易完成')
      }
      // filter the order again with search
      // search: email
      if (search && search.includes('@')) {
        filteredOrders = filteredOrders.filter(order => order.buyerEmail === search)
      }
      // search: name
      if (search && !search.includes('@')) {
        filteredOrders = filteredOrders.filter(order => order.buyerName === search)
      }
      
      res.render('orderPage', { page: 'orders', orders: filteredOrders, totalPrice, completedOrders, activeOrders, inCompletedOrder, filter, search })
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET Orders', null, err.message))
    }
  }

}
module.exports = orderController