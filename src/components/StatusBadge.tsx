interface StatusBadgeProps {
  status: string
  expiresAt?: string | null
}

export default function StatusBadge({ status, expiresAt }: StatusBadgeProps) {
  let color = '#888'
  let bg = '#1a1a1a'
  let label = status

  const now = new Date()
  const expiry = expiresAt ? new Date(expiresAt) : null
  const daysLeft = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null

  if (status === 'active' && expiry) {
    if (expiry < now) {
      color = '#E53E3E'; bg = 'rgba(229,62,62,0.12)'; label = 'Vencida'
    } else if (daysLeft !== null && daysLeft <= 7) {
      color = '#ECC94B'; bg = 'rgba(236,201,75,0.12)'; label = 'Por vencer'
    } else {
      color = '#48BB78'; bg = 'rgba(72,187,120,0.12)'; label = 'Activa'
    }
  } else if (status === 'expired') {
    color = '#E53E3E'; bg = 'rgba(229,62,62,0.12)'; label = 'Vencida'
  } else if (status === 'approved') {
    color = '#48BB78'; bg = 'rgba(72,187,120,0.12)'; label = 'Aprobado'
  } else if (status === 'pending') {
    color = '#ECC94B'; bg = 'rgba(236,201,75,0.12)'; label = 'Pendiente'
  } else if (status === 'none') {
    color = '#888'; bg = '#1a1a1a'; label = 'Sin membresía'
  }

  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      color,
      background: bg,
      border: `1px solid ${color}30`,
    }}>
      {label}
    </span>
  )
}
