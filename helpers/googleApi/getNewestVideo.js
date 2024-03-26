const { google } = require('googleapis')
const fs = require('fs')
const path = require('path')
const dayjs = require('dayjs')
const dataFilePath = path.resolve(__dirname, 'newVideo.json')


function writeDataFile(data) {
  try {
    if (!data) throw new Error('No data input')
    fs.writeFileSync(dataFilePath, JSON.stringify(data))
  } catch (err) {
    console.error(err)
  }
}

function readDataFile() {
  console.log('read Data file')
  try {
    const dataString = fs.readFileSync(dataFilePath, 'utf8')
    if (!dataString) throw new Error('Can not read data')
    return JSON.parse(dataString)
  } catch (err) {
    console.log(err)
    return null
  }
}

// Using youtube.search to get the newest video will cost 100 quota per request
// Daily quota per project is 10,000, which is only 100 calls
// Get 5 newest videos ( 1 - 5 videos cost the same for 100 quota )
async function getNewestVideo() {
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
      maxResults: 5
    })

    console.log('response.status: ', response.status)

    if (response.status === 200) {
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
      // save
      writeDataFile(data)
      return data
    } else {
      // read old data
      const data = readDataFile()
      return data
    }
  } catch (err) {
    console.log('err:', err.message)
    const data = readDataFile()
    return data
  }
}

module.exports = getNewestVideo



