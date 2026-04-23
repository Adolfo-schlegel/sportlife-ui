import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Layout from '../../components/Layout'
import MemberSearchInput from '../../components/MemberSearchInput'
import MemberPaymentsModal from '../../components/MemberPaymentsModal'
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
  const [selectedId, setSelectedId] = useState('')
  const [detailUser, setDetailUser] = useState<User | null>(null)

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['admin-users'],
    queryFn: () => client.get('/users').then(r => r.data),
  })

  const filtered = selectedId
    ? users.filter(u => u.id === selectedId)
    : users

  return (
    <Layout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Miembros</h1>
          <p className={styles.subtitle}>Todos los usuarios registrados</p>
        </div>
        <div style={{ width: 280 }}>
          <MemberSearchInput
            users={users}
            selectedId={selectedId}
            onSelect={setSelectedId}
            placeholder="Buscar por nombre o email..."
          />
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
                {filtered.map(user => (
                  <tr
                    key={user.id}
                    className={`${styles.tr} ${styles.trClickable}`}
                    onClick={() => setDetailUser(user)}
                  >
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
            {filtered.length === 0 && <div className={styles.empty}>No se encontraron usuarios</div>}
          </div>
        </div>
      )}

      {detailUser && (
        <MemberPaymentsModal
          userId={detailUser.id}
          userName={detailUser.name}
          userEmail={detailUser.email}
          onClose={() => setDetailUser(null)}
        />
      )}
    </Layout>
  )
}
