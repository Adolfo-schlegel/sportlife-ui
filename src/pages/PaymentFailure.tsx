import { useNavigate } from 'react-router-dom'
import { XCircle } from 'lucide-react'

export default function PaymentFailure() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <XCircle size={80} color="#E53E3E" style={{ marginBottom: 24 }} />
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 12 }}>PAGO RECHAZADO</h1>
        <p style={{ color: '#888', fontSize: 16, marginBottom: 32 }}>Hubo un problema con tu pago. Podés intentar de nuevo.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/plans')} style={{ background: '#E53E3E', border: 'none', borderRadius: 10, color: '#fff', padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            INTENTAR DE NUEVO
          </button>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: '1px solid #333', borderRadius: 10, color: '#888', padding: '14px 24px', fontSize: 14, cursor: 'pointer' }}>
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  )
}
