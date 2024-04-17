import sweetAlert from '/js/sweetAlert.js'
import coverChange from '/js/helpers/coverChange.js'

(() => {
  const imageDisplay = document.body.querySelector('#image-display')
  const imageInput = document.body.querySelector('#imageInput')
  const form = document.body.querySelector('#post-form')
  const submit = document.body.querySelector('#post-submit')

  function handleImageChange(e) {
    try {
      const file = e.target.files[0];
      coverChange(file, imageDisplay)
    } catch (err) {
      alert(err)
    }
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault()
      // check for validation
      const formData = new FormData(form)
      if (!formData.get('picture')?.size > 0) {
        throw new Error('請上傳封面照')
      }
      if (
        !formData.get('title')?.trim()) {
        throw new Error('請填寫標題')
      }
      // start fetching
      sweetAlert.loading()
      const url = '/posts/'
      const response = await fetch(url, {
        method: "POST",
        body: formData
      })
      const json = await response.json()
      if (!json.ok) throw new Error(json.err)
      await sweetAlert.success('建立成功')
      window.location.href = '/posts/'
    } catch (err) {
      await sweetAlert.error('建立失敗', err.message || err)
    }
  }

  imageDisplay.onclick = () => {
    imageInput.click()
  }
  imageInput.onchange = handleImageChange
  submit.onclick = handleSubmit

})()