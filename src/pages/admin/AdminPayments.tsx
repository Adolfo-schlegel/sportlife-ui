import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Layout from '../../components/Layout'
import StatusBadge from '../../components/StatusBadge'
import ManualPaymentModal from '../../components/ManualPaymentModal'
import client from '../../api/client'
import styles from '../../styles/table.module.css'

interface Payment {
  id: string
  userId: string
  userName: string
  planId: string
  planName: string
  mercadoPagoPaymentId?: string
  status: string
  amount: number
  createdAt: string
  approvedAt?: string
}

export default function AdminPayments() {
  const [showModal, setShowModal] = useState(false)
  const { data: payments = [], isLoading, refetch } = useQuery<Payment[]>({
    queryKey: ['admin-payments'],
    queryFn: () => client.get('/payments').then(r => r.data),
  })

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(n)

  return (
    <Layout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Pagos</h1>
          <p className={styles.subtitle}>Historial completo de pagos</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => setShowModal(true)}>+ Registrar pago</button>
      </div>

      {showModal && (
        <ManualPaymentModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); refetch() }}
        />
      )}

      {isLoading ? (
        <div className={styles.loading}>Cargando pagos...</div>
      ) : (
        <div className={styles.tableWrap}>
          <div className={styles.scrollX}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  {['Miembro', 'Plan', 'Monto', 'Estado', 'Fecha', 'MP ID'].map(h => (
                    <th key={h} className={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} className={styles.tr}>
                    <td className={styles.tdPrimary}>{p.userName}</td>
                    <td className={styles.tdSecondary}>{p.planName}</td>
                    <td className={styles.tdAccent}>{formatMoney(p.amount)}</td>
                    <td className={styles.td}><StatusBadge status={p.status} /></td>
                    <td className={styles.tdMuted}>{new Date(p.createdAt).toLocaleDateString('es-AR')}</td>
                    <td className={styles.tdMono}>{p.mercadoPagoPaymentId ? p.mercadoPagoPaymentId.slice(0, 12) + '...' : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {payments.length === 0 && <div className={styles.empty}>No hay pagos registrados</div>}
          </div>
        </div>
      )}
    </Layout>
  )
}
