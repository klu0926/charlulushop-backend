const fetch = require('node-fetch')
const FormData = require('form-data');
const responseJSON = require('../helpers/responseJSON')
const sharp = require('sharp')
const tinyfy = require('tinify')
tinyfy.key = process.env.TINYFY_API_KEY;
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

const imgurHandler = {
  postImage: async (req, res, next) => {
    try {
      // get file 
      const file = req.files[0]
      if (!file) throw new Error('imgur: 沒有照片檔案')

      // resize image
      console.log('using sharp to resize, and convert to webp')
      const WIDTH = 500
      const HEIGHT = 500
      file.resizedBuffer = await sharp(file.buffer).resize(WIDTH, HEIGHT).toBuffer()

      // tinify
      console.log('using tinify to compress')
      file.resizedBuffer = await tinyfy.fromBuffer(file.resizedBuffer).toBuffer()

      // upload to imgur
      console.log('uploading to imgur...')
      const imgurUrl = 'https://api.imgur.com/3/image'
      const formData = new FormData();
      formData.append('image', file.resizedBuffer, { filename: 'image.png' });

      const response = await fetch(imgurUrl, {
        method: 'POST',
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
          ...formData.getHeaders(), // Include boundary and Content-Type headers
        },
        body: formData,
      })
      if (!response.ok) throw new Error(response.statusText)
      const responseData = await response.json();
      file.link = responseData.data.link
      console.log('file uploaded to imgur:', file.link)
      next()
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'POST', null, '上傳照片到imgur失敗', err))
    }
  }
}

module.exports = imgurHandler
