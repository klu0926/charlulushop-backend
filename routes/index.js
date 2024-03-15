const router = require('express').Router()
const { upload } = require('../helpers/multer')
const { resize } = require('../helpers/sharp.js')
// controller
const itemController = require('../controller/modules/itemController.js')
const imageController = require('../controller/modules/imageController')
// api
const itemTagApi = require('../controller/api/itemTagApi.js')
const tagApi = require('../controller/api/tagApi.js')


// ---------------- CONTROLLER ----------------- //
// Items
router.get('/items/add', itemController.addItemPage)
router.get('/items/:itemId', itemController.getItem)
router.get('/items', itemController.getItems)
router.get('/', (req, res) => res.redirect('/items/add'))
router.put('/items/:itemId', itemController.putItem)
router.post('/items', upload, resize, itemController.postItem)
router.delete('/items/:itemId', itemController.deleteItem)

// Images
router.get('/images/:imageId', imageController.getImage)
router.put('/images/:imageId', upload, resize, imageController.putImage)
router.post('/images', upload, resize, imageController.postImage)
router.delete('/images/:imageId', imageController.deleteImage)

// Tags
router.get('/tags/add', (req, res) => {
  res.render('addTagsPage', { page: 'tags' })
})


// -------------------- API --------------------- //
// Tags api
router.get('/api/tags', tagApi.getTags)
router.get('/api/tags/:tagId', tagApi.getTag)
router.post('/api/tags', tagApi.postTag)
router.put('/api/tags/:tagId', tagApi.putTag)
router.delete('/api/tags/:tagId', tagApi.deleteTag)

// ItemTags api
router.get('/api/itemTags', itemTagApi.getItemTags)
router.get('/api/itemTags/:itemTagId', itemTagApi.getItemTag)
router.post('/api/itemTags', itemTagApi.postItemTag)
router.delete('/api/itemTags/:itemTagId', itemTagApi.deleteItemTag)
// use item id
router.delete('/api/itemTags/:itemId', itemTagApi.deleteAllItemTag)

module.exports = router
