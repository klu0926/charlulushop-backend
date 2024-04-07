const shopStatus = require('../../shopStatus')
const responseJSON = require('../../helpers/responseJSON')

const shopStatusApi = {
  // return {object} shop status
  // 
  getLock: async (req, res, next) => {
    try {
      const shopStatusObject = shopStatus
      if (!shopStatusObject) throw new Error('找不到 shop status')

      res.status(200).json(responseJSON(true, 'Get Lock status', shopStatusObject, 'Get lock status', null))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'get lock status', null, 'Fail to get lock status', err.message))
    }

  },
  postLock: async (req, res, next) => {

  }
}

module.exports = shopStatusApi