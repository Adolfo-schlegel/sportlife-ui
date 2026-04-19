import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import Layout from '../components/Layout'
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
    if (days >= 365) return [...base, 'Mayor ahorro', 'Evaluación física bimestral', 'Acceso a eventos exclusivos']
    if (days >= 90) return [...base, 'Descuento especial', 'Evaluación física mensual']
    return base
  }

  const isPopular = (days: number) => days === 90

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-black text-white">Planes de Membresía</h1>
        <p className="text-gray-500 mt-1 text-sm">Elegí el plan que mejor se adapte a tu entrenamiento</p>
      </div>

      {error && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 mb-6 text-primary text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-gray-500 text-sm">Cargando planes...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
          {plans.map(plan => {
            const popular = isPopular(plan.durationDays)
            const features = getPlanFeatures(plan.durationDays)
            const pricePerDay = (plan.price / plan.durationDays).toFixed(0)

            return (
              <div
                key={plan.id}
                className={`relative bg-surface rounded-2xl p-7 flex flex-col ${
                  popular
                    ? 'border-2 border-primary shadow-[0_0_30px_rgba(229,62,62,0.15)]'
                    : 'border border-border-dark'
                }`}
              >
                {popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[11px] font-black px-4 py-1 rounded-full tracking-wide whitespace-nowrap">
                    ⚡ MÁS POPULAR
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="text-xl font-black text-white mb-1">{plan.name}</h3>
                  <div className={`text-4xl font-black leading-none mb-1 ${popular ? 'text-primary' : 'text-white'}`}>
                    {formatPrice(plan.price)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {plan.durationDays} días · ${pricePerDay}/día
                  </div>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-400 text-sm">
                      <Check size={14} className="text-success flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={loadingPlan === plan.id}
                  className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                    popular
                      ? 'bg-primary hover:bg-red-600 text-white'
                      : 'bg-transparent border border-primary text-white hover:bg-primary/10'
                  }`}
                >
                  {loadingPlan === plan.id ? 'Procesando...' : 'SELECCIONAR PLAN'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}
