import { useNavigate } from 'react-router-dom'
import { Clock } from 'lucide-react'

export default function PaymentPending() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <Clock size={80} color="#ECC94B" style={{ marginBottom: 24 }} />
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 12 }}>PAGO PENDIENTE</h1>
        <p style={{ color: '#888', fontSize: 16, marginBottom: 12 }}>Tu pago está siendo procesado.</p>
        <p style={{ color: '#666', fontSize: 14, marginBottom: 32 }}>Te notificaremos cuando se acredite. Puede demorar hasta 2 días hábiles.</p>
        <button onClick={() => navigate('/dashboard')} style={{ background: '#E53E3E', border: 'none', borderRadius: 10, color: '#fff', padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          IR AL DASHBOARD
        </button>
      </div>
    </div>
  )
}
