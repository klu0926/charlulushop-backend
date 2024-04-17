import sweetAlert from '/js/sweetAlert.js'
import quillHelper from '/js/helpers/quillHelper.js'

(() => {
  const id = document.body.querySelector('#main').dataset.id

  // get post's content html
  async function fetchPostContent(quill) {
    try {
      if (id === undefined) throw new Error('無法取得堆文ID')
      const url = `/api/posts/${id}`

      // fetch
      const response = await fetch(url)
      if (!response) throw new Error('fetch無法取得Response')
      const json = await response.json()
      if (!json.ok) throw new Error(json.err)

      //render quill with content
      if (json.data?.content || json.data?.content !== '') {
        quill.setContents(JSON.parse(json.data.content))
      }
    } catch (err) {
      await sweetAlert.error('載入內文失敗', err.message || err);
    }
  }
  // -- Init
  // init quill
  const quill = quillHelper.init('#post-content', true)

  // fetch quill content from server
  fetchPostContent(quill)

})()