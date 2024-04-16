import sweetAlert from '/js/sweetAlert.js'
import coverChange from '/js/helpers/coverChange.js'

(() => {
  const display = document.body.querySelector('#cover-display')
  const imageInput = document.body.querySelector('#imageInput')
  const title = document.body.querySelector('#post-title')
  const description = document.body.querySelector('#post-description')
  const content = document.body.querySelector('#post-content')
  const status = document.body.querySelector('#status-select')
  const save = document.body.querySelector('#save')

  function handleCoverChange(e) {
    try {
      const file = e.target.files[0];
      if (!file) throw new Error('Can not find file')
      coverChange(file, display)
    } catch (err) {
      alert(err)
    }
  }

  async function handleSave() {
    try {
      const post = {
        title: title.innerText.trim(), // text
        description: description.innerText.trim(), // text
        content: content.innerHTML, // html
        status: status.value, // value
        file: imageInput.files[0] // not required
      }

      if (!post.title) throw new Error('需要有標題')
      if (!post.description) throw new Error('需要有介紹')

      await sweetAlert.success('成功儲存')

    } catch (err) {
      await sweetAlert.error('儲存失敗', err.message || err)
    }

  }



  // Action
  save.onclick = handleSave
  display.onclick = () => {
    imageInput.click()
  }
  imageInput.onchange = handleCoverChange

})()