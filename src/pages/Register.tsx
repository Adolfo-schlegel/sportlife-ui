import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Dumbbell } from 'lucide-react'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', background: '#0A0A0A',
    border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 14,
    outline: 'none', boxSizing: 'border-box' as const
  }
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600 as const, color: '#888', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: 1 }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400, background: '#111', border: '1px solid #222', borderRadius: 12, padding: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Dumbbell size={40} color="#E53E3E" style={{ marginBottom: 12 }} />
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: 1 }}>SPORTLIFE</h1>
          <p style={{ color: '#666', fontSize: 13, marginTop: 4 }}>Crear nueva cuenta</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Nombre completo</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} placeholder="Juan García" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} placeholder="tu@email.com" />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} placeholder="••••••••" />
          </div>

          {error && (
            <div style={{ background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#E53E3E', fontSize: 13 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', background: loading ? '#666' : '#E53E3E',
            border: 'none', borderRadius: 8, color: '#fff', fontSize: 15,
            fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: 1, textTransform: 'uppercase'
          }}>
            {loading ? 'Registrando...' : 'CREAR CUENTA'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#666', fontSize: 13 }}>
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" style={{ color: '#E53E3E', textDecoration: 'none', fontWeight: 600 }}>Ingresar</Link>
        </p>
      </div>
    </div>
  )
}
