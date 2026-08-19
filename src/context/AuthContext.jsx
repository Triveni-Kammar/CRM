import { createContext, useContext, useEffect, useState } from 'react'
import { DEMO_USERS } from '../data/seed'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('trishul_user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (user) localStorage.setItem('trishul_user', JSON.stringify(user))
    else localStorage.removeItem('trishul_user')
  }, [user])

  const login = (userId) => {
    const found = DEMO_USERS.find((u) => u.id === userId)
    if (found) setUser(found)
    return found
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
