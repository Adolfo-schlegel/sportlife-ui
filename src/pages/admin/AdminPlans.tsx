import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import Layout from '../../components/Layout'
import client from '../../api/client'
import { Plus, Edit, Trash2 } from 'lucide-react'
import styles from './AdminPlans.module.css'

interface Plan {
  id: string
  name: string
  price: number
  durationDays: number
  active: boolean
}

export default function AdminPlans() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editPlan, setEditPlan] = useState<Plan | null>(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [days, setDays] = useState('')

  const { data: plans = [], isLoading } = useQuery<Plan[]>({
    queryKey: ['admin-plans'],
    queryFn: () => client.get('/plans/all').then(r => r.data),
  })

  const resetForm = () => { setShowForm(false); setEditPlan(null); setName(''); setPrice(''); setDays('') }

  const createMutation = useMutation({
    mutationFn: (data: { name: string; price: number; durationDays: number }) => client.post('/plans', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-plans'] }); resetForm() },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Plan> }) => client.put(`/plans/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-plans'] }); resetForm() },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => client.delete(`/plans/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-plans'] }),
  })

  const openEdit = (plan: Plan) => {
    setEditPlan(plan); setName(plan.name); setPrice(String(plan.price)); setDays(String(plan.durationDays)); setShowForm(true)
  }

  const handleSubmit = () => {
    if (!name || !price || !days) return
    const data = { name, price: Number(price), durationDays: Number(days) }
    if (editPlan) updateMutation.mutate({ id: editPlan.id, data })
    else createMutation.mutate(data)
  }

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(n)

  return (
    <Layout>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Planes</h1>
          <p className={styles.subtitle}>Gestión de planes de membresía</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className={styles.btnNew}>
          <Plus size={15} /> NUEVO PLAN
        </button>
      </div>

      {showForm && (
        <div className={styles.form}>
          <h3 className={styles.formTitle}>{editPlan ? 'Editar Plan' : 'Nuevo Plan'}</h3>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Nombre</label>
              <input value={name} onChange={e => setName(e.target.value)} className={styles.input} placeholder="Plan Mensual" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Precio (ARS)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} className={styles.input} placeholder="15000" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Días</label>
              <input type="number" value={days} onChange={e => setDays(e.target.value)} className={styles.input} placeholder="30" />
            </div>
          </div>
          <div className={styles.formActions}>
            <button onClick={handleSubmit} className={styles.btnSave}>{editPlan ? 'GUARDAR' : 'CREAR'}</button>
            <button onClick={resetForm} className={styles.btnCancel}>Cancelar</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className={styles.loading}>Cargando...</div>
      ) : (
        <div className={styles.grid}>
          {plans.map(plan => (
            <div key={plan.id} className={`${styles.card} ${!plan.active ? styles.cardInactive : ''}`}>
              <div className={styles.cardHeader}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className={styles.cardActions}>
                  <button onClick={() => openEdit(plan)} className={styles.iconBtn}><Edit size={14} /></button>
                  <button onClick={() => deleteMutation.mutate(plan.id)} className={`${styles.iconBtn} ${styles.iconBtnDanger}`}><Trash2 size={14} /></button>
                </div>
              </div>
              <div className={styles.planPrice}>{formatPrice(plan.price)}</div>
              <div className={styles.planDays}>{plan.durationDays} días</div>
              {!plan.active && <div className={styles.planInactive}>● Inactivo</div>}
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
