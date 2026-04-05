import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import client from '../api/client'
import { Check } from 'lucide-react'

interface Plan {
  id: string
  name: string
  price: number
  durationDays: number
  active: boolean
}

export default function Plans() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [error, setError] = useState('')

  const { data: plans = [], isLoading } = useQuery<Plan[]>({
    queryKey: ['plans'],
    queryFn: () => client.get('/plans').then(r => r.data),
  })

  const handleSelectPlan = async (plan: Plan) => {
    setError('')
    setLoadingPlan(plan.id)
    try {
      const res = await client.post('/payments/preference', { planId: plan.id })
      window.location.href = res.data.initPoint
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Error al procesar el pago. Intentá de nuevo.')
      setLoadingPlan(null)
    }
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(price)

  const getPlanFeatures = (days: number) => {
    const base = ['Acceso ilimitado al box', 'Clases WOD diarias', 'Coaching profesional']
    if (days >= 90) return [...base, 'Descuento especial', 'Evaluación física mensual']
    if (days >= 365) return [...base, 'Mayor ahorro', 'Evaluación física bimestral', 'Acceso a eventos exclusivos']
    return base
  }

  const isPopular = (days: number) => days === 90

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>Planes de Membresía</h1>
          <p style={{ color: '#666', marginTop: 4 }}>Elegí el plan que mejor se adapte a tu entrenamiento</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, color: '#E53E3E', fontSize: 14 }}>
            {error}
          </div>
        )}

        {isLoading ? (
          <div style={{ color: '#666' }}>Cargando planes...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 960 }}>
            {plans.map(plan => {
              const popular = isPopular(plan.durationDays)
              const features = getPlanFeatures(plan.durationDays)
              const pricePerDay = (plan.price / plan.durationDays).toFixed(0)

              return (
                <div key={plan.id} style={{
                  background: '#111',
                  border: popular ? '2px solid #E53E3E' : '1px solid #222',
                  borderRadius: 16, padding: 28,
                  position: 'relative',
                  boxShadow: popular ? '0 0 30px rgba(229,62,62,0.15)' : 'none'
                }}>
                  {popular && (
                    <div style={{
                      position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                      background: '#E53E3E', color: '#fff', fontSize: 11, fontWeight: 800,
                      padding: '4px 14px', borderRadius: 20, letterSpacing: 1, whiteSpace: 'nowrap'
                    }}>
                      ⚡ MÁS POPULAR
                    </div>
                  )}

                  <div style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{plan.name}</h3>
                    <div style={{ fontSize: 38, fontWeight: 900, color: popular ? '#E53E3E' : '#fff', lineHeight: 1, marginBottom: 4 }}>
                      {formatPrice(plan.price)}
                    </div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      {plan.durationDays} días · ${pricePerDay}/día
                    </div>
                  </div>

                  <ul style={{ listStyle: 'none', marginBottom: 24 }}>
                    {features.map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#bbb', fontSize: 13, marginBottom: 8 }}>
                        <Check size={14} color="#48BB78" /> {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={loadingPlan === plan.id}
                    style={{
                      width: '100%', padding: '13px',
                      background: popular ? '#E53E3E' : 'transparent',
                      border: popular ? 'none' : '1px solid #E53E3E',
                      borderRadius: 10, color: '#fff',
                      fontSize: 14, fontWeight: 700, cursor: loadingPlan ? 'not-allowed' : 'pointer',
                      letterSpacing: 1, textTransform: 'uppercase',
                      transition: 'opacity 0.15s',
                      opacity: loadingPlan === plan.id ? 0.6 : 1
                    }}
                  >
                    {loadingPlan === plan.id ? 'Procesando...' : 'SELECCIONAR PLAN'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
