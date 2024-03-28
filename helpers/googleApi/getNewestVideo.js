const { google } = require('googleapis')
const path = require('path')
const dayjs = require('dayjs')

// DayFileHelper class
const DayFileHelper = require('./dayFileHelper.js')
const dataFilePath = path.resolve(__dirname, 'newVideo.json')
const timeFilePath = path.resolve(__dirname, 'nextTime.json')
const fileHelper = new DayFileHelper(dataFilePath, timeFilePath)


async function getNewestVideo() {
  try {
    // 檢查是否需要取得資料(一小時一次’)
    const isTime = fileHelper.isReadyToSaveAgain()

    if (!isTime) {
      throw new Error(`還不需要取得新Youtube資料,回傳舊資料, isTime: ${isTime} `)
    }

    // 要求 youtube 資料
    const API_KEY = process.env.YOUTUBE_API_KEY
    const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID
    const GET_VIDEOS_AMOUNT = 5

    const youtube = google.youtube({
      version: 'v3',
      auth: API_KEY
    })

    // youtube.RESOURCE.METHOD
    // - youtube.search for newest videos: 100 quota/request, 10,000 quota/day (100 calls)
    // - Get 5 newest videos: 1-5 videos cost 100 quota
    // RESOURCE: videos, channels, playlists, comments, subscriptions, activity, search
    // METHOD: list(GET), insert, update, delete (search only has list method)
    const response = await youtube.search.list({
      part: 'snippet',
      channelId: YOUTUBE_CHANNEL_ID,
      order: 'date',
      type: 'video', // channel, playlist, video, all
      maxResults: GET_VIDEOS_AMOUNT
    })
    console.log('response.status: ', response.status)

    // 成功獲得 youtube 資料
    if (response.status === 200) {
      // 整理資料
      const videos = response.data.items
      const data = videos.map(video => {
        return {
          videoId: video.id.videoId,
          title: video.snippet.title,
          description: video.snippet.description,
          publishedAt: dayjs(video.snippet.publishedAt).format('DD/MM/YYYY'),
          thumbnails: video.snippet.thumbnails
        }
      })
      // 存資料
      fileHelper.writeDataFile(data)
      // 存時間
      fileHelper.saveNextSaveTime()
      // 回傳檔案
      return data
    } else {
      // 無法獲得 youtube 資料
      // if response fail (capped quota), return old data
      const data = fileHelper.readDataFile()
      return data
    }
  } catch (err) {
    // if error, return old data
    console.error('取得資料失敗：', err.message)
    console.error('回傳舊資料')
    const data = fileHelper.readDataFile()
    return data
  }
}

module.exports = getNewestVideo



