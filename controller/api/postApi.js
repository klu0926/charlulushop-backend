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
  },
  postPost: async (title, coverUrl) => {
    try {
      // check missing
      // check if missing anything
      if (!title) throw new Error('Missing title')
      if (!coverUrl) throw new Error('Missing image url')

      const post = await Post.create({
        title,
        cover: coverUrl,
      })
      return post.toJSON()
    } catch (err) {
      throw err
    }
  },
  putPost: async (id, title, content, status, coverUrl) => {
    try {
      // check missing
      // check if missing anything
      if (id === undefined) throw new Error('Missing post id')
      if (!title) throw new Error('Missing title')
      if (!status) throw new Error('Missing status')

      // update post
      const post = await Post.findOne({ where: { id } })

      if (!post) throw new Error(`Can not find post with id ${id}`)

      if (title) post.title = title
      if (status) post.status = status
      if (content) post.content = content
      if (coverUrl) post.cover = coverUrl
      await post.save()

      // update block
      return post.toJSON()
    } catch (err) {
      throw err
    }
  },
  deletePost: async (id) => {
    try {
      if (id === undefined) throw new Error('No post id')
      const post = await Post.findOne({
        where: { id }
      })
      if (!post) throw new Error(`找不到貼文 id:${id}`)
      await Post.destroy({ where: { id } })
      return true
    } catch (err) {
      throw err
    }
  },
}


const postApiController = {
  getPost: async (req, res, next) => {
    try {
      const id = req.params.id
      const post = await services.getPost(id)
      if (!post) throw new Error('無法取得推文')

      res.status(200).json(responseJSON(true, 'GET', post, 'Successfully GET Post', null))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET', null, 'Fail to GET Post', err.message))
    }

  }
}


module.exports = postApiController
module.exports.services = services