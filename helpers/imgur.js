const fetch = require('node-fetch')
const FormData = require('form-data');
const responseJSON = require('../helpers/responseJSON')
const sharp = require('sharp')
const tinyfy = require('tinify')
tinyfy.key = process.env.TINYFY_API_KEY;
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

const imgurHandler = {
  postImage: (width = 500, height = 400) => {
    return async (req, res, next) => {
      try {
        // get file 
        const file = req.files[0]

        if (!file) throw new Error('imgur: 沒有照片檔案')

        // resize image
        file.resizedBuffer = await sharp(file.buffer).resize(width, height).toBuffer()

        // tinify
        file.resizedBuffer = await tinyfy.fromBuffer(file.resizedBuffer).toBuffer()

        // upload to imgur
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

        // add the imgur image url back to file's property
        file.link = responseData.data.link
        next()
      } catch (err) {
        res.status(500).json(responseJSON(false, 'POST', null, '沒有上傳照片', err.message))
      }
    }

  }
}

module.exports = imgurHandler
