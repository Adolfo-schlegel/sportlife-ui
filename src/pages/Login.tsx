import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from '../styles/auth.module.css'
import gymImg from '../assets/gym.jpg'
import logoImg from '../assets/logo.png'

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
      const u = await login(email, password)
      navigate(u.role === 'admin' ? '/admin' : '/dashboard')
    } catch {
      setError('Email o contraseña incorrectos')
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
            <p className={styles.subtitle}>CrossFit Gym Management</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
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
              {loading ? 'Ingresando...' : 'INGRESAR'}
            </button>
          </form>

          <p className={styles.footer}>
            ¿No tenés cuenta?{' '}
            <Link to="/register" className={styles.footerLink}>Registrarse</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
