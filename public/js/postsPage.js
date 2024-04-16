import sweetAlert from '/js/sweetAlert.js'

(() => {
  const deleteButtons = document.querySelectorAll('.post-delete')



  async function handleDelete(e) {
    try {
      const id = e.target?.dataset?.id
      if (id === undefined || id === '') throw new Error('無法取得Post ID')

      const result = await sweetAlert.confirm('確定刪除?', `確定要刪除貼文${id}`)
      if (!result.isConfirmed) return
      // show loading
      sweetAlert.loading('刪除中')
      const deleteUrl = `/posts/${id}`
      const response = await fetch(deleteUrl, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error(response.statusText)
      const json = await response.json()
      if (!json.ok) throw new Error(json.err)
      await sweetAlert.success('刪除成功', `成功刪除貼文${id}`)
      window.location.href = '/posts/'
    } catch (err) {
      await sweetAlert.error('刪除失敗', err.message || err);
    }
  }

  // actions
  deleteButtons.forEach(b => {
    b.onclick = handleDelete
  })



})()