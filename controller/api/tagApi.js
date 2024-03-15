const { Tag, Item_Tag } = require('../../models')
const responseJSON = require('../../helpers/responseJSON')

async function findTag(tagId) {
  try {
    if (!tagId) throw new Error('No tag id ')
    const tag = await Tag.findOne({
      where: { id: tagId },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      raw: true,
    })

    // find ItemTag count
    const count = await Item_Tag.count({ where: { tagId } })
    tag.itemsCount = count

    return tag
  } catch (err) {
    console.error(err)
    throw err
  }
}

async function findAllTags() {
  try {
    const tags = await Tag.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      raw: true
    })
    if (tags) {
      for (const tag of tags) {
        const count = await Item_Tag.count({ where: { tagId: tag.id } })
        tag.itemsCount = count
      }
    }
    return tags
  } catch (err) {
    console.error(err)
    throw err
  }
}

async function putTag(tagId, newTagName) {
  try {
    if (!newTagName) throw new Error('沒有新標籤名稱')
    if (tagId === undefined) throw new Error('沒有標籤ID')
    const updateCount = await Tag.update(
      { name: newTagName }, { where: { id: tagId } })
    return updateCount
  } catch (err) {
    console.error(err)
    throw err
  }
}

async function postTag(tagName, tagDescription, tagIcon) {
  try {
    if (!tagName) throw new Error('沒有標籤名稱')

    // check if a tag with the same name exist
    const oldTag = await Tag.findOne({ where: { name: tagName } })
    if (oldTag) throw new Error('標籤名稱已經存在了: ' + tagName)

    // create tag
    const tag = await Tag.create({
      name: tagName,
      description: tagDescription || '',
      icon: tagIcon || null
    })
    if (!tag) throw new Error('標籤新增失敗: ' + tagName)
    return tag
  } catch (err) {
    console.error(err)
    throw err
  }
}

async function deleteTag(tagId) {
  try {
    if (tagId === undefined) throw new Error('沒有標籤ID')
    const deletedCount = await Tag.destroy({ where: { id: tagId } })

    if (deletedCount === 0) throw new Error('刪除標籤失敗，標籤ID: ', tagId)
    return deletedCount
  } catch (err) {
    console.error(err)
    throw err
  }
}


// API
const tagApi = {
  getTags: async (req, res, next) => {
    try {
      const tagsData = await findAllTags()
      res
        .status(200)
        .json(responseJSON(true, 'GET', tagsData, 'GET tags completed'))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET', null, 'Fail to get all Tags', err))
    }
  },
  getTag: async (req, res, next) => {
    try {
      const tagId = req.params.tagId
      const tag = await findTag(tagId)
      res.status(200).json(responseJSON(true, 'GET', tag, 'GET tag completed'))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET', null, 'Fail to get Tag', err))
    }
  },
  putTag: async (req, res, next) => {
    try {
      const { tagName } = req.body
      console.log('body', req.body)
      const tagId = req.params.tagId

      console.log('tagName', tagName)
      console.log('tagId', tagId)

      await putTag(tagId, tagName)
      res.status(200).json(responseJSON(true, 'PUT', null, 'PUT tag completed'))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'PUT', null, 'Fail to PUT Tag', err))
    }
  },
  postTag: async (req, res, next) => {
    try {
      const { tagName, tagDescription } = req.body
      // currently no tagId
      const tag = await postTag(tagName, tagDescription)
      res.status(200).json(responseJSON(true, 'POST', tag, 'POST tag completed'))
    } catch (err) {
      console.error('second erro', err)
      res.status(500).json(responseJSON(false, 'POST', null, 'Fail to post Tag', err))
    }
  },
  deleteTag: async (req, res, next) => {
    try {
      await deleteTag(req.params.tagId)
      res.status(200).json(responseJSON(true, 'DELETE', null, 'DELETE tag completed'))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'DELETE', null, 'Fail to DELETE Tag', err))
    }
  }
}


const services = {
  findTag,
  findAllTags,
  postTag,
  deleteTag
}
module.exports = tagApi
module.exports.services = services

