const sharp = require('sharp')

async function resizeFile(file) {
  const width = 500
  const height = 500
  return new Promise(async (resolve, reject) => {
    try {
      const resizedBuffer = await sharp(file.buffer).resize({ width, height }).toBuffer()

      file.buffer = resizedBuffer
      resolve(file)
    } catch (err) {
      reject(err)
    }
  })
}
async function resize(req, res, next) {
  try {
    // files with the same name use name as key in req.files
    // each req.files[fileName] is an object array
    if (req.files) {
      for (const key of Object.keys(req.files)) {
        await Promise.all(req.files[key].map(resizeFile))
      }
    }
    next()
  } catch (err) {
    console.error('Error resizing images', err)
    res.status(500).json({ message: 'Fail to resize images' })
  }
}
module.exports = { resize }
