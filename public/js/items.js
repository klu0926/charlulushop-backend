import sweetAlert from '/js/sweetAlert.js'

(()=>{
  const itemImages = document.querySelectorAll('.itemImage')
  const itemDeletes = document.querySelectorAll('.itemDelete')

  function handleItemImageLoaded() {
    itemImages.forEach((image) => {
      if (image.complete) {
        image.parentElement.classList.remove('flash')
      } else {
        image.onload = () => {
          image.parentElement.classList.remove('flash')
        }
      }
    })
  }

  async function deleteItem(itemId) {
    try {
      if (!itemId) throw new Error('No item id')
      const url = `/items/${itemId}`
      const response = await fetch(url, { method: 'DELETE' })
      const json = await response.json()
      if (!json.ok) throw new Error(json.message)
      window.location.reload()
    } catch (err) {
      await sweetAlert.error('刪除失敗', err)
    }
  }

  async function handleDelete() {
    itemDeletes.forEach((b) => {
      const itemName = b.dataset.name

      b.onclick = async (e) => {
        e.preventDefault() // stop parent <a>
        e.stopPropagation()
        // confirm
        //const isConfirm = confirm('刪除物件')
        const result = await sweetAlert.confirm(`你確定要刪除: ${itemName}？`)
        if (result.isConfirmed) {
          const itemId = b.dataset.id
          deleteItem(itemId)
        }
        return
      }
    })
  }
  // Action
  handleItemImageLoaded()
  handleDelete()
})()

