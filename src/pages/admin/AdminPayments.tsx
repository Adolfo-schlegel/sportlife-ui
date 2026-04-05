import { useQuery } from '@tanstack/react-query'
import Sidebar from '../../components/Sidebar'
import StatusBadge from '../../components/StatusBadge'
import client from '../../api/client'

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
  const { data: payments = [], isLoading } = useQuery<Payment[]>({
    queryKey: ['admin-payments'],
    queryFn: () => client.get('/payments').then(r => r.data),
  })

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(n)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>Pagos</h1>
          <p style={{ color: '#666', marginTop: 4 }}>Historial completo de pagos</p>
        </div>

        {isLoading ? (
          <div style={{ color: '#666' }}>Cargando pagos...</div>
        ) : (
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0A0A0A', borderBottom: '1px solid #222' }}>
                  {['Miembro', 'Plan', 'Monto', 'Estado', 'Fecha', 'MP ID'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: 1 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < payments.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                    <td style={{ padding: '14px 16px', color: '#fff', fontSize: 14 }}>{p.userName}</td>
                    <td style={{ padding: '14px 16px', color: '#888', fontSize: 13 }}>{p.planName}</td>
                    <td style={{ padding: '14px 16px', color: '#E53E3E', fontSize: 14, fontWeight: 700 }}>{formatMoney(p.amount)}</td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge status={p.status} /></td>
                    <td style={{ padding: '14px 16px', color: '#666', fontSize: 12 }}>
                      {new Date(p.createdAt).toLocaleDateString('es-AR')}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#444', fontSize: 11, fontFamily: 'monospace' }}>
                      {p.mercadoPagoPaymentId ? p.mercadoPagoPaymentId.slice(0, 12) + '...' : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {payments.length === 0 && (
              <div style={{ padding: 32, textAlign: 'center', color: '#666' }}>No hay pagos registrados</div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
