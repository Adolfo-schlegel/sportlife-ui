import styles from './StatusBadge.module.css'

interface StatusBadgeProps {
  status: string
  expiresAt?: string | null
}

export default function StatusBadge({ status, expiresAt }: StatusBadgeProps) {
  const now = new Date()
  const expiry = expiresAt ? new Date(expiresAt) : null
  const daysLeft = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null

  let cls = styles.none
  let label = status

  if (status === 'active' && expiry) {
    if (expiry < now) {
      cls = styles.expired; label = 'Vencida'
    } else if (daysLeft !== null && daysLeft <= 7) {
      cls = styles.expiring; label = 'Por vencer'
    } else {
      cls = styles.active; label = 'Activa'
    }
  } else if (status === 'expired') {
    cls = styles.expired; label = 'Vencida'
  } else if (status === 'approved') {
    cls = styles.approved; label = 'Aprobado'
  } else if (status === 'pending') {
    cls = styles.pending; label = 'Pendiente'
  } else if (status === 'none') {
    cls = styles.none; label = 'Sin membresía'
  }

  return <span className={`${styles.badge} ${cls}`}>{label}</span>
}
