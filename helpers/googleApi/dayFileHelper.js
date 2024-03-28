const fs = require('fs')
const dayjs = require('dayjs')

class DayFileHelper {
  constructor(dataFilePath, timeFilePath) {
    if (!dataFilePath || !timeFilePath) {
      throw new Error('Data and Time file paths must be provided!')
    }
    this.filePath = dataFilePath
    this.timeFilePath = timeFilePath
  }
  writeDataFile(data) {
    try {
      console.log('write data file...')
      if (!data) throw new Error('No data input')
      fs.writeFileSync(this.filePath, JSON.stringify(data))
    } catch (err) {
      console.error(err)
      throw err
    }
  }
  readDataFile() {
    try {
      console.log('read data file...')
      const dataString = fs.readFileSync(this.filePath, 'utf8')
      if (!dataString) throw new Error('Can not read data')
      return JSON.parse(dataString)
    } catch (err) {
      console.err(err)
      throw err
    }
  }
  saveNextSaveTime() {
    try {
      // next save time = now + 1 hour
      const now = new Date()
      const nextHour = dayjs(now).add(1, 'hour')['$d']
      fs.writeFileSync(this.timeFilePath, JSON.stringify(nextHour))

      console.log('saving next time...')
      console.log('now: ', now)
    } catch (err) {
      console.error(err)
      throw err
    }
  }
  isReadyToSaveAgain() {
    try {
      // read date file
      const saveTimeJSON = fs.readFileSync(this.timeFilePath, 'utf8')
      if (!saveTimeJSON || saveTimeJSON.length === 0) {
        return true
      }
      const saveTime = dayjs(JSON.parse(saveTimeJSON))
      const now = dayjs()
      const isBefore = saveTime.isBefore(now)

      console.log('isBefore: ', isBefore)
      return isBefore
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}

module.exports = DayFileHelper