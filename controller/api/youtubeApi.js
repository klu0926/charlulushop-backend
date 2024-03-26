const { sassNull } = require('sass')
const getYoutubeVideo = require('../../helpers/googleApi/getYoutubeVideo')
const responseJSON = require('../../helpers/responseJSON')

const youtubeApi = {
  // query : count
  getVideo: async (req, res, next) => {
    try {
      const { count } = req.query
      const videos = await getYoutubeVideo(count || 1)

      res.status(200).json(responseJSON(true, 'GET Video', videos, 'Get video completed', sassNull))
    } catch (err) {
      console.error(err)
      res.status(500).json(responseJSON(false, 'GET Video', null, 'Get video Fail', err.message))
    }
  }
}

module.exports = youtubeApi