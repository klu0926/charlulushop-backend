const login = {
  // return token
  JWTLogin: async (name, password) => {
    try {
      if (!name || !password) {
        throw new Error('Missing input name or password')
      }
      const response = await fetch('/users/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ name, password })
      })
      const json = await response.json()
      if (!json.ok) throw new Error(json.err)
      console.log('json', json)
      return json
    } catch (err) {
      console.error(err)
      throw err
    }
  }
  // set session, and redirect
  
}

export default login