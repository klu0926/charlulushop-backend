import sweetAlert from '/js/sweetAlert.js'
let quill = null // quill instance

function uploadImageHandler() {
  console.log('upload image')

  const input = document.createElement('input')
  input.style.display = 'none'
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');

  input.onchange = async (e) => {
    try {
      const file = e.target.files[0]
      if (!file) return
      const formData = new FormData()
      formData.append('picture', file)

      // show loading
      sweetAlert.loading('上傳照片中...')

      // upload to server
      const url = '/upload'
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      })
      if (!response) throw new Error('無法取得Response')
      const json = await response.json()
      if (!json.ok) throw new Error(json.err)
      const imgurUrl = json.data // imgurUrl

      // finished: 
      // remove input
      input.remove()   
      // insert image to quill
      quillInsertImage(imgurUrl)
      // close loading
      sweetAlert.close()
    } catch (err) {
      await sweetAlert.error('上傳照片失敗', err.message || err)
    }
  }
  // append input to body and click
  document.body.appendChild(input)
  input.click()
}

function quillInsertImage(url) {
  try {
    if (!url) throw new Error('沒有輸入url')
    if (!quill) throw new Error('quill沒有內容')
    const range = quill.getSelection()
    quill.insertEmbed(range.index, 'image', url);
  } catch (err) {
    throw err
  }
}


const TOOLBAR_OPTIONS = {
  container: [
    [{ header: [1, 2, 3, 4, false] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ["bold", "italic", "underline"],
    ["link", "image"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["clean"],
  ],
  handlers: {
    image: () => {
      uploadImageHandler(); // Call your custom image upload handler
    }
  }
};


const quillHelper = {
  // container is the css id
  init: (containerId, isReadOnly = false,) => {
    // assign quill
    quill = new Quill(containerId, {
      readOnly: isReadOnly,
      theme: 'snow',
      placeholder: isReadOnly ? null : '輸入內容...',
      modules: {
        toolbar: isReadOnly ? null : TOOLBAR_OPTIONS
      }
    })

    // text-change
    // quill.on('text-change', (delta, oldDelta, source) => {
    //   if (source === 'user') {
    //   }
    // })
    return quill
  }
}


export default quillHelper