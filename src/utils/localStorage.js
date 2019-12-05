const authTokenKey = 'authToken'

function getUserToken() {
  return localStorage.getItem(authTokenKey)
}

function setUserToken(token) {
  localStorage.setItem(authTokenKey, token)
}

function clearUserToken() {
  localStorage.removeItem(authTokenKey)
}

export default {
  getUserToken,
  setUserToken,
  clearUserToken,
}
