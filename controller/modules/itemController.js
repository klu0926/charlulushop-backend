const { Item, Image, Tag, Item_Tag } = require('../../models')
const responseJSON = require('../../helpers/responseJSON')
const { findAllTags, countAllTags } = require('../api/tagApi').services
const { postItemTag, deleteAllItemTag } = require('../api/itemTagApi').services
const { Op } = require('sequelize')

const itemController = {
  addItemPage: async (req, res, next) => {
    // get tags
    const tagsData = await findAllTags()
    res.render('addItemPage', { tags: tagsData, page: 'add' })
  },
  getItem: async (req, res, next) => {
    try {
      const itemId = req.params.itemId
      const item = await Item.findOne({
        where: { id: itemId },
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        include: [
          {
            model: Image,
            as: 'images',
            attributes: ['id', 'isCover'],
          },
          {
            model: Tag,
            as: 'tags',
            attributes: ['id', 'name'],
            through: {
              model: Item_Tag,
              attributes: [],
            },
          },
        ],
      })
      if (!item) throw new Error(`Can not find item id ${itemId}`)
      const itemData = item.toJSON()

      // create .cover
      itemData.images.forEach(image => {
        if (image.isCover) {
          itemData.cover = image
        } else {
          if (itemData.pictures) {
            itemData.pictures.push(image)
          } else {
            itemData.pictures = [image]
          }
        }
      })
      // get tags for the page
      const tagsData = await findAllTags()
      console.log('get item:', itemData)

      // response
      res.render('itemPage', { item: itemData, tags: tagsData, page: 'edit' })
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET Item', null, err.message))
    }
  },
  getItems: async (req, res, next) => {
    try {
      let { queryTag, search } = req.query
      if (queryTag === 'all') {
        queryTag = ''
      }
      const whereOptions = {
        queryTag: queryTag ? { name: queryTag } : null,
        search: search ? { name: { [Op.like]: '%' + search + '%' } } : null
      }
      const items = await Item.findAll({
        where: whereOptions.search,
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        include: [
          {
            model: Image,
            as: 'images',
            attributes: ['id', 'isCover'],

          },
          {
            model: Tag,
            as: 'tags',
            attributes: ['id', 'name'],
            where: whereOptions.queryTag,
            through: {
              attributes: []
            }
          }
        ],
        order: [['id', 'DESC']],
        distinct: true,
      })
      if (!items) throw new Error('Can not find item table')

      // create .cover for easy access
      const itemsData = items.map(i => {
        const data = i.toJSON()
        data.images.forEach(image => {
          if (image.isCover) data.cover = image
        })
        return data
      })
      // get tags
      const tagsData = await findAllTags()

      // response
      res.render('itemsPage', {
        items: itemsData,
        tags: tagsData,
        page: 'items',
        queryTag: queryTag || 'all',
        search: search || ''
      })
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET Items', null, err.message))
    }
  },
  // params : itemId
  // body: name, description, price, amount
  // files: (no files, use PUT images)
  putItem: async (req, res, next) => {
    try {
      const itemId = req.params.itemId
      const { name, description, price, amount, tags } = req.body

      if (!itemId) throw new Error('Missing item id for update item')
      if (price && price < 0)
        throw new Error('price for item can not be lower than 0')
      if (amount && amount < 0)
        throw new Error('Amount for item can not be lower than 0')

      // update
      // using findOne and save(), because .update() only return number of row effected by the update, instead of the record itself
      const item = await Item.findOne({
        where: {
          id: itemId,
        },
      })
      if (!item) throw new Error('Can not find item to update')
      item.name = name
      item.description = description
      item.price = price
      item.amount = amount
      await item.save()

      // change tag (itemTag)
      // delete all old itemTags
      await deleteAllItemTag(item.id)

      // create all new itemTags
      if (tags) {
        const tagsIdArray = JSON.parse(tags)
        if (tagsIdArray.length !== 0) {
          for (let i = 0; i < tagsIdArray.length; i++) {
            await postItemTag(item.id, tagsIdArray[i])
          }
        }
      }

      // response
      res.redirect(`/items/${itemId}`)
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'PUT Items', null, err.message))
    }
  },
  // body: name, description, price
  // files : cover[0] , picture
  postItem: async (req, res, next) => {
    try {
      const { name, description, price, tags } = req.body
      const files = req.files
      const coverImage = files.cover[0]
      const pictureImages = files.picture

      if (!files) throw new Error('No files for post item')
      if (!name || !description || !price) {
        throw new Error('No required info for post item')
      }
      if (!coverImage) throw new Error('No cover image for post item')

      // create item
      const item = await Item.create({
        name,
        description,
        price,
      })

      // create cover
      const cover = await Image.create({
        imageData: coverImage.buffer,
        itemId: item.id,
        isCover: true,
      })
      if (!cover) throw new Error('Cover can not be created')

      // create pictures
      if (pictureImages) {
        const pictureData = pictureImages.map(image => {
          return {
            imageName: image.originalname,
            imageData: image.buffer,
            itemId: item.id,
            isCover: false,
          }
        })
        await Image.bulkCreate(pictureData)
      }

      // create new tagItem
      if (tags !== undefined && tags !== '') {
        const tagsArray = JSON.parse(tags)
        const itemTagsSeed = tagsArray.map(tagId => {
          return {
            itemId: item.id,
            tagId
          }
        })
        if (itemTagsSeed.length !== 0) {
          Item_Tag.bulkCreate(itemTagsSeed)
        }
      }

      // response
      res.redirect('/items')
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'POST Item', null, err.message))
    }
  },
  // params : itemId
  deleteItem: async (req, res) => {
    try {
      const itemId = req.params.itemId
      if (!itemId) throw new Error('No id for item delete')
      await Item.destroy({ where: { id: itemId } })
      res
        .status(200)
        .json(responseJSON(true, 'DELETE', null, 'Delete item completed'))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'DELETE', null, err.message))
    }
  },
}

module.exports = itemController
