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

type Stage = 'loading' | 'ready' | 'processing' | 'success' | 'error'

export default function CheckoutModal({ planId, planName, amount, onClose, onSuccess }: Props) {
  const [preferenceId, setPreferenceId] = useState<string | null>(null)
  const [stage, setStage] = useState<Stage>('loading')
  const [paymentError, setPaymentError] = useState<string | null>(null)
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
        setStage('ready')
      } catch {
        setStage('error')
      }
    }
    init()
  }, [planId])

  const handleSubmit = async (data: IPaymentFormData) => {
    setPaymentError(null)
    setStage('processing')
    const { formData } = data
    const payer = formData as unknown as {
      payer?: { identification?: { type?: string; number?: string } }
    }

    try {
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
        setStage('success')
        setTimeout(() => onSuccess(), 2000)
      } else {
        const msg = `El pago fue ${res.data.status}. Intentá con otro medio de pago.`
        setPaymentError(msg)
        setStage('ready')
        throw new Error(msg)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      if (message.includes('internal_error') || message.includes('InternalServerError')) {
        setPaymentError('Error temporal del sandbox de MercadoPago. Intentá de nuevo en unos segundos.')
      } else if (message && !message.includes('El pago fue')) {
        setPaymentError(message)
      }
      if (stage !== 'ready') setStage('ready')
      throw err
    }
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(price)

  const canClose = stage !== 'processing' && stage !== 'success'

  return (
    <div className={styles.overlay} onClick={canClose ? onClose : undefined}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {/* Processing overlay */}
        {stage === 'processing' && (
          <div className={styles.processingOverlay}>
            <div className={styles.spinner} />
            <p className={styles.processingText}>Procesando pago...</p>
            <p className={styles.processingNote}>No cierres esta ventana</p>
          </div>
        )}

        {/* Success state */}
        {stage === 'success' && (
          <div className={styles.successOverlay}>
            <div className={styles.checkCircle}>
              <svg viewBox="0 0 52 52" className={styles.checkSvg}>
                <circle className={styles.checkCirclePath} cx="26" cy="26" r="25" fill="none" />
                <path className={styles.checkMark} fill="none" d="M14 27l8 8 16-16" />
              </svg>
            </div>
            <p className={styles.successText}>¡Pago aprobado!</p>
            <p className={styles.successNote}>Redirigiendo...</p>
          </div>
        )}

        {/* Normal content */}
        {stage !== 'success' && (
          <>
            {canClose && (
              <button className={styles.closeBtn} onClick={onClose}>×</button>
            )}
            <h2 className={styles.title}>{planName}</h2>
            <p className={styles.amount}>{formatPrice(amount)}</p>

            {stage === 'loading' && <p className={styles.loading}>Cargando formulario de pago...</p>}
            {stage === 'error' && <p className={styles.error}>Error al iniciar el pago. Intentá de nuevo.</p>}
            {paymentError && <p className={styles.error}>{paymentError}</p>}

            {(stage === 'ready' || stage === 'processing') && preferenceId !== null && (
              <Payment
                initialization={{ amount }}
                customization={{
                  paymentMethods: {
                    creditCard: 'all',
                    debitCard: 'all',
                  } as Parameters<typeof Payment>[0]['customization']['paymentMethods'],
                }}
                onSubmit={handleSubmit}
                onError={(err) => {
                  if (err.message && !err.message.includes('payment_method_not_in_allowed_types')) {
                    setPaymentError(err.message)
                    setStage('ready')
                  }
                }}
                onReady={() => {}}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
