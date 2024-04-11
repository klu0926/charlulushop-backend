(() => {
  const closeButton = document.querySelector('#error-message-close')
  const errorMessage = document.querySelector('#error-message')
  function handleClose() {
    errorMessage.remove()
  }
  closeButton.onclick = handleClose
})()