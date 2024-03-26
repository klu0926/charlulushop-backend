const { google } = require('googleapis')
const dayjs = require('dayjs')


async function getYoutubeVideo(videoCount = 1) {
  const API_KEY = process.env.YOUTUBE_API_KEY
  const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

  const youtube = google.youtube({
    version: 'v3',
    auth: API_KEY
  })

  try {
    // youtube.RESOURCE.METHOD
    // RESOURCE: videos, channels, playlists, comments, subscriptions, activity, search(return search result)
    // METHOD: list(GET), insert, update, delete (search only has list method)
    const response = await youtube.search.list({
      part: 'snippet',
      channelId: YOUTUBE_CHANNEL_ID,
      order: 'date',
      type: 'video', // channel, playlist, video, all
      maxResults: videoCount
    })

    // get video url
    const videos = response.data.items

    // formate my video objects
    const data = videos.map(video => {
      return {
        videoId: video.id.videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        publishedAt: dayjs(video.snippet.publishedAt).format('DD/MM/YYYY'),
        thumbnails: video.snippet.thumbnails
      }
    })
    return data
  } catch (err) {
    console.error(err)
    throw err
  }
}

module.exports = getYoutubeVideo



