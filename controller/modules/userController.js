
const responseJSON = require('../../helpers/responseJSON')

const userController = {
  login: (req, res, next) => {
    try {
      res.send('login page')
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET', null, 'Fail to get login page', err))
    }
  }
}


module.exports = userController