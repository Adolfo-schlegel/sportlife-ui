import { useState, useRef, useEffect } from 'react'
import styles from './MemberSearchInput.module.css'

interface User { id: string; name: string; email: string }

interface Props {
  users: User[]
  selectedId: string
  onSelect: (id: string) => void
  placeholder?: string
}

export default function MemberSearchInput({ users, selectedId, onSelect, placeholder = 'Buscar socio...' }: Props) {
  const selectedUser = users.find(u => u.id === selectedId)
  const [query, setQuery] = useState(selectedUser?.name ?? '')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQuery(selectedUser?.name ?? '')
  }, [selectedId, selectedUser?.name])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = query.trim()
    ? users.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
      )
    : users

  const handleInput = (val: string) => {
    setQuery(val)
    setOpen(true)
    if (!val) onSelect('')
  }

  const handleSelect = (u: User) => {
    setQuery(u.name)
    onSelect(u.id)
    setOpen(false)
  }

  return (
    <div className={styles.wrap} ref={ref}>
      <input
        className={styles.input}
        value={query}
        onChange={e => handleInput(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul className={styles.dropdown}>
          {filtered.slice(0, 8).map(u => (
            <li
              key={u.id}
              className={`${styles.option} ${u.id === selectedId ? styles.optionActive : ''}`}
              onMouseDown={() => handleSelect(u)}
            >
              <span className={styles.optionName}>{u.name}</span>
              <span className={styles.optionEmail}>{u.email}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
