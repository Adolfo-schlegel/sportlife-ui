import { useQuery } from '@tanstack/react-query'
import Layout from '../../components/Layout'
import client from '../../api/client'
import styles from '../../styles/table.module.css'

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
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Miembros</h1>
          <p className={styles.subtitle}>Todos los usuarios registrados</p>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Cargando usuarios...</div>
      ) : (
        <div className={styles.tableWrap}>
          <div className={styles.scrollX}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  {['Nombre', 'Email', 'Rol', 'Registrado'].map(h => (
                    <th key={h} className={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className={styles.tr}>
                    <td className={styles.tdPrimary}>{user.name}</td>
                    <td className={styles.tdSecondary}>{user.email}</td>
                    <td className={styles.td}>
                      <span className={`${styles.roleBadge} ${user.role === 'admin' ? styles.roleAdmin : styles.roleMember}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className={styles.tdMuted}>{new Date(user.createdAt).toLocaleDateString('es-AR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <div className={styles.empty}>No hay usuarios registrados</div>}
          </div>
        </div>
      )}
    </Layout>
  )
}
