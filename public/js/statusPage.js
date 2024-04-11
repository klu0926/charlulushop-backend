import sweetAlert from '/js/sweetAlert.js'

(() => {
  const button = document.querySelector('#status-page-button')
  const select = document.querySelector('#select')
  const reasonInput = document.querySelector('#reason')
  const messageInput = document.querySelector('#message')


  function handleSelect() {
    if (select.value === 'true') {
      reasonInput.disabled = false
      messageInput.disabled = false

    } else {
      reasonInput.disabled = true
      messageInput.disabled = true
    }
  }

  async function handleSettingShopStatus() {
    try {
      const isLock = select.value
      const reason = reasonInput.value
      const message = messageInput.value

      // 關店需要原因 
      if (isLock && (!reason.trim() || !message.trim())) {
        throw new Error('請填寫全部項目')
      }
      const shopStatusUrl = '/api/shop-status'
      const response = await fetch(shopStatusUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isLock: isLock === 'true' ? true : false,
          reason,
          message
        })
      })
      if (!response.ok) throw new Error(response.statusText)
      const json = await response.json()
      if (!json.ok) throw new Error(json.err)

      const shopStatus = isLock === 'true' ? '關閉' : '開啟'
      await sweetAlert.success('修改成功', `商店狀況： ${shopStatus}`)
      location.reload()
    } catch (err) {
      sweetAlert.error('修改失敗', err.message || err)
    }
  }

  button.onclick = handleSettingShopStatus
  select.onchange = handleSelect

})()