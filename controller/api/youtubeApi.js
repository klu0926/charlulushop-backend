const getYoutubeVideo = require('../../helpers/googleApi/getNewestVideo')
const responseJSON = require('../../helpers/responseJSON')

const youtubeApi = {
  getNewestVideo: async (req, res, next) => {
    try {
      const videos = await getYoutubeVideo()

      res.status(200).json(responseJSON(true, 'GET Video', videos, 'Get video completed', sassNull))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET Video', null, 'Get video Fail', err.message))
    }
  }
}

module.exports = youtubeApi