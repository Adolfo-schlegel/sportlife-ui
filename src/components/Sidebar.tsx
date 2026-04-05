import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LayoutDashboard, Users, CreditCard, Dumbbell, LogOut, Shield } from 'lucide-react'

const styles = {
  sidebar: {
    width: 240,
    minHeight: '100vh',
    background: '#111111',
    borderRight: '1px solid #222222',
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '0',
  },
  logo: {
    padding: '24px 20px',
    borderBottom: '1px solid #222',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 800,
    color: '#E53E3E',
    letterSpacing: 1,
  },
  logoSub: {
    fontSize: 11,
    color: '#666',
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
  nav: {
    flex: 1,
    padding: '16px 0',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 20px',
    color: '#888',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.15s',
    borderLeft: '3px solid transparent',
  },
  activeNav: {
    color: '#E53E3E',
    background: 'rgba(229, 62, 62, 0.08)',
    borderLeft: '3px solid #E53E3E',
  },
  section: {
    padding: '8px 20px 4px',
    fontSize: 10,
    fontWeight: 700,
    color: '#444',
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
  },
  bottom: {
    borderTop: '1px solid #222',
    padding: '16px 20px',
  },
  userInfo: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
  },
  userRole: {
    fontSize: 11,
    color: '#666',
    textTransform: 'capitalize' as const,
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'none',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    fontSize: 13,
    padding: '8px 0',
    width: '100%',
  }
}

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    ...styles.navItem,
    ...(isActive ? styles.activeNav : {}),
  })

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <Dumbbell size={28} color="#E53E3E" />
        <div>
          <div style={styles.logoText}>SPORTLIFE</div>
          <div style={styles.logoSub}>CrossFit Gym</div>
        </div>
      </div>

      <nav style={styles.nav}>
        <div style={styles.section}>Principal</div>
        <NavLink to="/dashboard" style={getLinkStyle}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
        <NavLink to="/plans" style={getLinkStyle}>
          <CreditCard size={18} /> Planes
        </NavLink>

        {isAdmin && (
          <>
            <div style={{ ...styles.section, marginTop: 12 }}>Admin</div>
            <NavLink to="/admin" end style={getLinkStyle}>
              <Shield size={18} /> Panel Admin
            </NavLink>
            <NavLink to="/admin/users" style={getLinkStyle}>
              <Users size={18} /> Miembros
            </NavLink>
            <NavLink to="/admin/plans" style={getLinkStyle}>
              <Dumbbell size={18} /> Gestión Planes
            </NavLink>
            <NavLink to="/admin/payments" style={getLinkStyle}>
              <CreditCard size={18} /> Pagos
            </NavLink>
          </>
        )}
      </nav>

      <div style={styles.bottom}>
        <div style={styles.userInfo}>
          <div style={styles.userName}>{user?.name}</div>
          <div style={styles.userRole}>{user?.role}</div>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
