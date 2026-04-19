import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LayoutDashboard, Users, CreditCard, Dumbbell, LogOut, Shield, Settings } from 'lucide-react'

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
    `flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all border-l-[3px] ${
      isActive
        ? 'text-primary bg-primary/10 border-primary'
        : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-white/5'
    }`

  return (
    <aside className="w-60 min-h-screen bg-surface border-r border-border-dark flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-border-dark">
        <Dumbbell size={28} className="text-primary" />
        <div>
          <div className="text-xl font-extrabold text-primary tracking-wide">SPORTLIFE</div>
          <div className="text-[11px] text-gray-600 uppercase tracking-widest">CrossFit Gym</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4">
        {isAdmin ? (
          <>
            <div className="px-5 py-1 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Admin</div>
            <NavLink to="/admin" end className={linkClass} onClick={onClose}>
              <Shield size={18} /> Panel Admin
            </NavLink>
            <NavLink to="/admin/users" className={linkClass} onClick={onClose}>
              <Users size={18} /> Miembros
            </NavLink>
            <NavLink to="/admin/plans" className={linkClass} onClick={onClose}>
              <Dumbbell size={18} /> Gestión Planes
            </NavLink>
            <NavLink to="/admin/payments" className={linkClass} onClick={onClose}>
              <CreditCard size={18} /> Pagos
            </NavLink>
            <NavLink to="/admin/mercadopago" className={linkClass} onClick={onClose}>
              <Settings size={18} /> MercadoPago
            </NavLink>
          </>
        ) : (
          <>
            <div className="px-5 py-1 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Principal</div>
            <NavLink to="/dashboard" className={linkClass} onClick={onClose}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/plans" className={linkClass} onClick={onClose}>
              <CreditCard size={18} /> Planes
            </NavLink>
          </>
        )}
      </nav>

      {/* User info + logout */}
      <div className="border-t border-border-dark px-5 py-4">
        <div className="mb-3">
          <div className="text-sm font-semibold text-white">{user?.name}</div>
          <div className="text-[11px] text-gray-600 capitalize">{user?.role}</div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-500 hover:text-white text-sm py-2 w-full transition-colors"
        >
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
