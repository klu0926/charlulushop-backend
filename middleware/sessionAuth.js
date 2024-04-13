const { User } = require('../models')

// check if session is authenticated
async function checkSessionAuth(req, res, next) {
  try {
    let isAuthenticated = false
    let user = null

    if (req.session || !req.session.userId) {
      // 使用 session 中的 userId 來確認
      const userId = req.session.userId
      user = await User.findByPk(userId, { raw: true, attributes: ['id', 'name'] })

      if (user) {
        isAuthenticated = true
        req.isAuthenticated = isAuth
        req.user = user
      }
    }

    function isAuth() {
      return isAuthenticated
    }
    next()
  } catch (err) {
    console.error(err)
    next(err)
  }
}


module.exports = checkSessionAuth