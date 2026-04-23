import { useQuery } from '@tanstack/react-query'
import client from '../api/client'
import StatusBadge from './StatusBadge'
import styles from './MemberPaymentsModal.module.css'

interface Payment {
  id: string
  planName: string
  status: string
  amount: number
  createdAt: string
  approvedAt?: string
  mercadoPagoPaymentId?: string
}

interface Props {
  userId: string
  userName: string
  userEmail: string
  onClose: () => void
}

const formatMoney = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(n)

export default function MemberPaymentsModal({ userId, userName, userEmail, onClose }: Props) {
  const { data: allPayments = [], isLoading } = useQuery<Payment[]>({
    queryKey: ['admin-payments'],
    queryFn: () => client.get('/payments').then(r => r.data),
    staleTime: 30_000,
  })

  const payments = (allPayments as (Payment & { userId: string })[]).filter(p => p.userId === userId)

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>

        <div className={styles.header}>
          <div className={styles.avatar}>{userName[0].toUpperCase()}</div>
          <div>
            <div className={styles.name}>{userName}</div>
            <div className={styles.email}>{userEmail}</div>
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Historial de pagos</h3>

        {isLoading ? (
          <div className={styles.empty}>Cargando...</div>
        ) : payments.length === 0 ? (
          <div className={styles.empty}>Sin pagos registrados</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td className={styles.tdPlan}>{p.planName}</td>
                    <td className={styles.tdAmount}>{formatMoney(p.amount)}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td className={styles.tdDate}>{new Date(p.createdAt).toLocaleDateString('es-AR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
