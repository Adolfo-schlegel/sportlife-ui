import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Dumbbell } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {
      setError('Email o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0A0A', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{
        width: '100%', maxWidth: 400, background: '#111', border: '1px solid #222',
        borderRadius: 12, padding: 40
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Dumbbell size={40} color="#E53E3E" style={{ marginBottom: 12 }} />
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: 1 }}>SPORTLIFE</h1>
          <p style={{ color: '#666', fontSize: 13, marginTop: 4 }}>CrossFit Gym Management</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 14px', background: '#0A0A0A',
                border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 14,
                outline: 'none', boxSizing: 'border-box'
              }}
              placeholder="tu@email.com"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 14px', background: '#0A0A0A',
                border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 14,
                outline: 'none', boxSizing: 'border-box'
              }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#E53E3E', fontSize: 13 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px', background: loading ? '#666' : '#E53E3E',
              border: 'none', borderRadius: 8, color: '#fff', fontSize: 15,
              fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: 1, textTransform: 'uppercase',
              transition: 'background 0.15s'
            }}
          >
            {loading ? 'Ingresando...' : 'INGRESAR'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#666', fontSize: 13 }}>
          ¿No tenés cuenta?{' '}
          <Link to="/register" style={{ color: '#E53E3E', textDecoration: 'none', fontWeight: 600 }}>
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  )
}
