import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken) setToken(savedToken)
    if (savedUser) setUser(JSON.parse(savedUser))
  }, [])

  const login = (token, userObj) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userObj))
    setToken(token)
    setUser(userObj)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const isAuthenticated = user != null

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
