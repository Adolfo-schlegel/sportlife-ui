import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import CheckoutModal from '../components/CheckoutModal'
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
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [error, setError] = useState('')

  const { data: plans = [], isLoading } = useQuery<Plan[]>({
    queryKey: ['plans'],
    queryFn: () => client.get('/plans').then(r => r.data),
  })

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
                  onClick={() => { setError(''); setSelectedPlan(plan) }}
                  className={`${styles.btn} ${popular ? styles.btnFilled : styles.btnOutline}`}
                >
                  SELECCIONAR PLAN
                </button>
              </div>
            )
          })}
        </div>
      )}

      {selectedPlan && (
        <CheckoutModal
          planId={selectedPlan.id}
          planName={selectedPlan.name}
          amount={selectedPlan.price}
          onClose={() => setSelectedPlan(null)}
          onSuccess={() => navigate('/payment-success')}
        />
      )}
    </Layout>
  )
}
