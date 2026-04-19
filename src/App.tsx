import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Plans from './pages/Plans'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailure from './pages/PaymentFailure'
import PaymentPending from './pages/PaymentPending'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminPlans from './pages/admin/AdminPlans'
import AdminPayments from './pages/admin/AdminPayments'
import AdminMercadoPago from './pages/admin/AdminMercadoPago'

function ProtectedRoute({
  children,
  adminOnly = false,
  memberOnly = false,
}: {
  children: React.ReactNode
  adminOnly?: boolean
  memberOnly?: boolean
}) {
  const { user, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-primary text-2xl">
        Cargando...
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />
  if (memberOnly && user.role === 'admin') return <Navigate to="/admin" replace />
  return <>{children}</>
}

export default function App() {
  const { user } = useAuth()

  const homeRedirect = user
    ? (user.role === 'admin' ? '/admin' : '/dashboard')
    : '/login'

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={homeRedirect} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={homeRedirect} replace /> : <Register />} />
      <Route path="/dashboard" element={<ProtectedRoute memberOnly><Dashboard /></ProtectedRoute>} />
      <Route path="/plans" element={<ProtectedRoute memberOnly><Plans /></ProtectedRoute>} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/failure" element={<PaymentFailure />} />
      <Route path="/payment/pending" element={<PaymentPending />} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/plans" element={<ProtectedRoute adminOnly><AdminPlans /></ProtectedRoute>} />
      <Route path="/admin/payments" element={<ProtectedRoute adminOnly><AdminPayments /></ProtectedRoute>} />
      <Route path="/admin/mercadopago" element={<ProtectedRoute adminOnly><AdminMercadoPago /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={homeRedirect} replace />} />
    </Routes>
  )
}
