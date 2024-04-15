import sweetAlert from "/js/sweetAlert.js"

(() => {
  const submit = document.querySelector('#submit')
  const nameInput = document.querySelector('#name')
  const passwordInput = document.querySelector('#password')
  let isLogin = false

  function showLoadingCover() {
    const loadingCover = document.createElement('div')
    loadingCover.classList.add('loading-cover')
    loadingCover.id = 'loading-cover'
    document.body.appendChild(loadingCover)
  }

  async function jwtServerLogin(jwt) {
    try {
      if (!jwt) throw new error('自動登入失敗')

      // show loading screen
      showLoadingCover()
      const url = '/api/auth/jwtServerLogin'
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'JWT': jwt
        })
      })
      const json = await response.json()
      if (!json.ok) throw new Error(json.err)
      // redirect
      window.location.href = '/items'
    } catch (err) {
      // 清除錯誤的jwt
      localStorage.removeItem('charlulu-jwt')
      await sweetAlert.error('登入失敗', err)
      window.location.reload()
    }
  }


  async function loginHandler() {
    try {
      const name = nameInput.value
      const password = passwordInput.value
      if (!name.trim() || !password.trim()) {
        throw new Error('請輸入名稱與密碼')
      }
      const url = '/users/login'
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name, password
        })
      })
      const json = await response.json()
      if (!json.ok) throw new Error(json.err)

      // set jwt
      localStorage.setItem('charlulu-jwt', json.data.jwt)
      // login with jwt
      await jwtServerLogin(json.data.jwt)

    } catch (error) {
      await sweetAlert.error('登入失敗', error)
      isLogin = false
    }
  }


  // auto login if has jwt
  const jwt = localStorage.getItem('charlulu-jwt')
  if (jwt) {
    jwtServerLogin(jwt)
  } else {
    submit.onclick = loginHandler
  }
  document.body.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isLogin) {
      isLogin = true
      submit.click()
    }
  })

})()