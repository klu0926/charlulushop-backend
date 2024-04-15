const { User } = require('../models')

// check if session is authenticated
async function checkSessionAuth(req, res, next) {
  try {
    if (req.session || !req.session.userId) {
      // 使用 session 中的 userId 來確認
      const userId = req.session.userId
      const user = await User.findByPk(userId, { raw: true, attributes: ['id', 'name'] })

      if (user) {
        req.isAuthenticated = true
        req.user = user
      }
    }
    next()
  } catch (err) {
    console.error(err)
    next(err)
  }
}


module.exports = checkSessionAuth