import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import client from '../api/client'
import { Calendar, Dumbbell, AlertCircle } from 'lucide-react'

interface Membership {
  id: string
  planName?: string
  expiresAt?: string
  status: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: membership, isLoading } = useQuery<Membership>({
    queryKey: ['membership', 'me'],
    queryFn: () => client.get('/memberships/me').then(r => r.data),
  })

  const getDaysLeft = (expiresAt?: string) => {
    if (!expiresAt) return null
    const diff = new Date(expiresAt).getTime() - Date.now()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const daysLeft = getDaysLeft(membership?.expiresAt)
  const isActive = membership?.status === 'active' && daysLeft !== null && daysLeft > 0
  const isExpiring = isActive && daysLeft !== null && daysLeft <= 7

  const cardBg = isActive
    ? (isExpiring ? 'bg-gradient-to-br from-yellow-950 to-surface' : 'bg-gradient-to-br from-green-950 to-surface')
    : 'bg-gradient-to-br from-red-950 to-surface'

  const cardBorder = isActive
    ? (isExpiring ? 'border-warning/25' : 'border-success/25')
    : 'border-primary/25'

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-black text-white">
          ¡Hola, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Panel de tu membresía en SportLife</p>
      </div>

      {isLoading ? (
        <div className="text-gray-500 text-sm">Cargando membresía...</div>
      ) : (
        <>
          {/* Membership card */}
          <div className={`${cardBg} border ${cardBorder} rounded-2xl p-6 lg:p-8 mb-6`}>
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Dumbbell size={22} className={isActive ? 'text-success' : 'text-primary'} />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                    Estado de Membresía
                  </span>
                </div>
                <div className="text-3xl lg:text-4xl font-black text-white mb-3">
                  {membership?.planName || 'Sin plan'}
                </div>
                <StatusBadge status={membership?.status || 'none'} expiresAt={membership?.expiresAt} />
              </div>

              {isActive && daysLeft !== null && (
                <div className="text-center bg-black/30 rounded-xl px-6 py-4">
                  <div className={`text-5xl lg:text-6xl font-black leading-none ${isExpiring ? 'text-warning' : 'text-success'}`}>
                    {daysLeft}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 uppercase tracking-widest">días restantes</div>
                </div>
              )}
            </div>

            {membership?.expiresAt && (
              <div className="flex items-center gap-2 mt-6 text-gray-500 text-xs">
                <Calendar size={13} />
                Vence el {new Date(membership.expiresAt).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            {(!isActive || isExpiring) && (
              <button
                onClick={() => navigate('/plans')}
                className="px-6 py-3 bg-primary hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-xl text-sm shadow-lg shadow-primary/30 transition-all"
              >
                💪 PAGAR MEMBRESÍA
              </button>
            )}
            <button
              onClick={() => navigate('/plans')}
              className="px-6 py-3 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-400 font-semibold rounded-xl text-sm transition-colors"
            >
              Ver planes
            </button>
          </div>

          {/* Expiring warning */}
          {isExpiring && (
            <div className="flex items-center gap-3 bg-warning/10 border border-warning/30 rounded-xl px-4 py-3 text-warning text-sm">
              <AlertCircle size={16} />
              Tu membresía vence en {daysLeft} día{daysLeft !== 1 ? 's' : ''}. ¡Renová ahora para no perder continuidad!
            </div>
          )}
        </>
      )}
    </Layout>
  )
}
