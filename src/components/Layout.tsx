import { useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'
import styles from './Layout.module.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={styles.wrapper}>
      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}

      <div className={`${styles.drawerWrap} ${open ? styles.drawerOpen : ''}`}>
        <Sidebar onClose={() => setOpen(false)} />
      </div>

      <div className={styles.desktopSidebar}>
        <Sidebar />
      </div>

      <div className={styles.content}>
        <div className={styles.topBar}>
          <button className={styles.hamburger} onClick={() => setOpen(true)} aria-label="Abrir menú">
            <Menu size={22} />
          </button>
          <span className={styles.topBarLogo}>SPORTLIFE</span>
        </div>

        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  )
}
