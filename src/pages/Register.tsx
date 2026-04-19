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
      const u = await register(name, email, password)
      navigate(u.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border-dark rounded-xl p-8">
        <div className="text-center mb-8">
          <Dumbbell size={40} className="text-primary mx-auto mb-3" />
          <h1 className="text-3xl font-black text-white tracking-wide">SPORTLIFE</h1>
          <p className="text-gray-500 text-sm mt-1">Crear nueva cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Juan García"
              className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {error && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg px-4 py-3 text-primary text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold uppercase tracking-widest rounded-lg text-sm transition-colors"
          >
            {loading ? 'Registrando...' : 'CREAR CUENTA'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Ingresar
          </Link>
        </p>
      </div>
    </div>
  )
}
