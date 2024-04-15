const { Post, Block } = require('../../models')
const responseJSON = require('../../helpers/responseJSON')
const { getPosts, getPost } = require('../api/postApi').services

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
  getPosts: async (req, res, next) => {
    try {
      const posts = await Post.findAll({
        attributes: {
          exclude: ['createAt', 'updateAt']
        },
        include: [
          {
            model: Block,
            as: 'blocks',
            exclude: ['createAt', 'updateAt']
          }
        ],
        order: [['id', 'DESC']],
        distinct: true,
        raw: true
      })

      if (!posts) throw new Error('Can not find any post')
      res.status(200).json(responseJSON(true, 'GET', posts, '成功取得全部 Posts', null))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(true, 'GET', null, '取得 Posts 失敗', err.message))
    }
  },
  postPost: async (req, res, next) => {
    try {
      // body
      const { title, description } = req.body
      // file
      const file = req.files[0]
      if (!title || !description) throw new Error('缺少 title 或是 description')

      const post = await Post.create({
        title,
        description,
        status: '創作中',
        cover: file.link,
        block_order: JSON.stringify([])
      })

      res.redirect('/posts/')
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(true, 'POST', null, '建立 Posts 失敗', err.message))
    }
  }

}

module.exports = postController