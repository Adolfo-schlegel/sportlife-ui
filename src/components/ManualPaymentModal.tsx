import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import client from '../api/client'
import styles from './ManualPaymentModal.module.css'

interface User { id: string; name: string; email: string }
interface Plan { id: string; name: string; price: number; active: boolean }

interface Props {
  onClose: () => void
  onSuccess: () => void
  prefillUserId?: string
  prefillPlanId?: string
}

export default function ManualPaymentModal({ onClose, onSuccess, prefillUserId, prefillPlanId }: Props) {
  const queryClient = useQueryClient()
  const [users, setUsers] = useState<User[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [userId, setUserId] = useState(prefillUserId ?? '')
  const [planId, setPlanId] = useState(prefillPlanId ?? '')
  const [paymentMethod, setPaymentMethod] = useState('Efectivo')
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      client.get<User[]>('/users').then(r => r.data),
      client.get<Plan[]>('/plans').then(r => r.data),
    ]).then(([u, p]) => {
      setUsers(u)
      setPlans(p.filter(x => x.active))
    })
  }, [])

  const selectedPlan = plans.find(p => p.id === planId)

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(n)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !planId) { setError('Seleccioná un socio y un plan'); return }
    setError('')
    setLoading(true)
    try {
      await client.post('/payments/manual', { userId, planId, paymentMethod, notes: notes || null, date })
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      queryClient.invalidateQueries({ queryKey: ['expiring'] })
      onSuccess()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Error al registrar el pago')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <h2 className={styles.title}>Registrar pago manual</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Socio</label>
            <select className={styles.select} value={userId} onChange={e => setUserId(e.target.value)} required>
              <option value="">Seleccionar socio...</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name} — {u.email}</option>)}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Plan</label>
            <select className={styles.select} value={planId} onChange={e => setPlanId(e.target.value)} required>
              <option value="">Seleccionar plan...</option>
              {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {selectedPlan && (
              <span className={styles.amountHint}>Monto: {formatMoney(selectedPlan.price)}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Método de pago</label>
            <select className={styles.select} value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Fecha</label>
            <input type="date" className={styles.input} value={date} onChange={e => setDate(e.target.value)} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Notas (opcional)</label>
            <textarea className={styles.textarea} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ej: Pago en cuotas, recibo #123..." />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.btnSave} disabled={loading}>
              {loading ? 'Guardando...' : 'Registrar pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
