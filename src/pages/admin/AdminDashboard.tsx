import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
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
    { label: 'Total Miembros', value: stats.totalMembers, icon: Users, colorClass: 'text-primary' },
    { label: 'Membresías Activas', value: stats.activeMembers, icon: CheckCircle, colorClass: 'text-success' },
    { label: 'Vencidas', value: stats.expiredMembers, icon: XCircle, colorClass: 'text-danger' },
    { label: 'Ingresos del Mes', value: formatMoney(stats.monthlyRevenue), icon: DollarSign, colorClass: 'text-warning' },
    { label: 'Pagos Aprobados', value: stats.totalPayments, icon: CreditCard, colorClass: 'text-info' },
  ] : []

  const quickLinks = [
    { label: 'Ver todos los miembros', path: '/admin/users' },
    { label: 'Gestionar planes', path: '/admin/plans' },
    { label: 'Historial de pagos', path: '/admin/payments' },
  ]

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-black text-white">Panel Administrador</h1>
        <p className="text-gray-500 mt-1 text-sm">Resumen general de SportLife CrossFit</p>
      </div>

      {isLoading ? (
        <div className="text-gray-500 text-sm">Cargando estadísticas...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {statCards.map((card, i) => (
            <div key={i} className="bg-surface border border-border-dark rounded-xl p-5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[11px] text-gray-600 uppercase tracking-widest mb-2">{card.label}</div>
                  <div className="text-3xl font-black text-white">{card.value}</div>
                </div>
                <card.icon size={26} className={card.colorClass} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border-dark rounded-xl p-6">
          <h3 className="text-white font-bold mb-4">Accesos Rápidos</h3>
          <div className="flex flex-col gap-3">
            {quickLinks.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className="block px-4 py-3 bg-background border border-border-dark rounded-lg text-gray-400 text-sm hover:border-gray-600 hover:text-white transition-all"
              >
                → {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border-dark rounded-xl p-6">
          <h3 className="text-white font-bold mb-4">Info del Sistema</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">API Endpoint</span>
              <span className="text-success text-xs">● Conectado</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">MercadoPago</span>
              <span className="text-warning text-xs">⚠ Config pendiente</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
