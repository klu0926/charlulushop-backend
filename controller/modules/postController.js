const responseJSON = require('../../helpers/responseJSON')
const { getPosts, getPost, postPost, putPost, deletePost } = require('../api/postApi').services

const postController = {
  getPostsPage: async (req, res) => {
    const posts = await getPosts()
    res.render('postsPage', { page: 'post', posts })
  },
  getPostPage: async (req, res) => {
    const post = await getPost(req.params.id)
    res.render('editPostPage', { page: 'post', post })
  },
  getViewPostPage: async (req, res) => {
    const post = await getPost(req.params.id)
    res.render('viewPostPage', { page: 'post', post })
  },
  getAddPostPage: (req, res) => {
    res.render('addPostPage', { page: 'post' })
  },
  postPost: async (req, res, next) => {
    try {
      // body
      const { title, description } = req.body
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
  putPost: async (req, res, next) => {
    try {
      console.log('put post...')
      // id
      const id = req.params.id
      if (id === undefined) throw new Error('Missing post id')

      // body
      const { title, description, content, status } = req.body
      // file
      const file = req.files?.[0] || null

      console.log('body:', req.body)

      // validate data
      if (!title?.trim() || !description?.trim()) throw new Error('請確定標題、介紹都有填寫')
      // 有照片，可是沒有 imgur 的 link 代表 imgur middleware 錯誤
      if (file && !file.link) throw new Error('有檔案可是無法生成imgur link')
      const post = await putPost(id, title, description, content, status, file?.link || null)
      if (!post) throw new Error('建立 Post 失敗')

      res.status(200).json(responseJSON(true, 'PUT', post, '更新 Post 成功', null))
      return
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'PUT', null, '更新 Posts 失敗', err.message))
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