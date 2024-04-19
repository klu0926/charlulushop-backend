const router = require('express').Router()
const isAuth = require('../middleware/isAuth.js')
const userController = require('../controller/modules/userController.js')
// routers
const apiRouter = require('./api.js')
const controllerRouter = require('./controller.js')

// user
router.get('/users/login', userController.loginPage)
router.get('/users/logout', userController.getLogout)
router.post('/users/login', userController.postLogin)

// API Routers
router.use('/api', apiRouter)

// controller Routers
router.use('/', isAuth, controllerRouter)

module.exports = router
