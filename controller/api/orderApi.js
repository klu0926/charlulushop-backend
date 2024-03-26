const { Item_Tag, Item, Tag, Order, sequelize } = require('../../models')
const responseJSON = require('../../helpers/responseJSON')
const { getCartItems } = require('./itemApi.js').services
const { Op, where } = require('sequelize')
const sendEmail = require('../../helpers/nodemailer/nodemailer.js')

// Services
const services = {
  getOrders: async (email, ig) => {
    try {
      const whereOptions = {}
      if (email) whereOptions.buyEmail = email
      if (ig) whereOptions.buyerIG = ig

      const orders = await Order.findAll({
        where: whereOptions,
        order: [['id', 'DESC']],
      })
      if (!orders) throw new Error('can not find order table')
      const ordersData = orders.map(o => {
        const data = o.toJSON()
        return data
      })

      // find items
      for (let i = 0; i < ordersData.length; i++) {
        const order = ordersData[i]
        const itemsIds = JSON.parse(order.itemsIds)
        order.items = await getCartItems(itemsIds)
      }

      return ordersData
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  getOrderWithId: async (id) => {
    try {
      const order = await Order.findOne({
        where: { id },
        order: [['id', 'DESC']],
      })
      if (!order) throw new Error('can not find order table')
      const ordersData = order.toJSON()

      // find items
      const itemsIds = JSON.parse(ordersData.itemsIds)
      ordersData.items = await getCartItems(itemsIds)

      return ordersData
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  getOrdersForBuyer: async (name, email) => {
    try {
      if (!name || !email) throw new Error('Missing name and email')
      const whereOptions = {}
      whereOptions.buyerName = name
      whereOptions.buyerEmail = email

      const orders = await Order.findAll({
        where: whereOptions,
        order: [['id', 'DESC']],
      })
      if (!orders) throw new Error('找不到訂單')

      const ordersData = orders.map(o => {
        const data = o.toJSON()
        return data
      })

      // find items
      for (let i = 0; i < ordersData.length; i++) {
        const order = ordersData[i]
        const itemsIds = JSON.parse(order.itemsIds)
        order.items = await getCartItems(itemsIds)
      }

      return ordersData
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  changeOrderStatus: async (orderId, status) => {
    try {
      if (!orderId || !status) throw new Error('Missing orderId and status')
      if (typeof status !== 'string') throw new Error('status needs to be typeof string')

      const order = await Order.findOne({ where: { id: orderId } })

      if (!order) throw new Error(`Can not find order with id ${orderId}`)

      order.status = status
      await order.save()
      return true
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  // 訂單設定為 "取消訂單" (無法回復，會退回物件)
  cancelOrder: async (orderId, status) => {
    try {
      if (!orderId || !status) throw new Error('Missing orderId and status')
      if (status !== '取消訂單') throw new Error('訂單status 不是設定為取消訂單，需要使用 service.changeOrderStatus')

      // TRANSACTION
      await sequelize.transaction(async t => {
        console.log('Start transaction...')
        // find order
        const order = await Order.findOne({ where: { id: orderId } })
        if (!order) throw new Error(`Can not find order with id ${orderId}`)

        // 找出貨物
        const itemsIdsString = order.itemsIds
        if (!itemsIdsString) throw new Error('order do not have itemsIds string')
        const itemsIdsArray = JSON.parse(itemsIdsString)
        if (!Array.isArray(itemsIdsArray)) throw new Error('itemsIdsString fail to JSON.parse to an array')

        // 把貨物加回
        const items = await Item.findAll({
          where: {
            id: { [Op.in]: itemsIdsArray }
          }
        })
        if (!items) throw new Error('Can not find order items')

        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          item.amount++
          await item.save({ transaction: t })
        }

        // 寄出Email通知
        // ...
        // 修改訂單狀態為 '取消訂單'
        order.status = status
        await order.save({ transaction: t })
      })
      console.log('Transaction successful');

      return true
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  // 刪除訂單 (需要在訂單狀態設定於'取消訂單'以後才能使用)
  deleteOrder: async (orderId) => {
    try {
      // find order
      const order = await Order.findOne({ where: { id: orderId } })
      if (!order) throw new Error('Can not find order ' + orderId)

      // check order status= 取消訂單
      if (order.status !== '取消訂單') throw new Error('訂單狀態不是"取消訂單"無法刪除，請先取消訂單')

      // delete order
      await order.destroy()
      return true
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  postOrder: async (itemsIds, buyerName, buyerEmail, buyerIG, price) => {
    try {
      // check validate
      if (!itemsIds || !Array.isArray(itemsIds) || itemsIds.length === 0) throw new Error('Missing items id, or itemsIds is not an array')
      if (!buyerName || !buyerEmail) {
        throw new Error('Missing buyer info')
      }
      if (price === undefined) throw new Error('price is undefined')

      // if items in stock
      const orderItemsCount = itemsIds.length
      const stockItems = await getCartItems(itemsIds)

      if (!stockItems) throw new Error('Fail to get stock items')
      if (stockItems.length !== orderItemsCount) throw new Error(`Missing item in stock, order items count: ${orderItemsCount}, stock items count: ${stockItems.length}`)

      // check items amount
      let inStock = true
      stockItems.forEach(item => {
        if (!item.amount) inStock = false
      })
      if (!inStock) throw new Error('Some item(s) is sold out')


      // START TRANSACTIONS
      let newOrder = null
      await sequelize.transaction(async (t) => {
        const orderItems = await Item.findAll({
          where: {
            id: {
              [Op.in]: itemsIds
            }
          }
        })
        if (orderItems.length !== stockItems.length) throw new Error('Order items and stock items out of sync')

        // remove item amount
        for (let i = 0; i < orderItems.length; i++) {
          // decrement item amount by 1
          const item = orderItems[i];
          if (item.amount > 0) {
            item.amount -= 1;
            await item.save({ transaction: t });
          } else {
            throw new Error(`Item ${item.id} is out of stock`);
          }
        }

        // Create order record
        newOrder = await Order.create({
          itemsIds: JSON.stringify(itemsIds),
          buyerName: buyerName,
          buyerEmail: buyerEmail,
          buyerIG: buyerIG,
          price: price,
          status: '等待聯繫'
        }, { transaction: t });
      });
      console.log('Transaction successful');

      // get order data
      const orderData = await services.getOrderWithId(newOrder.id)

      return orderData
    } catch (err) {
      console.error(err)
      throw err
    }
  },

}


// API
const orderApi = {
  // query: buyerEmail, buyerIG
  getOrdersForBuyer: async (req, res, next) => {
    try {
      const { buyerName, buyerEmail } = req.query
      const ordersData = await services.getOrdersForBuyer(buyerName, buyerEmail)
      res.status(200).json(responseJSON(true, 'GET Orders', ordersData, 'Get orders completed'))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET Orders', null, 'Fail to get Orders ', err.message))
    }
  },
  postOrder: async (req, res, next) => {
    try {
      const { itemsIdsString, buyerName, buyerEmail, buyerIG, price } = req.body

      if (!itemsIdsString) throw new Error('req.body does not have itemsIdsString')

      const itemsIds = JSON.parse(itemsIdsString)
      if (!Array.isArray(itemsIds)) throw new Error('itemsIdsString can not parse to array')

      const orderData = await services.postOrder(itemsIds, buyerName, buyerEmail, buyerIG, price)

      // send email
      sendEmail(orderData)

      res.status(200).json(responseJSON(true, 'POST', null, 'Post order completed'))

    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'POST', null, 'Fail to post order', err.message))
    }
  },
  // POST
  // body: status
  changeOrderStatus: async (req, res, next) => {
    try {
      const { orderId, status } = req.body

      if (orderId === undefined || !status) throw new Error('Missing orderId or status')

      if (status === '取消訂單') {
        await services.cancelOrder(orderId, status)
      } else {
        await services.changeOrderStatus(orderId, status)
      }

      res.status(200).json(responseJSON(true, 'POST', null, 'Change order status completed'))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'POST', null, 'Fail to change order status', err.message))

    }
  },
  deleteOrder: async (req, res, next) => {
    try {
      const orderId = req.params.orderId
      if (orderId === undefined) throw new Error('Missing order id')
      await services.deleteOrder(orderId)

      res.status(200).json(responseJSON(true, 'DELETE', null, 'Delete order completed'))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'DELETE', null, 'Fail to delete order', err.message))

    }
  }
}

module.exports = orderApi
module.exports.services = services
