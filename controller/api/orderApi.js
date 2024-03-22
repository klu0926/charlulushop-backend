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
  }
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
      res.status(500).json(responseJSON(false, 'GET Orders', null, 'Fail to get Orders ', err))
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
      console.log('sending email')
      sendEmail(orderData)

      res.status(200).json(responseJSON(true, 'POST', null, 'Post order completed'))

    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'POST', null, 'Fail to post order', err))
    }
  },
  // POST
  // body: status
  changeOrderStatus: async (req, res, next) => {
    try {
      const { orderId, status } = req.body

      await services.changeOrderStatus(orderId, status)
      res.status(200).json(responseJSON(true, 'POST', null, 'Change order status completed'))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'POST', null, 'Fail to change order status', err))

    }
  }
}

module.exports = orderApi
module.exports.services = services
