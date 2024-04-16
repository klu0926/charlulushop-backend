const { Post, Block } = require('../../models')
const responseJSON = require('../../helpers/responseJSON')
const { getPosts, getPost, postPost, deletePost } = require('../api/postApi').services

const postController = {
  getPostsPage: async (req, res) => {

    const posts = await getPosts()
    res.render('postsPage', { page: 'post', posts })
  },
  getPostPage: async (req, res) => {
    const post = await getPost(req.params.id)
    res.render('editPostPage', { page: 'post', post })
  },
  getAddPostPage: (req, res) => {
    res.render('addPostPage', { page: 'post' })
  },
  postPost: async (req, res, next) => {
    try {
      // body
      const { title, description, order } = req.body
      // file
      const file = req.files[0]
      if (!file?.link) throw new Error('封面照上傳Imgur失敗')
      if (!title.trim() || !description.trim()) throw new Error('請確定標題、介紹都有填寫')

      const post = await postPost(title, description, file.link)
      if (!post) throw new Error('建立 Post 失敗')

      res.status(200).json(responseJSON(true, 'POST', post, '建立 Post 成功', null))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'POST', null, '建立 Posts 失敗', err.message))
    }
  },
  deletePost: async (req, res, next) => {
    try {

      const id = req.params.id
      if (id === undefined || id === '') throw new Error('Missing post id')
      await deletePost(id)
      res.status(200).json(responseJSON(true, 'DELETE', null, '刪除 Post 成功', null))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'POST', null, '建立 Posts 失敗', err.message))
    }
  }

}

module.exports = postController