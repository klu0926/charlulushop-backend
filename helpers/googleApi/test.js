const fs = require('fs')
const path = require('path')
const dataFilePath = path.resolve(__dirname, 'newVideo.json')



function readDataFile() {
  try {
    console.log('Reading from newVideo.json...')
    const dataString = fs.readFileSync(dataFilePath, 'utf8')
    if (!dataString) throw new Error('Can not read data')

    return JSON.parse(dataString)
  } catch (err) {
    console.log(err)
    return null
  }
}


const data = readDataFile()
console.log(data)