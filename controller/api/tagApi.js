const { Tag } = require('../../models')
const responseJSON = require('../../helpers/responseJSON')

async function findTag(tagId) {
  try {
    if (tagId) throw new Error('No tag id ')
    const tag = await Tag.findOne({ where: { id: tagId } })
    const tagData = tag.toJSON()
    return tagData
  } catch (err) {
    console.error(err)
    throw err
  }
}

async function findAllTags() {
  try {
    const tags = await Tag.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    })
    const tagsData = tags.map(t => t.toJSON())
    return tagsData
  } catch (err) {
    console.log(err)
    throw err
  }
}

// CONTROLLER
const tagApi = {
  getTags: async (req, res, next) => {
    try {
      const tagsData = await useFindAllTag()
      res
        .status(200)
        .json(responseJSON(true, 'GET', tagsData, 'GET tags completed'))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET', null, 'Fail get Tags'))
    }
  },
}

module.exports = tagApi
module.exports.findTag = findTag
module.exports.findAllTags = findAllTags
