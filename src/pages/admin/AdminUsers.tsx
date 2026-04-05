import { useQuery } from '@tanstack/react-query'
import Sidebar from '../../components/Sidebar'
import client from '../../api/client'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export default function AdminUsers() {
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['admin-users'],
    queryFn: () => client.get('/users').then(r => r.data),
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>Miembros</h1>
          <p style={{ color: '#666', marginTop: 4 }}>Todos los usuarios registrados</p>
        </div>

        {isLoading ? (
          <div style={{ color: '#666' }}>Cargando usuarios...</div>
        ) : (
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0A0A0A', borderBottom: '1px solid #222' }}>
                  {['Nombre', 'Email', 'Rol', 'Registrado'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: 1 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={user.id} style={{ borderBottom: i < users.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                    <td style={{ padding: '14px 16px', color: '#fff', fontSize: 14, fontWeight: 500 }}>
                      {user.name}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#888', fontSize: 13 }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11,
                        fontWeight: 600, background: user.role === 'admin' ? 'rgba(229,62,62,0.15)' : 'rgba(99,179,237,0.1)',
                        color: user.role === 'admin' ? '#E53E3E' : '#63B3ED',
                        border: `1px solid ${user.role === 'admin' ? '#E53E3E30' : '#63B3ED30'}`
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#666', fontSize: 12 }}>
                      {new Date(user.createdAt).toLocaleDateString('es-AR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div style={{ padding: 32, textAlign: 'center', color: '#666' }}>No hay usuarios registrados</div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
