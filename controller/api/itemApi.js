const { Item, Image, Tag, Item_Tag } = require('../../models')
const { Op } = require('sequelize')
const responseJSON = require('../../helpers/responseJSON')


// Service
async function getItem(itemId) {
  try {
    if (itemId === undefined) throw new Error('Item id is undefined')

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

    // response
    return itemData
  } catch (err) {
    throw err
  }
}

async function getItems(query) {
  try {
    let { queryTag, search } = query ? query : { queryTag: null, search: null }
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
          },
          raw: true
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
    // response
    return itemsData
  } catch (err) {
    throw err
  }
}



// API
const itemApi = {
  getItem: async (req, res, next) => {
    try {
      const itemId = req.params.itemId
      const itemData = await getItem(itemId)
      res.status(200).json(responseJSON(true, 'GET Item', itemData, 'Get Item completed', null))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET Item', null, 'Fail to get Item', err))

    }
  },
  getItems: async (req, res, next) => {
    try {
      const itemsData = await getItems(req.query)
      res.status(200).json(responseJSON(true, 'GET Items', itemsData, 'Get Items completed', null))

    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET Items', null, 'Fail to get Items', err))
    }
  }
}

const services = {
  getItems,
  getItem
}


module.exports = itemApi
module.exports.services = services
