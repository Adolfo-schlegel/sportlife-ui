import { useEffect, useRef, useState } from 'react'
import { initMercadoPago, Payment } from '@mercadopago/sdk-react'
import type { IPaymentFormData } from '@mercadopago/sdk-react/esm/bricks/payment/type'
import client from '../api/client'
import styles from './CheckoutModal.module.css'

interface Props {
  planId: string
  planName: string
  amount: number
  onClose: () => void
  onSuccess: () => void
}

interface PublicConfig {
  publicKey: string
  isSandbox: boolean
}

export default function CheckoutModal({ planId, planName, amount, onClose, onSuccess }: Props) {
  const [preferenceId, setPreferenceId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const initialized = useRef(false)

  useEffect(() => {
    async function init() {
      try {
        const [configRes, prefRes] = await Promise.all([
          client.get<PublicConfig>('/payments/public-config'),
          client.post<{ preferenceId: string }>('/payments/preference', { planId }),
        ])

        if (!initialized.current) {
          initMercadoPago(configRes.data.publicKey, { locale: 'es-AR' })
          initialized.current = true
        }

        setPreferenceId(prefRes.data.preferenceId)
      } catch {
        setError('Error al iniciar el pago. Intentá de nuevo.')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [planId])

  const handleSubmit = async (data: IPaymentFormData) => {
    const { formData } = data
    const payer = formData as unknown as {
      payer?: { identification?: { type?: string; number?: string } }
    }

    const res = await client.post('/payments/process', {
      planId,
      token: (formData as unknown as { token: string }).token,
      paymentMethodId: (formData as unknown as { payment_method_id: string }).payment_method_id,
      installments: (formData as unknown as { installments: number }).installments ?? 1,
      issuerId: (formData as unknown as { issuer_id?: string }).issuer_id ?? null,
      identificationType: payer.payer?.identification?.type ?? 'DNI',
      identificationNumber: payer.payer?.identification?.number ?? '0',
    })

    if (res.data.status === 'approved' || res.data.status === 'in_process') {
      setTimeout(() => onSuccess(), 1000)
    } else {
      throw new Error(`El pago fue ${res.data.status}. Intentá con otro medio de pago.`)
    }
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(price)

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <h2 className={styles.title}>{planName}</h2>
        <p className={styles.amount}>{formatPrice(amount)}</p>

        {loading && <p className={styles.loading}>Cargando formulario de pago...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && preferenceId !== null && (
          <Payment
            initialization={{ amount }}
            customization={{
              paymentMethods: {
                creditCard: 'all',
              },
            }}
            onSubmit={handleSubmit}
            onError={(err) => setError(err.message ?? 'Error procesando el pago')}
            onReady={() => {}}
          />
        )}
      </div>
    </div>
  )
}
