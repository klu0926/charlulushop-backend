import sweetAlert from '/js/sweetAlert.js'
import coverChange from '/js/helpers/coverChange.js'
import quillHelper from '/js/helpers/quillHelper.js'

(() => {
  const display = document.body.querySelector('#cover-display')
  const imageInput = document.body.querySelector('#imageInput')
  const title = document.body.querySelector('#post-title')
  const status = document.body.querySelector('#status-select')
  const save = document.body.querySelector('#save')
  const saveAndView = document.body.querySelector('#save-view')
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

  async function handleCoverChange(e) {
    try {
      const file = e.target.files[0];
      if (!file) throw new Error('Can not find file')
      coverChange(file, display)
    } catch (err) {
      await sweetAlert.error('上傳封面失敗', err.message || err);

    }
  }

  async function handleSave(e, quill, toView = false) {
    try {
      if (!quill) throw new Error('Quill取得失敗')
      if (id === undefined) throw new Error('沒有推文id');

      // gather data
      const post = {
        title: title.innerText.trim(), // text
        content: JSON.stringify(quill.getContents()), // quill object
        status: status.value, // value
      };
      const file = imageInput.files[0]; // not required
      if (!post.title) throw new Error('需要有標題');

      // formData
      const formData = new FormData();
      for (const key of Object.keys(post)) {
        formData.append(key, post[key]);
      }
      if (file) formData.append('picture', file);

      // start fetching
      sweetAlert.loading()
      const url = `/posts/${id}?_method=PUT`;
      const response = await fetch(url, {
        method: "POST", // Always use POST
        body: formData,
      });

      const json = await response.json()
      if (!json.ok) throw new Error(json.err)

      await sweetAlert.success('成功儲存');
      // to view page
      if (toView) {
        window.location.href = `/posts/view/${id}`
      }
    } catch (err) {
      await sweetAlert.error('儲存失敗', err.message || err);
    }
  }

  // -- Init
  // init quill
  const quill = quillHelper.init('#post-content')

  // fetch quill content from server
  fetchPostContent(quill)

  // -- Action
  // change cover
  display.onclick = () => {
    imageInput.click()
  }
  imageInput.onchange = handleCoverChange
  // save
  save.onclick = (e) => {
    handleSave(e, quill, false)
  }
  // save and view
  saveAndView.onclick = (e) => {
    handleSave(e, quill, true)
  }


})()