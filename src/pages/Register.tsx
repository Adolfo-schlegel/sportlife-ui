import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from '../styles/auth.module.css'
import gymImg from '../assets/gym.jpg'
import logoImg from '../assets/logo.png'

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
    <div className={styles.page}>
      <div className={styles.imageSide}>
        <img src={gymImg} alt="Sportlife Gym" className={styles.gymImage} />
        <div className={styles.imageOverlay}>
          <img src={logoImg} alt="Sportlife Logo" className={styles.overlayLogo} />
          <div className={styles.overlayTitle}>SPORTLIFE</div>
          <div className={styles.overlaySubtitle}>CrossFit Gym Management</div>
        </div>
      </div>

      <div className={styles.formSide}>
        <div className={styles.card}>
          <div className={styles.header}>
            <img src={logoImg} alt="Logo" className={styles.logoImg} />
            <h1 className={styles.title}>SPORTLIFE</h1>
            <p className={styles.subtitle}>Crear nueva cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Nombre completo</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Juan García"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={styles.input}
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" disabled={loading} className={styles.btn}>
              {loading ? 'Registrando...' : 'CREAR CUENTA'}
            </button>
          </form>

          <p className={styles.footer}>
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className={styles.footerLink}>Ingresar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
