import sweetAlert from '/js/sweetAlert.js'

(()=>{
  const logout = document.querySelector('#logout')
  const burger = document.querySelector('#burger')

  async function handleLogout(e) {
    e.preventDefault()
    const result = await sweetAlert.confirm('登出', '你確定要登出嗎？')
    if (result && result.isConfirmed) {
      window.location.href = logout.href
    }
  }

  function handleBurgerClick() {
    const menuBackground = document.querySelector('#burger-menu-background')
    const menuPenal = document.querySelector('#burger-menu-panel')
    if (!menuBackground || !menuPenal) {
      console.log('can not find menu background and panel')
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
})()