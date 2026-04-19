import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import styles from '../styles/payment.module.css'

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin', { replace: true })
  }, [user, navigate])

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <CheckCircle size={80} className={styles.iconSuccess} />
        <h1 className={styles.title}>¡Pago Aprobado!</h1>
        <p className={styles.subtitle}>Tu membresía fue activada exitosamente.</p>
        <p className={styles.note}>¡A entrenar!</p>
        <div className={styles.actions}>
          <button onClick={() => navigate('/dashboard')} className={styles.btnPrimary}>
            IR AL DASHBOARD
          </button>
        </div>
      </div>
    </div>
  )
}
