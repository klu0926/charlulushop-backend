const { User } = require('../../models')
const responseJSON = require('../../helpers/responseJSON')
const bcrypt = require('bcrypt')
const jwt = require('jsonWebToken')
const SECRET = process.env.SECRET

const services = {
  signJWT: (payload, expired = '24h') => {
    try {
      const jwtString = jwt.sign(payload, SECRET, { expiresIn: expired })
      return jwtString
    } catch (err) {
      throw err
    }
  },
  validateJWT: (token) => {
    // return if JWT is valid
    try {
      var decoded = jwt.verify(token, SECRET);
      return decoded
    } catch (err) {
      throw err
    }
  }
}

// API
const authenticationApi = {
  // body: name, password
  postLogin: async (req, res, next) => {
    // check username, password, return JWT
    try {
      const { name, password } = req.body
      if (!name || !password) throw new Error('缺少名稱或密碼')

      // get User
      const user = await User.findOne(
        {
          where: { name },
          attributes: ['id', 'name', 'password'],
          raw: true
        }
      )
      if (!user) throw new Error('不存在的使用者名稱')

      // check password
      const isPassword = bcrypt.compareSync(password, user.password)
      if (!isPassword) throw new Error('使用者名稱或信箱錯誤')

      // return JWT
      const jwtString = services.signJWT({ name: name })

      if (!jwtString) throw new Error('生產JWT失敗')

      res.status(200).json(responseJSON(true, 'POST login', { jwt: jwtString }, 'successfully login and generate JWT', null))

    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'POST front jwt', null, 'Fail to post frontend jwt', err.message))
    }
  },
  // body : JWT
  postValidateJWT: (req, res, next) => {
    try {
      const { JWT } = req.body
      if (!JWT) throw new Error('沒有傳入JWT')

      const decoded = services.validateJWT(JWT)

      res.status(200).json(responseJSON(true, 'POST validate JWT', decoded, 'Successfully valid JWT', null))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'POST validate JWT', null, 'Fail to validate JWT', err.message))
    }
  }
}
module.exports = authenticationApi
module.exports.services = services