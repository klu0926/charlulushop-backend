const flash = {
  getFlash: (req, type) => {
    let message = ''
    const flashArray = req.session.flash
    if (!flashArray) return message
    const index = flashArray.findIndex(f => f.type === type)
    if (index !== -1) message = flashArray[index].message

    // filter array
    const filteredArray = flashArray.filter(f => f.type !== type)
    req.session.flash = filteredArray
    return message
  },
  setFlash: (req, type, message) => {
    if (req.session.flash === undefined) {
      req.session.flash = []
    }
    req.session.flash.push({ type, message })
  }
}

module.exports = flash