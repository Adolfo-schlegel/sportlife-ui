import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { initMercadoPago, Payment } from '@mercadopago/sdk-react'
import type { IPaymentFormData } from '@mercadopago/sdk-react/esm/bricks/payment/type'
import { ArrowLeft } from 'lucide-react'
import client from '../api/client'
import styles from './Checkout.module.css'

interface LocationState {
  planId: string
  planName: string
  amount: number
}

interface PublicConfig {
  publicKey: string
  isSandbox: boolean
}

type Stage = 'loading' | 'ready' | 'processing' | 'success' | 'error'

export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null

  const [preferenceId, setPreferenceId] = useState<string | null>(null)
  const [stage, setStage] = useState<Stage>('loading')
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (!state) { navigate('/plans', { replace: true }); return }

    async function init() {
      try {
        const [configRes, prefRes] = await Promise.all([
          client.get<PublicConfig>('/payments/public-config'),
          client.post<{ preferenceId: string }>('/payments/preference', { planId: state!.planId }),
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
  }, [])

  const handleSubmit = async (data: IPaymentFormData) => {
    setPaymentError(null)
    setStage('processing')
    const { formData } = data
    const payer = formData as unknown as {
      payer?: { identification?: { type?: string; number?: string } }
    }

    try {
      const res = await client.post('/payments/process', {
        planId: state!.planId,
        token: (formData as unknown as { token: string }).token,
        paymentMethodId: (formData as unknown as { payment_method_id: string }).payment_method_id,
        installments: (formData as unknown as { installments: number }).installments ?? 1,
        issuerId: (formData as unknown as { issuer_id?: string }).issuer_id ?? null,
        identificationType: payer.payer?.identification?.type ?? 'DNI',
        identificationNumber: payer.payer?.identification?.number ?? '0',
      })

      if (res.data.status === 'approved' || res.data.status === 'in_process') {
        setStage('success')
        setTimeout(() => navigate('/payment/success', { replace: true }), 2000)
      } else {
        const msg = `El pago fue ${res.data.status}. Intentá con otro medio de pago.`
        setPaymentError(msg)
        setStage('ready')
        throw new Error(msg)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      if (message.includes('internal_error') || message.includes('InternalServerError')) {
        setPaymentError('Error temporal de MercadoPago. Intentá de nuevo en unos segundos.')
      } else if (message && !message.includes('El pago fue')) {
        setPaymentError(message)
      }
      if (stage !== 'ready') setStage('ready')
      throw err
    }
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(price)

  if (!state) return null

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        {stage !== 'processing' && stage !== 'success' && (
          <button className={styles.backBtn} onClick={() => navigate('/plans')}>
            <ArrowLeft size={18} /> Volver
          </button>
        )}
        <div className={styles.planInfo}>
          <span className={styles.planName}>{state.planName}</span>
          <span className={styles.planAmount}>{formatPrice(state.amount)}</span>
        </div>
      </div>

      {/* Processing overlay */}
      {stage === 'processing' && (
        <div className={styles.fullOverlay}>
          <div className={styles.spinner} />
          <p className={styles.processingText}>Procesando pago...</p>
          <p className={styles.processingNote}>No cierres esta ventana</p>
        </div>
      )}

      {/* Success overlay */}
      {stage === 'success' && (
        <div className={styles.fullOverlay}>
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

      {/* Brick area */}
      {stage !== 'processing' && stage !== 'success' && (
        <div className={styles.brickWrap}>
          {stage === 'loading' && <p className={styles.loading}>Cargando formulario de pago...</p>}
          {stage === 'error'   && <p className={styles.error}>Error al iniciar el pago. Volvé e intentá de nuevo.</p>}
          {paymentError        && <p className={styles.error}>{paymentError}</p>}

          {stage === 'ready' && (
            <div className={styles.mpBadge}>
              <svg className={styles.lockIcon} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span>Pago seguro con</span>
              <img
                src="https://http2.mlstatic.com/frontend-assets/mp-web-navigation/ui-navigation/5.19.1/mercadopago/logo__large@2x.png"
                alt="MercadoPago"
                className={styles.mpLogo}
              />
            </div>
          )}

          {(stage === 'ready') && preferenceId !== null && (
            <Payment
              initialization={{ amount: state.amount }}
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
        </div>
      )}
    </div>
  )
}
