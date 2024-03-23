const router = require('express').Router()
// api
const itemApi = require('../controller/api/itemApi.js')
const itemTagApi = require('../controller/api/itemTagApi.js')
const tagApi = require('../controller/api/tagApi.js')
const imageApi = require('../controller/api/imageApi.js')
const orderApi = require('../controller/api/orderApi.js')


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

// buyer post order
// buyer delete order

// admin edit order
// admin delete order

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

// use item id
router.delete('/itemTags/:itemId', itemTagApi.deleteAllItemTag)

module.exports = router