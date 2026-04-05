import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

export default function PaymentSuccess() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <CheckCircle size={80} color="#48BB78" style={{ marginBottom: 24 }} />
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 12 }}>¡PAGO APROBADO!</h1>
        <p style={{ color: '#888', fontSize: 16, marginBottom: 32 }}>Tu membresía fue activada exitosamente. ¡A entrenar! 💪</p>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ background: '#E53E3E', border: 'none', borderRadius: 10, color: '#fff', padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
        >
          IR AL DASHBOARD
        </button>
      </div>
    </div>
  )
}
