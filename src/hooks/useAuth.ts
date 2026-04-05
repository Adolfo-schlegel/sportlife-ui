import { createContext, useContext, useState, useEffect, ReactNode, createElement } from 'react'
import client from '../api/client'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('sportlife_token')
    const savedUser = localStorage.getItem('sportlife_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await client.post('/auth/login', { email, password })
    const { token: t, role, userId, name } = res.data
    const u: User = { id: userId, name, email, role }
    setToken(t)
    setUser(u)
    localStorage.setItem('sportlife_token', t)
    localStorage.setItem('sportlife_user', JSON.stringify(u))
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await client.post('/auth/register', { name, email, password })
    const { token: t, role, userId } = res.data
    const u: User = { id: userId, name, email, role }
    setToken(t)
    setUser(u)
    localStorage.setItem('sportlife_token', t)
    localStorage.setItem('sportlife_user', JSON.stringify(u))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('sportlife_token')
    localStorage.removeItem('sportlife_user')
  }

  return createElement(AuthContext.Provider, {
    value: { user, token, login, register, logout, isAdmin: user?.role === 'admin', isLoading },
    children
  })
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
