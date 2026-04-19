import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import client from '../api/client'
import { Calendar, Dumbbell, AlertCircle } from 'lucide-react'
import styles from './Dashboard.module.css'

interface Membership {
  id: string
  planName?: string
  expiresAt?: string
  status: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: membership, isLoading } = useQuery<Membership>({
    queryKey: ['membership', 'me'],
    queryFn: () => client.get('/memberships/me').then(r => r.data),
  })

  const getDaysLeft = (expiresAt?: string) => {
    if (!expiresAt) return null
    return Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  }

  const daysLeft = getDaysLeft(membership?.expiresAt)
  const isActive = membership?.status === 'active' && daysLeft !== null && daysLeft > 0
  const isExpiring = isActive && daysLeft !== null && daysLeft <= 7

  const cardMod = isActive
    ? (isExpiring ? styles.memberCardExpiring : styles.memberCardActive)
    : styles.memberCardExpired

  return (
    <Layout>
      <div className={styles.header}>
        <h1 className={styles.title}>Hola, {user?.name?.split(' ')[0]}</h1>
        <p className={styles.subtitle}>Panel de tu membresía en SportLife</p>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Cargando membresía...</div>
      ) : (
        <>
          <div className={`${styles.memberCard} ${cardMod}`}>
            <div className={styles.cardTop}>
              <div>
                <div className={styles.planMeta}>
                  <Dumbbell size={18} className={isActive ? styles.iconActive : styles.iconExpired} />
                  <span className={styles.planMetaLabel}>Estado de Membresía</span>
                </div>
                <div className={styles.planName}>{membership?.planName || 'Sin plan'}</div>
                <StatusBadge status={membership?.status || 'none'} expiresAt={membership?.expiresAt} />
              </div>

              {isActive && daysLeft !== null && (
                <div className={styles.daysBox}>
                  <div className={`${styles.daysNumber} ${isExpiring ? styles.daysNumberExpiring : ''}`}>
                    {daysLeft}
                  </div>
                  <div className={styles.daysLabel}>días restantes</div>
                </div>
              )}
            </div>

            {membership?.expiresAt && (
              <div className={styles.expiryRow}>
                <Calendar size={12} />
                Vence el {new Date(membership.expiresAt).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}
          </div>

          <div className={styles.actions}>
            {(!isActive || isExpiring) && (
              <button onClick={() => navigate('/plans')} className={styles.btnPrimary}>
                PAGAR MEMBRESÍA
              </button>
            )}
            <button onClick={() => navigate('/plans')} className={styles.btnOutline}>
              Ver planes
            </button>
          </div>

          {isExpiring && (
            <div className={styles.alert}>
              <AlertCircle size={15} />
              Tu membresía vence en {daysLeft} día{daysLeft !== 1 ? 's' : ''}. ¡Renová ahora para no perder continuidad!
            </div>
          )}
        </>
      )}
    </Layout>
  )
}
