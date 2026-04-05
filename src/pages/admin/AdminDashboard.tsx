import { useQuery } from '@tanstack/react-query'
import Sidebar from '../../components/Sidebar'
import client from '../../api/client'
import { Users, CheckCircle, XCircle, DollarSign, CreditCard } from 'lucide-react'

interface Stats {
  totalMembers: number
  activeMembers: number
  expiredMembers: number
  monthlyRevenue: number
  totalPayments: number
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ['stats'],
    queryFn: () => client.get('/memberships/stats').then(r => r.data),
  })

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(n)

  const statCards = stats ? [
    { label: 'Total Miembros', value: stats.totalMembers, icon: Users, color: '#E53E3E' },
    { label: 'Membresías Activas', value: stats.activeMembers, icon: CheckCircle, color: '#48BB78' },
    { label: 'Vencidas', value: stats.expiredMembers, icon: XCircle, color: '#F56565' },
    { label: 'Ingresos del Mes', value: formatMoney(stats.monthlyRevenue), icon: DollarSign, color: '#ECC94B' },
    { label: 'Pagos Aprobados', value: stats.totalPayments, icon: CreditCard, color: '#63B3ED' },
  ] : []

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>Panel Administrador</h1>
          <p style={{ color: '#666', marginTop: 4 }}>Resumen general de SportLife CrossFit</p>
        </div>

        {isLoading ? (
          <div style={{ color: '#666' }}>Cargando estadísticas...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
            {statCards.map((card, i) => (
              <div key={i} style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#666', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                      {card.label}
                    </div>
                    <div style={{ fontSize: 30, fontWeight: 900, color: '#fff' }}>
                      {card.value}
                    </div>
                  </div>
                  <card.icon size={28} color={card.color} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: 24 }}>
            <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 16 }}>Accesos Rápidos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Ver todos los miembros', path: '/admin/users' },
                { label: 'Gestionar planes', path: '/admin/plans' },
                { label: 'Historial de pagos', path: '/admin/payments' },
              ].map((item, i) => (
                <a key={i} href={item.path} style={{
                  display: 'block', padding: '12px 16px', background: '#0A0A0A',
                  border: '1px solid #222', borderRadius: 8, color: '#bbb',
                  textDecoration: 'none', fontSize: 14,
                  transition: 'border-color 0.15s'
                }}>
                  → {item.label}
                </a>
              ))}
            </div>
          </div>

          <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: 24 }}>
            <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 16 }}>Info del Sistema</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#666' }}>API Endpoint</span>
                <span style={{ color: '#48BB78', fontSize: 11 }}>● Conectado</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#666' }}>MercadoPago</span>
                <span style={{ color: '#ECC94B', fontSize: 11 }}>⚠ Config pendiente</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
