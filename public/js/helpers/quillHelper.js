const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, false] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ["bold", "italic", "underline"],
  ["link", "image"],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ["clean"]
]

const quillHelper = {
  // container is the css id
  init: (containerId) => {
    const quill = new Quill(containerId, {
      theme: 'snow',
      placeholder: '輸入內容...',
      modules: { toolbar: TOOLBAR_OPTIONS }
    })

    // text-change
    quill.on('text-change', (delta, oldDelta, source) => {
      if (source === 'user') {
      }
    })




    return quill
  }
}


export default quillHelper