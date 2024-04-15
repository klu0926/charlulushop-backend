const { Post } = require('../../models')
const responseJSON = require('../../helpers/responseJSON')

// Service
const services = {
  getPosts: async () => {
    try {
      const posts = await Post.findAll({
        order: [['id', 'DESC']],
      })
      const postsData = posts.map(p => {
        return p.toJSON()
      })
      return postsData

    } catch (err) {
      throw err
    }
  },
  getPost: async (id) => {
    try {
      if (id === undefined) throw new Error('No post id')
      const post = await Post.findOne({
        where: { id }
      })
      const postData = post.toJSON()
      return postData
    } catch (err) {
      throw err
    }
  }
}



module.exports.services = services