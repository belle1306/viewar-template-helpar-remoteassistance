import viewarApi from 'viewar-api'

const createAuthManager = () => {

  let token
  let user = null

  const persistLogin = async() => {
    const { storage } = viewarApi
    const settings = await storage.local.write('settings.json', {
      token,
    })
  }

  const readPersisted = async () => {
    const { storage } = viewarApi
    const settings = await storage.local.read('settings.json') || {}

    token = settings.token
  }

  const login = async(username, password) => {
    token = username
    await persistLogin()

    user = {
      username
    }
    return true
  }

  return {
    login,
    readPersisted,
    get token() { return token },
    get user() { return user },
  }

}

export default createAuthManager()

