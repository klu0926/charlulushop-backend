const responseJSON = require('../../helpers/responseJSON')
const { validateJWT } = require('../../controller/api/authenticationApi').services
const fs = require('fs')
const path = require('path')
const shopStatusPath = path.resolve(__dirname, '../../shopStatus.json')
const { Status } = require('../../models')


const services = {
  getShopStatus: async () => {
    try {
      const status = await Status.findOne({ where: { id: 1 }, raw: true })
      if (!status) throw new Error('找不到 shop status')

      return status
    } catch (err) {
      throw err
    }
  },
  putShopStatus: async (isLock, reason, message) => {
    try {
      const status = await Status.findOne({ where: { id: 1 } })
      if (!status) throw new Error('找不到 shop status')
      status.isLock = isLock
      status.reason = reason
      status.message = message

      await status.save()
      const statusObject = status.toJSON()
      return statusObject
    } catch (err) {
      throw err
    }
  }

}

const shopStatusApi = {
  // return {object} shop status
  // body : JWT : jwt string
  // "isLock": true,
  // "reason": "貨品理貨中",
  // "message": "請等待夏洛特通知開店時間"
  getShopStatus: async (req, res, next) => {
    try {
      const shopStatusObject = await services.getShopStatus()

      res.status(200).json(responseJSON(true, 'Get Lock status', shopStatusObject, 'Get lock status', null))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET shop status', null, 'Fail to get shop status', err.message))
    }
  },
  // body: JWT(optional), isLock (boolean), reason, message
  putShopStatus: async (req, res, next) => {
    try {
      const { JWT, isLock, reason, message } = req.body

      if (typeof isLock !== 'boolean') throw new Error('沒有設定 isLock boolean')
      if (!reason.trim() || !message.trim()) throw new Error('沒有設定 reason 跟 message')

      // check for authenticated
      // on server site use req.isAuthenticated
      // on postman (api) use JWT

      // user cross origin
      if (req.isAuthenticated === undefined) {
        if (!JWT) throw new Error('需要使用ＪＷＴ認證')
        validateJWT(JWT)
      } else {
        // user on server site
        if (!req.isAuthenticated) throw new Error('Authenticated失敗，請嘗試重新登入')
      }

      // post shop status
      const shopStatus = await services.putShopStatus(isLock, reason, message)
      res.status(200).json(responseJSON(true, 'POST shop status', shopStatus, 'POST shop status completed', null))

    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'POST shop status', null, 'Fail to post shop status', err.message))
    }
  }
}

module.exports = shopStatusApi
module.exports.services = services