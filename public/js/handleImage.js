import sweetAlert from "./sweetAlert.js"

class HandleImage {
  constructor() {
    this.pictures = document.querySelectorAll('.picture')

  }
  handleAllPictureClick() {
    try {
      this.pictures.forEach(p => {
        const url = p.src

        if (!url) throw new Error('url is undefined')
        p.onclick = () => {
          sweetAlert.image(url, '400')
        }

      })
    } catch (err) {
      console.error('[Error] handleAllPictureClick :' + err)
    }
  }
  handlePictureClick(picture) {
    try {
      if (!picture) throw new Error('image is undefined')
      const url = picture.src
      if (!url) throw new Error('url is undefined')
      picture.onclick = () => {
        sweetAlert.image(url, '400')
      }
    } catch (err) {
      console.error('[Error] handlePictureClick : ' + err)
    }
  }
}
export default HandleImage