const { getShopStatus } = require('../api/shopStatusApi').services

const statusController = {
  getStatusPage: async (req, res, next) => {
    const shopStatusObject = getShopStatus()
    const isLock = shopStatusObject.isLock
    const reason = shopStatusObject.reason
    const message = shopStatusObject.message

    res.render('statusPage', { isLock, reason, message })
  }
}
module.exports = statusController