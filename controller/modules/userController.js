
const responseJSON = require('../../helpers/responseJSON')
const bcrypt = require('bcrypt')
const { User } = require('../../models')
const { signJWT } = require('../../controller/api/authenticationApi').services
const flash = require('../../helpers/flash')

const userController = {
  loginPage: (req, res, next) => {
    try {
      res.render('loginPage', { page: 'login' })
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET', null, 'Fail to get login page', err))
    }
  },
  postLogin: async (req, res, next) => {
    try {
      const { name, password } = req.body
      if (!name || !password) throw new Error('Missing name or password')

      // check user
      const user = await User.findOne({
        where: { name },
        attributes: ['id', 'name', 'password'],
        raw: true,
      })
      if (!user) throw new Error('使用者名稱不存在')

      // check password
      const isPassword = await bcrypt.compare(password, user.password)
      if (!isPassword) throw new Error('使用者名稱或密碼錯誤')

      // remove password
      delete user.password

      // set session (user id, jwt)
      req.session.userId = user.id
      const jwt = signJWT({ userId: user.id })

      // don't redirect, send back JWT
      res.status(200).json(responseJSON(true, 'POST', { userId: user.id, jwt }, 'Successfully got JWT', null))
    } catch (err) {
      console.error(err)
      res.status(400).json(responseJSON(false, 'POST', null, 'Login Fail', err))
    }
  },
  getLogout: async (req, res, next) => {
    try {
      await req.session.destroy()
      res.redirect('/users/login')
    } catch (err) {
      console.error(err)
      res.redirect('/users/login')
    }
  }
}


module.exports = userController