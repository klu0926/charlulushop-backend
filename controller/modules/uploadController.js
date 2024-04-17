const responseJSON = require('../../helpers/responseJSON')

const uploadController = {
  uploadImgur: (req, res, next) => {
    try {
      const file = req.files?.[0] || null
      if (!file) throw new Error('沒有檔案')
      if (file && !file.link) throw new Error('上傳到imgur失敗')
      res.status(200).json(responseJSON(true, 'POST upload', file.link, 'Successfully upload to imgur', null))
    } catch (err) {
      res.status(500).json(responseJSON(false, 'POST upload', null, 'Fail to upload file', err.message))
    }

  }
}

module.exports = uploadController