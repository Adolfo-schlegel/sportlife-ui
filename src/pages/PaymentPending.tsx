import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function PaymentPending() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin', { replace: true })
  }, [user, navigate])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <Clock size={80} className="text-warning mx-auto mb-6" />
        <h1 className="text-4xl font-black text-white mb-3 uppercase tracking-widest">PAGO PENDIENTE</h1>
        <p className="text-gray-500 text-base mb-2">Tu pago está siendo procesado.</p>
        <p className="text-gray-600 text-sm mb-8">Te notificaremos cuando se acredite. Puede demorar hasta 2 días hábiles.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-8 py-3 bg-primary hover:bg-red-600 text-white font-bold uppercase tracking-widest rounded-lg text-sm transition-colors"
        >
          IR AL DASHBOARD
        </button>
      </div>
    </div>
  )
}
