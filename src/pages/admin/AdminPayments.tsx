import { useQuery } from '@tanstack/react-query'
import Layout from '../../components/Layout'
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
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-black text-white">Pagos</h1>
        <p className="text-gray-500 mt-1 text-sm">Historial completo de pagos</p>
      </div>

      {isLoading ? (
        <div className="text-gray-500 text-sm">Cargando pagos...</div>
      ) : (
        <div className="bg-surface border border-border-dark rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-background border-b border-border-dark">
                  {['Miembro', 'Plan', 'Monto', 'Estado', 'Fecha', 'MP ID'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={p.id} className={i < payments.length - 1 ? 'border-b border-[#1a1a1a]' : ''}>
                    <td className="px-4 py-3.5 text-white text-sm whitespace-nowrap">{p.userName}</td>
                    <td className="px-4 py-3.5 text-gray-500 text-sm whitespace-nowrap">{p.planName}</td>
                    <td className="px-4 py-3.5 text-primary text-sm font-bold whitespace-nowrap">{formatMoney(p.amount)}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3.5 text-gray-600 text-xs whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 text-xs font-mono whitespace-nowrap">
                      {p.mercadoPagoPaymentId ? p.mercadoPagoPaymentId.slice(0, 12) + '...' : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {payments.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-600 text-sm">No hay pagos registrados</div>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}
