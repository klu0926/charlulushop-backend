import sweetAlert from '/js/sweetAlert.js'

(() => {
  const statusSelectors = document.querySelectorAll('.status-select')
  const cancels = document.querySelectorAll('.cancel')
  const deletes = document.querySelectorAll('.delete')
  const filterSelect = document.querySelector('#order-filters-select')
  const filterSearchInput = document.querySelector('#order-search-input')
  const filterSearchButton = document.querySelector('#order-search-button')
  const filterResetButton = document.querySelector('#order-reset-button')
  const orders = document.querySelectorAll('.order')
  const currentCount = document.querySelector('#current-orders-count')

  async function deleteOrder(orderId) {
    try {
      if (orderId === undefined) throw new Error('沒有orderId')
      // fetch DELETE
      const url = `/api/orders/${orderId}`
      const response = await fetch(url, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('刪除失敗：' + response.statusText)
      const json = await response.json()
      if (!json.ok) throw new Error(json.err)
      // completed
      await sweetAlert.success('刪除成功', '成功把訂單資料刪除')
    } catch (err) {
      console.error(err)
      await sweetAlert.error('刪除失敗', err.message)
    }
  }

  async function fetchPostStatus(orderId, status) {
    try {
      if (!status || orderId === undefined) throw new Error('Missing Status or orderId')
      // fetch POST
      const url = '/api/orders/status'
      const body = {
        orderId,
        status,
      }
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-type': 'application/json'
        }
      })
      if (!response.ok) throw new Error(response.statusText)
      const json = await response.json()
      if (!json.ok) throw new Error(json.err)
      // completed
      await sweetAlert.success('修改成功', `成功修改訂單狀態為 [${status}]`)
    } catch (err) {
      console.error(err)
      await sweetAlert.error('修改失敗', err.message)
    }
  }

  function handleOrderStatusChange(e) {
    const status = e.target.value.trim()
    const orderId = e.target.dataset.orderid
    fetchPostStatus(orderId, status)
  }

  async function handleCancelClick(e) {
    const status = '取消訂單'
    const orderId = e.target.dataset.orderid
    const result = await sweetAlert.confirm('取消訂單?', '取消訂單會把貨物回歸，無法復原！')
    if (result.isConfirmed) {
      await fetchPostStatus(orderId, status)
      window.location.reload()
    }
  }

  async function handleDeleteClick(e) {
    const orderId = e.target.dataset.orderid
    const result = await sweetAlert.confirm('刪除訂單?', '把訂單資料整筆刪除！')
    if (result.isConfirmed) {
      await deleteOrder(orderId)
      window.location.reload()
    }
  }

  // filters
  function handleFilterSearch() {
    const filter = filterSelect.value
    const search = filterSearchInput.value
    // hide all
    orders.forEach(order => order.style.display = 'none')

    // show some
    let filteredOrders = []
    function isSimilar(searchTerm, string) {
      const regex = new RegExp(`^${searchTerm.trim() || ''}.*`);
      return regex.test(string)
    }
    orders.forEach(order => {
      const status = order.dataset.status

      // filter
      if (filter === '未完成') {
        if (status !== '交易完成') {
          filteredOrders.push(order)
        }
      }
      if (filter === '完成') {
        if (status === '交易完成') {
          filteredOrders.push(order)
        }
      }
      if (filter === '全部') {
        filteredOrders.push(order)
      }
      // search (name, email)
      if (search && search.includes('@')) {
        filteredOrders = filteredOrders.filter(order => {
          return isSimilar(search, order.dataset.email)
        })
      } else if (search) {
        filteredOrders = filteredOrders.filter(order => {
          return isSimilar(search, order.dataset.name)
        })
      }
      filteredOrders.forEach(order => order.style.display = 'flex')
    })
    // set count
    currentCount.innerText = filteredOrders.length
  }

  function handleFilterReset() {
    filterSearchInput.value = ''
    filterSelect.value = '全部'
    handleFilterSearch()
  }

  // Action
  statusSelectors.forEach(s => {
    s.onchange = handleOrderStatusChange
  })

  cancels.forEach(c => {
    c.onclick = handleCancelClick
  })

  deletes.forEach(d => {
    d.onclick = handleDeleteClick
  })

  filterSelect.onchange = handleFilterSearch
  filterSearchButton.onclick = handleFilterSearch
  filterResetButton.onclick = handleFilterReset
  filterSearchInput.onkeydown = (e) => {
    if (e.key === 'Enter') filterSearchButton.click()
  }
})()
