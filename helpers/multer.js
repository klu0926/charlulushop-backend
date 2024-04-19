const multer = require('multer')
const storage = multer.memoryStorage()
const coverUpload = multer({ storage }).single('cover')
const pictureUpload = multer({ storage }).array('picture')

const upload = multer({ storage }).fields([
  {
    name: 'cover',
    maxCount: 1,
  },
  {
    name: 'picture',
    maxCount: 10,
  },
])
module.exports = { coverUpload, pictureUpload, upload }
