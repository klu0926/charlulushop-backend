const router = require('express').Router()
const { upload } = require('../helpers/multer')
const { resize } = require('../helpers/sharp.js')
// controller
const itemController = require('../controller/modules/itemController.js')
const imageController = require('../controller/modules/imageController')
const userController = require('../controller/modules/userController.js')
// api
const apiRouter = require('./api.js')
// isAuth
const isAuth = require('../middleware/isAuth.js')

// ---------------- CONTROLLER ----------------- //
// root
router.get('/', (req, res) => res.redirect('/items'))

// Items
router.get('/items/add', isAuth, itemController.addItemPage)
router.get('/items/:itemId', itemController.getItem)
router.get('/items', isAuth, itemController.getItems)
router.put('/items/:itemId', itemController.putItem)
router.post('/items', upload, resize, itemController.postItem)
router.delete('/items/:itemId', itemController.deleteItem)

// Images
router.get('/images/:imageId', imageController.getImage)
router.put('/images/:imageId', upload, resize, imageController.putImage)
router.post('/images', upload, resize, imageController.postImage)
router.delete('/images/:imageId', imageController.deleteImage)

// Tags
router.get('/tags/add', isAuth, (req, res) => {
  res.render('addTagsPage', { page: 'tags' })
})

// User
router.get('/users/login', userController.loginPage)
router.get('/users/logout', userController.getLogout)
router.post('/users/login', userController.postLogin)

// API
router.use('/api', apiRouter)
module.exports = router
