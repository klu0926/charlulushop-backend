import TagClass from '/js/TagClass.js'
import sweetAlert from '/js/sweetAlert.js'
(() => {
  // tags
  const tagsContainer = document.querySelector('#tagsContainer')
  const tagLabelTemp = document.querySelector('.tagLabel')
  const tagsCount = document.querySelector('#tagsCount')
  const tagInput = document.querySelector('#tagInput')
  const addButton = document.querySelector('#addBtn')

  // overwrite TagClass click handler
  async function tagClickHandler(e) {
    e.preventDefault()
    const checkbox = e.target
    if (!checkbox.classList.contains('tagCheckbox')) return
    const label = checkbox.parentElement
    const tagId = label.dataset.id
    const tagName = label.querySelector('.tagSpan').innerText
    await editTag(tagId, tagName)
  }

  async function editTag(tagId, tagName) {
    try {
      if (!tagId || !tagName) return
      const result = await sweetAlert.editTagInput('修改標籤', tagName, '要修改的名稱...')
      const newName = result.value
      // --- 修改標籤
      if (result.isConfirmed || newName) {
        const url = `/api/tags/${tagId}`
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json'
          },
          method: "PUT",
          body: JSON.stringify({ tagName: newName })
        })
        const json = await response.json()
        if (!json.ok) throw new Error(json.err)
        // 修改成功
        await sweetAlert.success('成功修改標題', newName)
        window.location.reload()
      }

      // ---- 刪除標籤
      if (result.isDenied) {
        // 再次確認
        const result = await sweetAlert.confirm('你確定要刪除嗎？', `${tagName}`)
        if (!result.value) {
          return
        }
        // 刪除
        const url = `/api/tags/${tagId}`
        const response = await fetch(url, {
          method: 'DELETE'
        })
        // 刪除成功
        const json = await response.json()
        if (!json.ok) throw new Error(json.err)
        await sweetAlert.notice('刪除成功', 'success', `${tagName}`)
        window.location.reload()
        return
      }
    } catch (err) {
      await sweetAlert.error('失敗', err.message)
    }
  }

  async function addButtonClickHandler(e) {
    try {
      if (tagInput.value) {
        const json = await tagClass.postTag(tagInput.value)
        if (!json.ok) throw new Error(json.err)
        await sweetAlert.success('新增成功', tagInput.value)
        window.location.reload()
      }
    } catch (err) {
      await sweetAlert.error('新增失敗', err)
    }
  }


  // Init
  const tagClass = new TagClass(tagsContainer, tagLabelTemp, null, tagsCount, tagClickHandler)
  tagClass.renderAllTags()

  // Action
  addButton.onclick = addButtonClickHandler

})()