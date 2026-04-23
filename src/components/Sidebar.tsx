import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LayoutDashboard, Users, CreditCard, Dumbbell, LogOut, Shield, Settings } from 'lucide-react'
import styles from './Sidebar.module.css'
import logoImg from '../assets/logo.png'

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.link} ${isActive ? styles.linkActive : ''}`

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <img src={logoImg} alt="Sportlife" className={styles.logoImg} />
      </div>

      <nav className={styles.nav}>
        {isAdmin ? (
          <>
            <div className={styles.section}>Admin</div>
            <NavLink to="/admin" end className={linkClass} onClick={onClose}>
              <Shield size={16} /> Panel Admin
            </NavLink>
            <NavLink to="/admin/users" className={linkClass} onClick={onClose}>
              <Users size={16} /> Miembros
            </NavLink>
            <NavLink to="/admin/plans" className={linkClass} onClick={onClose}>
              <Dumbbell size={16} /> Planes
            </NavLink>
            <NavLink to="/admin/payments" className={linkClass} onClick={onClose}>
              <CreditCard size={16} /> Pagos
            </NavLink>
            <NavLink to="/admin/mercadopago" className={linkClass} onClick={onClose}>
              <Settings size={16} /> MercadoPago
            </NavLink>
          </>
        ) : (
          <>
            <div className={styles.section}>Principal</div>
            <NavLink to="/dashboard" className={linkClass} onClick={onClose}>
              <LayoutDashboard size={16} /> Dashboard
            </NavLink>
            <NavLink to="/plans" className={linkClass} onClick={onClose}>
              <CreditCard size={16} /> Planes
            </NavLink>
          </>
        )}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userName}>{user?.name}</div>
        <div className={styles.userRole}>{user?.role}</div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={15} /> Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
