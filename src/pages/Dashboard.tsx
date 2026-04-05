import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Sidebar from '../components/Sidebar'
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
  const { user, isAdmin } = useAuth()
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>
            ¡Hola, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p style={{ color: '#666', marginTop: 4 }}>Panel de tu membresía en SportLife</p>
        </div>

        {isLoading ? (
          <div style={{ color: '#666' }}>Cargando membresía...</div>
        ) : (
          <>
            {/* Membership Status Card */}
            <div style={{
              background: isActive ? (isExpiring ? 'linear-gradient(135deg, #1a1500, #111)' : 'linear-gradient(135deg, #0a1a0a, #111)') : 'linear-gradient(135deg, #1a0a0a, #111)',
              border: `1px solid ${isActive ? (isExpiring ? '#ECC94B40' : '#48BB7840') : '#E53E3E40'}`,
              borderRadius: 16, padding: 32, marginBottom: 24
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <Dumbbell size={24} color={isActive ? '#48BB78' : '#E53E3E'} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>
                      Estado de Membresía
                    </span>
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
                    {membership?.planName || 'Sin plan'}
                  </div>
                  <StatusBadge status={membership?.status || 'none'} expiresAt={membership?.expiresAt} />
                </div>

                {isActive && daysLeft !== null && (
                  <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: '20px 28px' }}>
                    <div style={{
                      fontSize: 56, fontWeight: 900,
                      color: isExpiring ? '#ECC94B' : '#48BB78',
                      lineHeight: 1
                    }}>
                      {daysLeft}
                    </div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                      días restantes
                    </div>
                  </div>
                )}
              </div>

              {membership?.expiresAt && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20, color: '#888', fontSize: 13 }}>
                  <Calendar size={14} />
                  Vence el {new Date(membership.expiresAt).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              )}
            </div>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {(!isActive || isExpiring) && (
                <button
                  onClick={() => navigate('/plans')}
                  style={{
                    background: '#E53E3E', border: 'none', borderRadius: 10, color: '#fff',
                    fontSize: 15, fontWeight: 800, padding: '14px 28px', cursor: 'pointer',
                    letterSpacing: 1, textTransform: 'uppercase',
                    boxShadow: '0 4px 20px rgba(229,62,62,0.4)',
                    transition: 'transform 0.1s, box-shadow 0.1s'
                  }}
                >
                  💪 PAGAR MEMBRESÍA
                </button>
              )}

              <button
                onClick={() => navigate('/plans')}
                style={{
                  background: 'transparent', border: '1px solid #333', borderRadius: 10,
                  color: '#888', fontSize: 14, fontWeight: 600, padding: '14px 24px',
                  cursor: 'pointer', transition: 'border-color 0.15s'
                }}
              >
                Ver planes
              </button>
            </div>

            {isExpiring && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                marginTop: 20, background: 'rgba(236,201,75,0.1)',
                border: '1px solid rgba(236,201,75,0.3)', borderRadius: 10,
                padding: '12px 16px', color: '#ECC94B', fontSize: 13
              }}>
                <AlertCircle size={16} />
                Tu membresía vence en {daysLeft} día{daysLeft !== 1 ? 's' : ''}. ¡Renová ahora para no perder continuidad!
              </div>
            )}

            {isAdmin && (
              <div style={{
                marginTop: 32, background: '#111', border: '1px solid #222',
                borderRadius: 12, padding: 24
              }}>
                <h3 style={{ color: '#E53E3E', fontWeight: 700, marginBottom: 12 }}>🛡️ Acceso Administrador</h3>
                <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>Tenés acceso al panel administrativo.</p>
                <button
                  onClick={() => navigate('/admin')}
                  style={{
                    background: '#E53E3E', border: 'none', borderRadius: 8, color: '#fff',
                    padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13
                  }}
                >
                  IR AL PANEL ADMIN
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
