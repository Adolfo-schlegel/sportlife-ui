import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import client from '../api/client'
import ManualPaymentModal from './ManualPaymentModal'
import styles from './ExpiringCard.module.css'

interface ExpiringMembership {
  membershipId: string
  userId: string
  userName: string
  planId: string
  planName: string
  expiresAt: string
  daysLeft: number
}

export default function ExpiringCard() {
  const [open, setOpen] = useState(true)
  const [renewTarget, setRenewTarget] = useState<{ userId: string; planId: string } | null>(null)

  const { data = [], refetch } = useQuery<ExpiringMembership[]>({
    queryKey: ['expiring'],
    queryFn: () => client.get('/memberships/expiring?days=7').then(r => r.data),
  })

  if (data.length === 0) return null

  return (
    <div className={styles.card}>
      <button className={styles.header} onClick={() => setOpen(o => !o)}>
        <span className={styles.badge}>{data.length}</span>
        <span className={styles.title}>Membresías por vencer en 7 días</span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>▾</span>
      </button>

      {open && (
        <div className={styles.body}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Socio</th>
                <th>Plan</th>
                <th>Vence</th>
                <th>Días</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map(m => (
                <tr key={m.membershipId} className={m.daysLeft <= 2 ? styles.urgent : ''}>
                  <td>{m.userName}</td>
                  <td>{m.planName}</td>
                  <td>{new Date(m.expiresAt).toLocaleDateString('es-AR')}</td>
                  <td>
                    <span className={`${styles.daysChip} ${m.daysLeft <= 2 ? styles.daysUrgent : ''}`}>
                      {m.daysLeft}d
                    </span>
                  </td>
                  <td>
                    <button
                      className={styles.renewBtn}
                      onClick={() => setRenewTarget({ userId: m.userId, planId: m.planId })}
                    >
                      Renovar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {renewTarget && (
        <ManualPaymentModal
          prefillUserId={renewTarget.userId}
          prefillPlanId={renewTarget.planId}
          onClose={() => setRenewTarget(null)}
          onSuccess={() => { setRenewTarget(null); refetch() }}
        />
      )}
    </div>
  )
}
