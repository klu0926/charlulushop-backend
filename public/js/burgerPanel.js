(() => {
  const menuBackground = document.querySelector('#burger-menu-background')
  const menuPenal = document.querySelector('#burger-menu-panel')

  function handleBackgroundClick() {
    menuPenal.classList.remove('open')
    menuBackground.classList.remove('open')
    document.body.style.overflowY = 'scroll'

    setTimeout(() => {
      menuBackground.style.display = 'none'
    }, 300)
  }
  menuBackground.onclick = handleBackgroundClick
})()