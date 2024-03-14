const { Image } = require('../../models')
const responseJSON = require('../../helpers/responseJSON')

const imageController = {
  // params: imageId
  getImage: async (req, res, next) => {
    try {
      const imageId = req.params.imageId
      if (!imageId) throw new Error('No id for get image')

      const image = await Image.findByPk(imageId)
      if (!image) throw new Error(`Can not find image with id ${imageId}`)

      res.contentType('image/jpeg')
      res.send(image.imageData)
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET', null, err))
    }
  },
  // params: imageId
  // files : 1 cover or 1 picture
  putImage: async (req, res, next) => {
    try {
      const imageId = req.params.imageId
      const files = req.files

      if (!imageId) throw new Error('No image id to update image')
      if (!files) throw new Error('No req.files to update image')

      const cover = files.cover?.[0]
      const picture = files.picture?.[0]

      if (!cover && !picture) throw new Error('No cover or picture to update')
      if (cover && picture) throw new Error('Not allow to update both cover and picture at once')

      let file = cover ? cover : picture

      await Image.update(
        {
          imageData: file.buffer,
        },
        {
          where: {
            id: imageId,
          },
        }
      )

      res.status(200).json(responseJSON(true, 'PUT', null, 'put image completed'))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'PUT', null, err))
    }
  },
  // body: itemId
  // files: (1 cover / 1 picture)
  postImage: async (req, res, next) => {
    try {
      const itemId = req.body.itemId
      const files = req.files

      if (!itemId) throw new Error('No item id for post image')
      if (!files) throw new Error('No files for post image')

      const cover = files.cover?.[0]
      const picture = files.picture?.[0]

      if (!cover && !picture) throw new Error('No cover or picture to post')
      if (cover && picture) throw new Error('Not allow to post both cover and picture at once')

      let file = cover ? cover : picture
      let fileName = cover ? 'cover' : 'picture'

      // prevent duplicate cover
      if (file === cover) {
        const oldCover = await Image.findOne({
          where: { itemId, isCover: true },
        })
        if (oldCover) throw new Error('Cover already exist, please use PUT to update cover')
      }
      await Image.create({
        imageName: fileName,
        imageData: file.buffer,
        itemId,
        isCover: file === cover,
      })
      res.status(200).json(responseJSON(true, 'POST', null, 'post image completed'))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'POST', null, err.message))
    }
  },
  // params : imageId
  deleteImage: async (req, res, next) => {
    try {
      const imageId = req.params.imageId
      if (!imageId) throw new Error('No id for delete image')

      await Image.destroy({ where: { id: imageId } })
      res.status(200).json(responseJSON(true, 'DELETE', null, 'Delete image completed'))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'DELETE', null, err.message))
    }
  },
}

module.exports = imageController
