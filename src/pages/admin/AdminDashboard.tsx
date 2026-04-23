import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import ExpiringCard from '../../components/ExpiringCard'
import client from '../../api/client'
import { Users, CheckCircle, XCircle, DollarSign, CreditCard } from 'lucide-react'
import styles from './AdminDashboard.module.css'

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
    { label: 'Total Miembros',     value: stats.totalMembers,               Icon: Users,       mod: styles.statCardRed,    iconMod: styles.iconRed },
    { label: 'Membresías Activas', value: stats.activeMembers,              Icon: CheckCircle, mod: styles.statCardGreen,  iconMod: styles.iconGreen },
    { label: 'Vencidas',           value: stats.expiredMembers,             Icon: XCircle,     mod: styles.statCardOrange, iconMod: styles.iconOrange },
    { label: 'Ingresos del Mes',   value: formatMoney(stats.monthlyRevenue), Icon: DollarSign, mod: styles.statCardYellow, iconMod: styles.iconYellow },
    { label: 'Pagos Aprobados',    value: stats.totalPayments,              Icon: CreditCard,  mod: styles.statCardBlue,   iconMod: styles.iconBlue },
  ] : []

  return (
    <Layout>
      <div className={styles.header}>
        <h1 className={styles.title}>Panel Administrador</h1>
        <p className={styles.subtitle}>Resumen general de SportLife CrossFit</p>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Cargando estadísticas...</div>
      ) : (
        <div className={styles.statsGrid}>
          {statCards.map((card, i) => (
            <div key={i} className={`${styles.statCard} ${card.mod}`}>
              <div>
                <div className={styles.statLabel}>{card.label}</div>
                <div className={styles.statValue}>{card.value}</div>
              </div>
              <card.Icon size={24} className={card.iconMod} />
            </div>
          ))}
        </div>
      )}

      <ExpiringCard />

      <div className={styles.panels}>
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Accesos Rápidos</h3>
          <div className={styles.quickLinks}>
            <Link to="/admin/users"       className={styles.quickLink}>→ Ver todos los miembros</Link>
            <Link to="/admin/plans"       className={styles.quickLink}>→ Gestionar planes</Link>
            <Link to="/admin/payments"    className={styles.quickLink}>→ Historial de pagos</Link>
            <Link to="/admin/mercadopago" className={styles.quickLink}>→ Configuración MercadoPago</Link>
          </div>
        </div>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Info del Sistema</h3>
          <div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>API Endpoint</span>
              <span className={styles.statusOk}>● Conectado</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>MercadoPago</span>
              <span className={styles.statusWarn}>⚠ Config pendiente</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
