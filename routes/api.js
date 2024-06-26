const router = require('express').Router()
// api
const itemApi = require('../controller/api/itemApi.js')
const itemTagApi = require('../controller/api/itemTagApi.js')
const tagApi = require('../controller/api/tagApi.js')
const imageApi = require('../controller/api/imageApi.js')
const orderApi = require('../controller/api/orderApi.js')
const youtubeApi = require('../controller/api/youtubeApi.js')
const shopStatusApi = require('../controller/api/shopStatusApi.js')
const authenticationApi = require('../controller/api/authenticationApi.js')
const postApi = require('../controller/api/postApi.js')


// -------------------- API --------------------- //
// ITEMS
router.get('/items/cart/:itemsIdString', itemApi.getCartItems)
router.get('/items/:itemId', itemApi.getItem)
router.get('/items', itemApi.getItems)

// IMAGES
router.get('/images/:imageId', imageApi.getImage)

// TAGS
// get all tags
router.get('/tags', tagApi.getTags)

// ORDER
router.get('/orders/buyer', orderApi.getOrdersForBuyer)
router.post('/orders/status', orderApi.changeOrderStatus)
router.post('/orders', orderApi.postOrder)
router.delete('/orders/:orderId', orderApi.deleteOrder)

// youtube
router.get('/youtubes/newest', youtubeApi.getNewestVideo)

// shop status api
router.get('/shop-status', shopStatusApi.getShopStatus)
router.post('/shop-status', shopStatusApi.putShopStatus)

// Authentication
router.post('/auth', authenticationApi.postLogin)
router.post('/auth/jwt', authenticationApi.postValidateJWT)
router.post('/auth/jwtServerLogin', authenticationApi.serverLoginWithJWT)

// Tags api
router.get('/tags', tagApi.getTags)
router.get('/tags/:tagId', tagApi.getTag)
router.post('/tags', tagApi.postTag)
router.put('/tags/:tagId', tagApi.putTag)
router.delete('/tags/:tagId', tagApi.deleteTag)

// ItemTags api
router.get('/itemTags', itemTagApi.getItemTags)
router.get('/itemTags/:itemTagId', itemTagApi.getItemTag)
router.post('/itemTags', itemTagApi.postItemTag)
router.delete('/itemTags/:itemTagId', itemTagApi.deleteItemTag)

// itemTag
router.delete('/itemTags/:itemId', itemTagApi.deleteAllItemTag)

// post
router.get('/posts/:id', postApi.getPost)

module.exports = router