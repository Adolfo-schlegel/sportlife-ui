import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { XCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function PaymentFailure() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin', { replace: true })
  }, [user, navigate])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <XCircle size={80} className="text-primary mx-auto mb-6" />
        <h1 className="text-4xl font-black text-white mb-3 uppercase tracking-widest">PAGO RECHAZADO</h1>
        <p className="text-gray-500 text-base mb-8">Hubo un problema con tu pago. Podés intentar de nuevo.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => navigate('/plans')}
            className="px-8 py-3 bg-primary hover:bg-red-600 text-white font-bold uppercase tracking-widest rounded-lg text-sm transition-colors"
          >
            INTENTAR DE NUEVO
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-400 rounded-lg text-sm transition-colors"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  )
}
