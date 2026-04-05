import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import client from '../../api/client'
import { Plus, Edit, Trash2 } from 'lucide-react'

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

  const resetForm = () => { setShowForm(false); setEditPlan(null); setName(''); setPrice(''); setDays('') }

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

  const inputStyle = { width: '100%', padding: '10px 12px', background: '#0A0A0A', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>Planes</h1>
            <p style={{ color: '#666', marginTop: 4 }}>Gestión de planes de membresía</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true) }} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#E53E3E', border: 'none', borderRadius: 8, color: '#fff', padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            <Plus size={16} /> NUEVO PLAN
          </button>
        </div>

        {showForm && (
          <div style={{ background: '#111', border: '1px solid #333', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 16 }}>{editPlan ? 'Editar Plan' : 'Nuevo Plan'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 6, textTransform: 'uppercase' }}>Nombre</label>
                <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} placeholder="Plan Mensual" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 6, textTransform: 'uppercase' }}>Precio (ARS)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} placeholder="15000" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 6, textTransform: 'uppercase' }}>Días</label>
                <input type="number" value={days} onChange={e => setDays(e.target.value)} style={inputStyle} placeholder="30" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleSubmit} style={{ background: '#E53E3E', border: 'none', borderRadius: 8, color: '#fff', padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                {editPlan ? 'GUARDAR' : 'CREAR'}
              </button>
              <button onClick={resetForm} style={{ background: 'transparent', border: '1px solid #333', borderRadius: 8, color: '#888', padding: '10px 16px', cursor: 'pointer', fontSize: 13 }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {isLoading ? <div style={{ color: '#666' }}>Cargando...</div> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {plans.map(plan => (
              <div key={plan.id} style={{ background: '#111', border: `1px solid ${plan.active ? '#222' : '#1a1a1a'}`, borderRadius: 12, padding: 20, opacity: plan.active ? 1 : 0.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{plan.name}</h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(plan)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }}><Edit size={14} /></button>
                    <button onClick={() => deleteMutation.mutate(plan.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E53E3E', padding: 4 }}><Trash2 size={14} /></button>
                  </div>
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#E53E3E', marginBottom: 4 }}>{formatPrice(plan.price)}</div>
                <div style={{ fontSize: 12, color: '#666' }}>{plan.durationDays} días</div>
                {!plan.active && <div style={{ fontSize: 11, color: '#666', marginTop: 8 }}>● Inactivo</div>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
