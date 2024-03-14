const { Tag } = require('../../models')
const responseJSON = require('../../helpers/responseJSON')

async function findTag(tagId) {
  try {
    if (!tagId) throw new Error('No tag id ')
    const tag = await Tag.findOne({
      where: { id: tagId },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      raw: true,
    })
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
    return tags
  } catch (err) {
    console.error(err)
    throw err
  }
}

async function postTag(tagName, tagDescription, tagIcon) {
  try {
    if (!tagName) throw new Error('No tag name')

    // check if a tag with the same name exist
    const oldTag = await Tag.findOne({ where: { name: tagName } })
    if (oldTag) throw new Error('Tag with same name ready exist, name: ' + tagName)

    // create tag
    const tag = await Tag.create({
      name: tagName,
      description: tagDescription || '',
      icon: tagIcon || null
    })
    if (!tag) throw new Error('Can not create new tag:' + tagName)
    return tag
  } catch (err) {
    console.error(err)
    throw err
  }
}

async function deleteTag(tagId) {
  try {
    if (tagId === undefined) throw new Error('Tag id is undefined')
    const deletedCount = await Tag.destroy({ where: { id: tagId } })

    if (deletedCount === 0) throw new Error('Can not delete Tag with id: ', tagId)
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
  postTag: async (req, res, next) => {
    try {
      const { tagName, tagDescription } = req.body
      // currently no tagId
      const tag = await postTag(tagName, tagDescription)
      res.status(200).json(responseJSON(true, 'POST', tag, 'POST tag completed'))
    } catch (err) {
      console.error(err)
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

module.exports = tagApi
module.exports.findTag = findTag
module.exports.findAllTags = findAllTags
module.exports.postTag = postTag
module.exports.deleteTag = deleteTag
