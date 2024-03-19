const { Image } = require('../../models')
const responseJSON = require('../../helpers/responseJSON')


// Service
async function getImage(imageId) {
  try {
    if (!imageId) throw new Error('No id for get image')

    const image = await Image.findByPk(imageId)
    if (!image) throw new Error(`Can not find image with id ${imageId}`)

    return image
  } catch (err) {
    throw err
  }
}

// API
const imageApi = {
  getImage: async (req, res, next) => {
    try {
      const imageId = req.params.imageId
      const image = await getImage(imageId)

      res.contentType('image/jpeg')
      res.send(image.imageData)
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET Image', null, 'Fail to get image', err))
    }
  }
}

const services = {

}


module.exports = imageApi




