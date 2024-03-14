const router = require('express').Router()
const { upload } = require('../helpers/multer')
const { resize } = require('../helpers/sharp.js')
// controller
const itemController = require('../controller/modules/itemController.js')
const imageController = require('../controller/modules/imageController')
// api
const tagApi = require('../controller/api/tagApi.js')

// items
router.get('/items/add', itemController.addItemPage)
router.get('/items/:itemId', itemController.getItem)
router.get('/items', itemController.getItems)
router.get('/', (req, res) => res.redirect('/items/add'))
router.put('/items/:itemId', itemController.putItem)
router.post('/items', upload, resize, itemController.postItem)
router.delete('/items/:itemId', itemController.deleteItem)

// images
router.get('/images/:imageId', imageController.getImage)
router.put('/images/:imageId', upload, resize, imageController.putImage)
router.post('/images', upload, resize, imageController.postImage)
router.delete('/images/:imageId', imageController.deleteImage)

// tags
router.get('/tags', tagApi.getTags)

module.exports = router
