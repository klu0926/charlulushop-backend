import sweetAlert from '/js/sweetAlert.js'

(() => {
  const logout = document.querySelector('#logout')
  const burger = document.querySelector('#burger')
  const postLinks = document.querySelector('#post-links')

  function handlePostLinksToggle() {
    if (postLinks.classList.contains('active')) {
      handlePostLinksOff()
    } else {
      handlePostLinksOn()
    }
  }

  function handlePostLinksOn() {
    postLinks.classList.add('active')
  }
  function handlePostLinksOff() {
    postLinks.classList.remove('active')
  }

  async function handleLogout(e) {
    e.preventDefault()
    const result = await sweetAlert.confirm('登出', '你確定要登出嗎？')
    if (result && result.isConfirmed) {
      // clear local storage
      localStorage.removeItem('charlulu-jwt')
      // use logout a element's herf
      window.location.href = logout.href
    }
  }

  function handleBurgerClick() {
    const menuBackground = document.querySelector('#burger-menu-background')
    const menuPenal = document.querySelector('#burger-menu-panel')
    if (!menuBackground || !menuPenal) {
      return
    }
    menuBackground.style.display = 'block'
    menuBackground.classList.add('open')
    menuPenal.classList.add('open')
    document.body.style.overflow = 'hidden'
  }

  if (burger) {
    burger.onclick = handleBurgerClick
  }
  if (logout) {
    logout.onclick = handleLogout
  }
  if (postLinks) {
    postLinks.onclick = handlePostLinksToggle
    document.body.addEventListener('click', (e) => {
      if (e.target !== postLinks && !e.target.classList.contains('post-links-i')) {
        handlePostLinksOff()
      }
    })
  }
})()