const router = require('express').Router()
const { upload } = require('../helpers/multer')
const { resize } = require('../helpers/sharp.js')

// api
const itemApi = require('../controller/api/itemApi.js')
const itemTagApi = require('../controller/api/itemTagApi.js')
const tagApi = require('../controller/api/tagApi.js')


// -------------------- API --------------------- //
// ITEMS
// get all items
router.get('/items/:itemId', itemApi.getItem)
router.get('/items', itemApi.getItems)


// get single item

// TAGS
// get all tags

// ORDER
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