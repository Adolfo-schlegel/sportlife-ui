import { useQuery } from '@tanstack/react-query'
import Layout from '../../components/Layout'
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
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-black text-white">Miembros</h1>
        <p className="text-gray-500 mt-1 text-sm">Todos los usuarios registrados</p>
      </div>

      {isLoading ? (
        <div className="text-gray-500 text-sm">Cargando usuarios...</div>
      ) : (
        <div className="bg-surface border border-border-dark rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-background border-b border-border-dark">
                  {['Nombre', 'Email', 'Rol', 'Registrado'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={user.id} className={i < users.length - 1 ? 'border-b border-[#1a1a1a]' : ''}>
                    <td className="px-4 py-3.5 text-white text-sm font-medium whitespace-nowrap">{user.name}</td>
                    <td className="px-4 py-3.5 text-gray-500 text-sm">{user.email}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold border ${
                        user.role === 'admin'
                          ? 'text-primary bg-primary/10 border-primary/20'
                          : 'text-info bg-info/10 border-info/20'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 text-xs whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString('es-AR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-600 text-sm">No hay usuarios registrados</div>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}
