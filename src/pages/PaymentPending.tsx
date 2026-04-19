import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import styles from '../styles/payment.module.css'

export default function PaymentPending() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin', { replace: true })
  }, [user, navigate])

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Clock size={80} className={styles.iconPending} />
        <h1 className={styles.title}>Pago Pendiente</h1>
        <p className={styles.subtitle}>Tu pago está siendo procesado.</p>
        <p className={styles.note}>Te notificaremos cuando se acredite. Puede demorar hasta 2 días hábiles.</p>
        <div className={styles.actions}>
          <button onClick={() => navigate('/dashboard')} className={styles.btnPrimary}>
            IR AL DASHBOARD
          </button>
        </div>
      </div>
    </div>
  )
}
