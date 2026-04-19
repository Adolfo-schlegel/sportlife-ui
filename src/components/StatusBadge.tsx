interface StatusBadgeProps {
  status: string
  expiresAt?: string | null
}

export default function StatusBadge({ status, expiresAt }: StatusBadgeProps) {
  const now = new Date()
  const expiry = expiresAt ? new Date(expiresAt) : null
  const daysLeft = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null

  let colorClass = 'text-gray-500 bg-gray-800 border-gray-700'
  let label = status

  if (status === 'active' && expiry) {
    if (expiry < now) {
      colorClass = 'text-primary bg-primary/10 border-primary/20'; label = 'Vencida'
    } else if (daysLeft !== null && daysLeft <= 7) {
      colorClass = 'text-warning bg-warning/10 border-warning/20'; label = 'Por vencer'
    } else {
      colorClass = 'text-success bg-success/10 border-success/20'; label = 'Activa'
    }
  } else if (status === 'expired') {
    colorClass = 'text-primary bg-primary/10 border-primary/20'; label = 'Vencida'
  } else if (status === 'approved') {
    colorClass = 'text-success bg-success/10 border-success/20'; label = 'Aprobado'
  } else if (status === 'pending') {
    colorClass = 'text-warning bg-warning/10 border-warning/20'; label = 'Pendiente'
  } else if (status === 'none') {
    colorClass = 'text-gray-500 bg-gray-800 border-gray-700'; label = 'Sin membresía'
  }

  return (
    <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}>
      {label}
    </span>
  )
}
