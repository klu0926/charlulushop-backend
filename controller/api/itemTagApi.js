const { Item_Tag, Item, Tag } = require('../../models')
const responseJSON = require('../../helpers/responseJSON')


async function findItemTag(itemId, tagId) {
  try {
    if (itemId === undefined || tagId === undefined) {
      throw new Error('Missing itemId, tagId')
    }
    console.log('itemId', itemId)
    console.log('tagId', tagId)
    const itemTag = await Item_Tag.findOne({ where: { itemId, tagId } })
    if (!itemTag) throw new Error('Can not find itemTag')
    const itemTagData = itemTag.toJSON()
    return itemTagData
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
    const deletedRecordCount = await Item_Tag.destroy({ where: { id: itemTagId } })
    return deletedRecordCount
  } catch (err) {
    console.error(err)
    throw err
  }
}



// CONTROLLER
const itemTagApi = {
  postItemTag: async (req, res, next) => {
    try {
      const { itemId, tagId } = req.body
      const itemTagData = await postItemTag(itemId, tagApi)
      res
        .status(200)
        .json(
          responseJSON(
            true,
            'POST',
            itemTagData,
            'POST itemTag completed',
            null,
          ),
        )
    } catch (err) {
      console.error(err)
      res
        .status(500)
        .json(responseJSON(false, 'POST', null, 'Fail to post itemTag', err))
    }
  },
}


module.exports = itemTagApi
module.exports.findItemTag = findItemTag
module.exports.postItemTag = postItemTag
module.exports.deleteItemTag = deleteItemTag
