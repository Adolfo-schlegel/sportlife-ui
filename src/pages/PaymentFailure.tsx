import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { XCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import styles from '../styles/payment.module.css'

export default function PaymentFailure() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin', { replace: true })
  }, [user, navigate])

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <XCircle size={80} className={styles.iconError} />
        <h1 className={styles.title}>Pago Rechazado</h1>
        <p className={styles.subtitle}>Hubo un problema con tu pago.</p>
        <p className={styles.note}>Podés intentar de nuevo con otra tarjeta.</p>
        <div className={styles.actions}>
          <button onClick={() => navigate('/plans')} className={styles.btnPrimary}>
            INTENTAR DE NUEVO
          </button>
          <button onClick={() => navigate('/dashboard')} className={styles.btnOutline}>
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  )
}
