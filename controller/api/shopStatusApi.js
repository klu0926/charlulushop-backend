const shopStatus = require('../../shopStatus')
const responseJSON = require('../../helpers/responseJSON')
const { validateJWT } = require('../../controller/api/authenticationApi').services
const fs = require('fs')
const path = require('path')
const shopStatusPath = path.resolve(__dirname, '../../shopStatus.json')

const shopStatusApi = {
  // return {object} shop status
  // body : JWT : jwt string
  // "isLock": true,
  // "reason": "貨品理貨中",
  // "message": "請等待夏洛特通知開店時間"
  getShopStatus: async (req, res, next) => {
    try {
      console.log('GET shopStatus...')
      const shopStatusObject = shopStatus
      if (!shopStatusObject) throw new Error('找不到 shop status')

      res.status(200).json(responseJSON(true, 'Get Lock status', shopStatusObject, 'Get lock status', null))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET shop status', null, 'Fail to get shop status', err.message))
    }
  },
  // body: JWT, isLock (boolean), reason, message
  postShopStatus: async (req, res, next) => {
    try {
      const { JWT, isLock, reason, message } = req.body
      if (!JWT) throw new Error('沒有傳入JWT')

      if (typeof isLock !== 'boolean') throw new Error('沒有設定 isLock boolean')
      if (!reason.trim() || !message.trim()) throw new Error('沒有設定 reason 跟 message')

      // check JWT
      validateJWT(JWT)

      // post shop status
      const shopStatus = { isLock, reason, message }
      fs.writeFileSync(shopStatusPath, JSON.stringify(shopStatus))

      res.status(200).json(responseJSON(true, 'POST shop status', shopStatus, 'POST shop status completed', null))

    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'POST shop status', null, 'Fail to post shop status', err.message))
    }
  }
}

module.exports = shopStatusApi