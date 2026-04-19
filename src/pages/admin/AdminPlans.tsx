import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import Layout from '../../components/Layout'
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

  const inputClass = 'w-full px-3 py-2.5 bg-background border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary transition-colors'

  return (
    <Layout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-white">Planes</h1>
          <p className="text-gray-500 mt-1 text-sm">Gestión de planes de membresía</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 bg-primary hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors"
        >
          <Plus size={16} /> NUEVO PLAN
        </button>
      </div>

      {showForm && (
        <div className="bg-surface border border-gray-700 rounded-xl p-6 mb-6">
          <h3 className="text-white font-bold mb-4">{editPlan ? 'Editar Plan' : 'Nuevo Plan'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-[11px] text-gray-500 uppercase tracking-widest mb-2">Nombre</label>
              <input value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Plan Mensual" />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 uppercase tracking-widest mb-2">Precio (ARS)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} className={inputClass} placeholder="15000" />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 uppercase tracking-widest mb-2">Días</label>
              <input type="number" value={days} onChange={e => setDays(e.target.value)} className={inputClass} placeholder="30" />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="bg-primary hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors"
            >
              {editPlan ? 'GUARDAR' : 'CREAR'}
            </button>
            <button
              onClick={resetForm}
              className="bg-transparent border border-gray-700 hover:border-gray-500 text-gray-400 px-4 py-2.5 rounded-lg text-sm transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-gray-500 text-sm">Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`bg-surface border rounded-xl p-5 transition-opacity ${
                plan.active ? 'border-border-dark opacity-100' : 'border-[#1a1a1a] opacity-50'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-bold text-white">{plan.name}</h3>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(plan)} className="text-gray-500 hover:text-white p-1 transition-colors">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => deleteMutation.mutate(plan.id)} className="text-primary hover:text-red-400 p-1 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="text-2xl font-black text-primary mb-1">{formatPrice(plan.price)}</div>
              <div className="text-xs text-gray-600">{plan.durationDays} días</div>
              {!plan.active && <div className="text-[11px] text-gray-600 mt-2">● Inactivo</div>}
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
