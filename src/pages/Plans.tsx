import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import Layout from '../components/Layout'
import client from '../api/client'
import { Check } from 'lucide-react'
import styles from './Plans.module.css'

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
    if (days >= 90)  return [...base, 'Descuento especial', 'Evaluación física mensual']
    return base
  }

  return (
    <Layout>
      <div className={styles.header}>
        <h1 className={styles.title}>Planes de Membresía</h1>
        <p className={styles.subtitle}>Elegí el plan que mejor se adapte a tu entrenamiento</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {isLoading ? (
        <div className={styles.loading}>Cargando planes...</div>
      ) : (
        <div className={styles.grid}>
          {plans.map(plan => {
            const popular = plan.durationDays === 90
            const features = getPlanFeatures(plan.durationDays)
            const pricePerDay = (plan.price / plan.durationDays).toFixed(0)

            return (
              <div key={plan.id} className={`${styles.card} ${popular ? styles.cardPopular : ''}`}>
                {popular && <div className={styles.popularBadge}>MÁS POPULAR</div>}

                <div className={`${styles.price} ${popular ? styles.pricePopular : ''}`}>
                  {formatPrice(plan.price)}
                </div>
                <div className={styles.planName}>{plan.name}</div>
                <div className={styles.priceMeta}>{plan.durationDays} días · ${pricePerDay}/día</div>

                <ul className={styles.features}>
                  {features.map((f, i) => (
                    <li key={i} className={styles.feature}>
                      <Check size={13} className={styles.featureIcon} /> {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={loadingPlan === plan.id}
                  className={`${styles.btn} ${popular ? styles.btnFilled : styles.btnOutline}`}
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
