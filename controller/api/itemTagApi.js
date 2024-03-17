const { Item_Tag, Item, Tag } = require('../../models')
const responseJSON = require('../../helpers/responseJSON')


async function findItemTag(itemTagId) {
  try {
    if (itemTagId === undefined) throw new Error('Missing itemId, tagId')
    const itemTag = await Item_Tag.findOne({
      where: { id: itemTagId },
      attributes: ['id', 'tagId', 'itemId'],
      raw: true,
    })
    if (!itemTag) throw new Error('Can not find itemTag')
    return itemTag
  } catch (err) {
    console.error(err)
    throw err
  }
}



async function findAllItemTags() {
  try {
    const itemTags = await Item_Tag.findAll({
      attributes: ['id', 'tagId', 'itemId'],
      raw: true
    })
    if (!itemTags) throw new Error('Can not find itemTags')
    return itemTags
  } catch (err) {
    console.error(err)
    throw err
  }
}

async function postItemTag(itemId, tagId) {
  try {
    if (itemId === undefined || tagId === undefined) {
      throw new Error('Missing itemId or tagId')
    }
    // find item and tag
    const item = await Item.findByPk(itemId)
    const tag = await Tag.findByPk(tagId)
    if (!item && !tag) throw new Error('Can not find item or tag record')

    // create itemTag record
    const itemTag = await Item_Tag.create({
      itemId,
      tagId,
    })
    if (!itemTag) throw new Error('Can not create itemTag')

    // return
    const itemIdData = itemTag.toJSON()
    return itemIdData
  } catch (err) {
    console.error(err)
    throw err
  }
}

async function deleteItemTag(itemTagId) {
  try {
    if (itemTagId === undefined) {
      throw new Error('Missing itemTag id')
    }
    const deletedCount = await Item_Tag.destroy({ where: { id: itemTagId } })
    if (deletedCount === 0) throw new Error('Can not delete itemTag with id :' + itemTagId)

    return deletedCount
  } catch (err) {
    console.error(err)
    throw err
  }
}

async function deleteAllItemTagWithItem(itemId) {
  try {
    if (itemId === undefined) throw new Error('Missing itemId')
    const deleteCount = await Item_Tag.destroy({ where: { itemId } })
    return true
  } catch (err) {
    console.error(err)
    throw err
  }
}

async function deleteAllItemTagWithTag(tagId) {
  try {
    if (tagId === undefined) throw new Error('Missing tagId')
    const deleteCount = await Item_Tag.destroy({ where: { tagId } })
    return true
  } catch (err) {
    console.error(err)
    throw err
  }
}


// API
const itemTagApi = {
  getItemTags: async (req, res, next) => {
    try {
      const itemTags = await findAllItemTags()
      res.status(200).json(responseJSON(true, 'GET', itemTags, 'GET itemTags completed'))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET', null, 'Fail GET itemTags', err))

    }
  },
  getItemTag: async (req, res, next) => {
    try {
      const itemTagId = req.params.itemTagId
      const itemTag = await findItemTag(itemTagId)
      res.status(200).json(responseJSON(true, 'GET', itemTag, 'GET itemTag completed'))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET', null, 'Fail GET itemTag', err))
    }
  },
  postItemTag: async (req, res, next) => {
    try {
      const { itemId, tagId } = req.body
      const itemTagData = await postItemTag(itemId, tagApi)
      res.status(200).json(responseJSON(true, 'POST', itemTagData, 'POST itemTag completed'));
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'POST', null, 'Fail to post itemTag', err))
    }
  },
  deleteItemTag: async (req, res, next) => {
    try {
      const { itemTagId } = req.body
      await deleteItemTag(itemTagId)
      res.status(200).json(responseJSON(true, 'DELETE', null, 'DELETE itemTag completed'));
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'DELETE', null, 'Fail to DELETE itemTag', err))
    }
  },
  deleteAllItemTag: async (req, res, next) => {
    try {
      const { itemId } = req.body
      const deleteCount = await deleteAllItemTagWithItem(itemId)
      res.status(200).json(responseJSON(true, 'DELETE', null, `DELETE item id:${itemId}'s all ${deleteCount} itemTags completed`));
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'DELETE', null, 'Fail to DELETE itemTag', err))

    }
  }
}

const services = {
  findItemTag,
  findAllItemTags,
  postItemTag,
  deleteItemTag,
  deleteAllItemTagWithItem,
  deleteAllItemTagWithTag
}


module.exports = itemTagApi
module.exports.services = services

