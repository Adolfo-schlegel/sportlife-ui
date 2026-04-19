# CSS Modules + Military Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all Tailwind utility classes with CSS Modules per component and apply a Tactical Military visual design (black/olive/orange/red) inspired by CrossFit performance gear.

**Architecture:** One `.module.css` per component or shared visual group. Design tokens live in `src/styles/variables.css` imported in `index.css`. Tailwind is removed entirely — Vite handles CSS Modules natively with zero extra config.

**Tech Stack:** React 18, TypeScript, Vite, CSS Modules (`.module.css`)

---

### Task 1: Setup — variables.css, index.css, remove Tailwind

**Files:**
- Create: `src/styles/variables.css`
- Modify: `src/index.css`
- Delete: `tailwind.config.js`, `postcss.config.js`
- Run: `npm uninstall tailwindcss autoprefixer`

- [ ] **Step 1: Create `src/styles/variables.css`**

```css
:root {
  --bg-base:      #080C08;
  --bg-surface:   #0F1A0F;
  --bg-elevated:  #162116;
  --border:       #2A3D2A;
  --border-hot:   #CC5500;
  --text-primary:   #E8E8E0;
  --text-secondary: #7A8F7A;
  --red:          #C0392B;
  --red-dark:     #A93226;
  --orange:       #CC5500;
  --orange-dark:  #AA4400;
  --green:        #4A7A3A;
  --green-bright: #6BAF5A;
  --yellow:       #D4A017;
}
```

- [ ] **Step 2: Replace `src/index.css` entirely**

```css
@import './styles/variables.css';

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 14px;
  line-height: 1.5;
}

input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 30px var(--bg-base) inset !important;
  -webkit-text-fill-color: var(--text-primary) !important;
}

a { text-decoration: none; }
button { font-family: inherit; }
```

- [ ] **Step 3: Remove Tailwind config files**

```bash
rm tailwind.config.js postcss.config.js
```

- [ ] **Step 4: Uninstall Tailwind packages**

```bash
cd sportlife-ui
npm uninstall tailwindcss autoprefixer
```

- [ ] **Step 5: Verify build still compiles**

```bash
npm run build
```
Expected: build succeeds (CSS from Tailwind is gone but no component uses module CSS yet — classes will be missing visually but TypeScript won't error)

---

### Task 2: Sidebar

**Files:**
- Create: `src/components/Sidebar.module.css`
- Modify: `src/components/Sidebar.tsx`

- [ ] **Step 1: Create `src/components/Sidebar.module.css`**

```css
.sidebar {
  width: 240px;
  min-height: 100vh;
  background: var(--bg-surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
}

.logoArea {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid var(--border);
}

.logoIcon { color: var(--orange); }

.logoText {
  font-size: 18px;
  font-weight: 900;
  color: var(--red);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  line-height: 1;
}

.logoSub {
  font-size: 10px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  margin-top: 2px;
}

.nav { flex: 1; padding: 0.75rem 0; }

.section {
  padding: 0.5rem 1.25rem 0.25rem;
  font-size: 10px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.18em;
}

.link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.75rem 1.25rem;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  border-left: 3px solid transparent;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
  cursor: pointer;
}

.link:hover {
  color: var(--text-primary);
  background: var(--bg-elevated);
}

.linkActive {
  color: var(--text-primary);
  background: var(--bg-elevated);
  border-left-color: var(--orange);
}

.footer {
  border-top: 1px solid var(--border);
  padding: 1rem 1.25rem;
}

.userName {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.userRole {
  font-size: 10px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 0.75rem;
}

.logoutBtn {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  padding: 0.375rem 0;
  width: 100%;
  transition: color 0.15s;
}

.logoutBtn:hover { color: var(--red); }
```

- [ ] **Step 2: Rewrite `src/components/Sidebar.tsx`**

```tsx
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LayoutDashboard, Users, CreditCard, Dumbbell, LogOut, Shield, Settings } from 'lucide-react'
import styles from './Sidebar.module.css'

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.link} ${isActive ? styles.linkActive : ''}`

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <Dumbbell size={26} className={styles.logoIcon} />
        <div>
          <div className={styles.logoText}>SPORTLIFE</div>
          <div className={styles.logoSub}>CrossFit Gym</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {isAdmin ? (
          <>
            <div className={styles.section}>Admin</div>
            <NavLink to="/admin" end className={linkClass} onClick={onClose}>
              <Shield size={16} /> Panel Admin
            </NavLink>
            <NavLink to="/admin/users" className={linkClass} onClick={onClose}>
              <Users size={16} /> Miembros
            </NavLink>
            <NavLink to="/admin/plans" className={linkClass} onClick={onClose}>
              <Dumbbell size={16} /> Planes
            </NavLink>
            <NavLink to="/admin/payments" className={linkClass} onClick={onClose}>
              <CreditCard size={16} /> Pagos
            </NavLink>
            <NavLink to="/admin/mercadopago" className={linkClass} onClick={onClose}>
              <Settings size={16} /> MercadoPago
            </NavLink>
          </>
        ) : (
          <>
            <div className={styles.section}>Principal</div>
            <NavLink to="/dashboard" className={linkClass} onClick={onClose}>
              <LayoutDashboard size={16} /> Dashboard
            </NavLink>
            <NavLink to="/plans" className={linkClass} onClick={onClose}>
              <CreditCard size={16} /> Planes
            </NavLink>
          </>
        )}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userName}>{user?.name}</div>
        <div className={styles.userRole}>{user?.role}</div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={15} /> Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: no TypeScript errors

---

### Task 3: Layout

**Files:**
- Create: `src/components/Layout.module.css`
- Modify: `src/components/Layout.tsx`

- [ ] **Step 1: Create `src/components/Layout.module.css`**

```css
.wrapper {
  display: flex;
  min-height: 100vh;
  background: var(--bg-base);
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 20;
}

.drawerWrap {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 30;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.drawerOpen { transform: translateX(0); }

.desktopSidebar {
  display: none;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topBar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
}

.topBarLogo {
  font-size: 16px;
  font-weight: 900;
  color: var(--red);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.hamburger {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color 0.15s;
}

.hamburger:hover { color: var(--text-primary); }

.main {
  flex: 1;
  padding: 1.5rem 1rem;
  overflow-y: auto;
}

@media (min-width: 1024px) {
  .drawerWrap { display: none; }
  .overlay { display: none; }
  .topBar { display: none; }

  .desktopSidebar {
    display: block;
    flex-shrink: 0;
  }

  .main { padding: 2.5rem; }
}
```

- [ ] **Step 2: Rewrite `src/components/Layout.tsx`**

```tsx
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
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

---

### Task 4: StatusBadge

**Files:**
- Create: `src/components/StatusBadge.module.css`
- Modify: `src/components/StatusBadge.tsx`

- [ ] **Step 1: Create `src/components/StatusBadge.module.css`**

```css
.badge {
  display: inline-block;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  border-radius: 0;
  border: 1px solid;
}

.active {
  background: rgba(74, 122, 58, 0.15);
  color: var(--green-bright);
  border-color: var(--green);
}

.expiring {
  background: rgba(212, 160, 23, 0.12);
  color: var(--yellow);
  border-color: var(--yellow);
}

.expired {
  background: rgba(192, 57, 43, 0.12);
  color: var(--red);
  border-color: var(--red);
}

.pending {
  background: rgba(204, 85, 0, 0.12);
  color: var(--orange);
  border-color: var(--orange);
}

.approved {
  background: rgba(74, 122, 58, 0.15);
  color: var(--green-bright);
  border-color: var(--green);
}

.none {
  background: rgba(122, 143, 122, 0.1);
  color: var(--text-secondary);
  border-color: var(--border);
}
```

- [ ] **Step 2: Rewrite `src/components/StatusBadge.tsx`**

```tsx
import styles from './StatusBadge.module.css'

interface StatusBadgeProps {
  status: string
  expiresAt?: string | null
}

export default function StatusBadge({ status, expiresAt }: StatusBadgeProps) {
  const now = new Date()
  const expiry = expiresAt ? new Date(expiresAt) : null
  const daysLeft = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null

  let cls = styles.none
  let label = status

  if (status === 'active' && expiry) {
    if (expiry < now) {
      cls = styles.expired; label = 'Vencida'
    } else if (daysLeft !== null && daysLeft <= 7) {
      cls = styles.expiring; label = 'Por vencer'
    } else {
      cls = styles.active; label = 'Activa'
    }
  } else if (status === 'expired') {
    cls = styles.expired; label = 'Vencida'
  } else if (status === 'approved') {
    cls = styles.approved; label = 'Aprobado'
  } else if (status === 'pending') {
    cls = styles.pending; label = 'Pendiente'
  } else if (status === 'none') {
    cls = styles.none; label = 'Sin membresía'
  }

  return <span className={`${styles.badge} ${cls}`}>{label}</span>
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

---

### Task 5: Login + Register

**Files:**
- Create: `src/styles/auth.module.css`
- Modify: `src/pages/Login.tsx`
- Modify: `src/pages/Register.tsx`

- [ ] **Step 1: Create `src/styles/auth.module.css`**

```css
.page {
  min-height: 100vh;
  background: var(--bg-base);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.card {
  width: 100%;
  max-width: 400px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-left: 4px solid var(--orange);
  padding: 2.5rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.icon { color: var(--orange); display: block; margin: 0 auto 0.75rem; }

.title {
  font-size: 2rem;
  font-weight: 900;
  color: var(--red);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  line-height: 1;
}

.subtitle {
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-top: 6px;
}

.form { display: flex; flex-direction: column; gap: 1.25rem; }

.field { display: flex; flex-direction: column; gap: 0.5rem; }

.label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-secondary);
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-base);
  border: 1px solid var(--border);
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
  border-radius: 2px;
}

.input:focus { border-color: var(--orange); }

.input::placeholder { color: var(--text-secondary); opacity: 0.7; }

.error {
  background: rgba(192, 57, 43, 0.1);
  border: 1px solid var(--red);
  color: var(--red);
  padding: 0.75rem 1rem;
  font-size: 13px;
}

.btn {
  width: 100%;
  padding: 0.875rem;
  background: var(--red);
  color: white;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
  border-radius: 2px;
  margin-top: 0.25rem;
}

.btn:hover { background: var(--red-dark); }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }

.footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 13px;
  color: var(--text-secondary);
}

.footerLink {
  color: var(--orange);
  font-weight: 700;
  text-decoration: none;
}

.footerLink:hover { color: var(--text-primary); }
```

- [ ] **Step 2: Rewrite `src/pages/Login.tsx`**

```tsx
import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Dumbbell } from 'lucide-react'
import styles from '../styles/auth.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const u = await login(email, password)
      navigate(u.role === 'admin' ? '/admin' : '/dashboard')
    } catch {
      setError('Email o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Dumbbell size={38} className={styles.icon} />
          <h1 className={styles.title}>SPORTLIFE</h1>
          <p className={styles.subtitle}>CrossFit Gym Management</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className={styles.input}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} className={styles.btn}>
            {loading ? 'Ingresando...' : 'INGRESAR'}
          </button>
        </form>

        <p className={styles.footer}>
          ¿No tenés cuenta?{' '}
          <Link to="/register" className={styles.footerLink}>Registrarse</Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Rewrite `src/pages/Register.tsx`**

```tsx
import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Dumbbell } from 'lucide-react'
import styles from '../styles/auth.module.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setLoading(true)
    try {
      const u = await register(name, email, password)
      navigate(u.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Dumbbell size={38} className={styles.icon} />
          <h1 className={styles.title}>SPORTLIFE</h1>
          <p className={styles.subtitle}>Crear nueva cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Nombre completo</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Juan García"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className={styles.input}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} className={styles.btn}>
            {loading ? 'Registrando...' : 'CREAR CUENTA'}
          </button>
        </form>

        <p className={styles.footer}>
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className={styles.footerLink}>Ingresar</Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

---

### Task 6: Payment pages (Success / Failure / Pending)

**Files:**
- Create: `src/styles/payment.module.css`
- Modify: `src/pages/PaymentSuccess.tsx`
- Modify: `src/pages/PaymentFailure.tsx`
- Modify: `src/pages/PaymentPending.tsx`

- [ ] **Step 1: Create `src/styles/payment.module.css`**

```css
.page {
  min-height: 100vh;
  background: var(--bg-base);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.inner {
  text-align: center;
  max-width: 420px;
}

.iconSuccess { color: var(--green-bright); display: block; margin: 0 auto 1.5rem; }
.iconError   { color: var(--red);          display: block; margin: 0 auto 1.5rem; }
.iconPending { color: var(--orange);       display: block; margin: 0 auto 1.5rem; }

.title {
  font-size: 2rem;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 0.75rem;
  line-height: 1.1;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 0.5rem;
}

.note {
  color: var(--text-secondary);
  font-size: 12px;
  margin-bottom: 2rem;
  opacity: 0.7;
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btnPrimary {
  padding: 0.75rem 2rem;
  background: var(--red);
  color: white;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
  border-radius: 2px;
}

.btnPrimary:hover { background: var(--red-dark); }

.btnOutline {
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  border-radius: 2px;
}

.btnOutline:hover { border-color: var(--border-hot); color: var(--text-primary); }
```

- [ ] **Step 2: Rewrite `src/pages/PaymentSuccess.tsx`**

```tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import styles from '../styles/payment.module.css'

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin', { replace: true })
  }, [user, navigate])

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <CheckCircle size={80} className={styles.iconSuccess} />
        <h1 className={styles.title}>¡Pago Aprobado!</h1>
        <p className={styles.subtitle}>Tu membresía fue activada exitosamente.</p>
        <p className={styles.note}>¡A entrenar!</p>
        <div className={styles.actions}>
          <button onClick={() => navigate('/dashboard')} className={styles.btnPrimary}>
            IR AL DASHBOARD
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Rewrite `src/pages/PaymentFailure.tsx`**

```tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { XCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import styles from '../styles/payment.module.css'

export default function PaymentFailure() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin', { replace: true })
  }, [user, navigate])

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <XCircle size={80} className={styles.iconError} />
        <h1 className={styles.title}>Pago Rechazado</h1>
        <p className={styles.subtitle}>Hubo un problema con tu pago.</p>
        <p className={styles.note}>Podés intentar de nuevo con otra tarjeta.</p>
        <div className={styles.actions}>
          <button onClick={() => navigate('/plans')} className={styles.btnPrimary}>
            INTENTAR DE NUEVO
          </button>
          <button onClick={() => navigate('/dashboard')} className={styles.btnOutline}>
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Rewrite `src/pages/PaymentPending.tsx`**

```tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import styles from '../styles/payment.module.css'

export default function PaymentPending() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin', { replace: true })
  }, [user, navigate])

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Clock size={80} className={styles.iconPending} />
        <h1 className={styles.title}>Pago Pendiente</h1>
        <p className={styles.subtitle}>Tu pago está siendo procesado.</p>
        <p className={styles.note}>Te notificaremos cuando se acredite. Puede demorar hasta 2 días hábiles.</p>
        <div className={styles.actions}>
          <button onClick={() => navigate('/dashboard')} className={styles.btnPrimary}>
            IR AL DASHBOARD
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

---

### Task 7: Dashboard

**Files:**
- Create: `src/pages/Dashboard.module.css`
- Modify: `src/pages/Dashboard.tsx`

- [ ] **Step 1: Create `src/pages/Dashboard.module.css`**

```css
.header { margin-bottom: 2rem; }

.title {
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  line-height: 1.1;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 13px;
  margin-top: 4px;
}

.loading { color: var(--text-secondary); font-size: 13px; }

.memberCard {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-left: 4px solid var(--border);
  padding: 1.75rem;
  margin-bottom: 1.5rem;
}

.memberCardActive   { border-left-color: var(--green); }
.memberCardExpiring { border-left-color: var(--yellow); }
.memberCardExpired  { border-left-color: var(--red); }

.cardTop {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.planMeta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0.5rem;
}

.planMetaLabel {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.planName {
  font-size: 2rem;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.75rem;
  line-height: 1;
}

.daysBox {
  text-align: center;
  background: rgba(0,0,0,0.4);
  padding: 1rem 1.5rem;
  border: 1px solid var(--border);
}

.daysNumber {
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1;
  color: var(--green-bright);
}

.daysNumberExpiring { color: var(--yellow); }

.daysLabel {
  font-size: 10px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-top: 4px;
}

.expiryRow {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 12px;
  margin-top: 1rem;
}

.iconActive   { color: var(--green-bright); }
.iconExpired  { color: var(--red); }

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.btnPrimary {
  padding: 0.75rem 1.5rem;
  background: var(--red);
  color: white;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
  border-radius: 2px;
}

.btnPrimary:hover { background: var(--red-dark); }

.btnOutline {
  padding: 0.75rem 1.25rem;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  border-radius: 2px;
}

.btnOutline:hover { border-color: var(--border-hot); color: var(--text-primary); }

.alert {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(212, 160, 23, 0.08);
  border: 1px solid var(--yellow);
  padding: 0.75rem 1rem;
  color: var(--yellow);
  font-size: 13px;
}
```

- [ ] **Step 2: Rewrite `src/pages/Dashboard.tsx`**

```tsx
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import client from '../api/client'
import { Calendar, Dumbbell, AlertCircle } from 'lucide-react'
import styles from './Dashboard.module.css'

interface Membership {
  id: string
  planName?: string
  expiresAt?: string
  status: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: membership, isLoading } = useQuery<Membership>({
    queryKey: ['membership', 'me'],
    queryFn: () => client.get('/memberships/me').then(r => r.data),
  })

  const getDaysLeft = (expiresAt?: string) => {
    if (!expiresAt) return null
    return Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  }

  const daysLeft = getDaysLeft(membership?.expiresAt)
  const isActive = membership?.status === 'active' && daysLeft !== null && daysLeft > 0
  const isExpiring = isActive && daysLeft !== null && daysLeft <= 7

  const cardMod = isActive
    ? (isExpiring ? styles.memberCardExpiring : styles.memberCardActive)
    : styles.memberCardExpired

  return (
    <Layout>
      <div className={styles.header}>
        <h1 className={styles.title}>Hola, {user?.name?.split(' ')[0]}</h1>
        <p className={styles.subtitle}>Panel de tu membresía en SportLife</p>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Cargando membresía...</div>
      ) : (
        <>
          <div className={`${styles.memberCard} ${cardMod}`}>
            <div className={styles.cardTop}>
              <div>
                <div className={styles.planMeta}>
                  <Dumbbell size={18} className={isActive ? styles.iconActive : styles.iconExpired} />
                  <span className={styles.planMetaLabel}>Estado de Membresía</span>
                </div>
                <div className={styles.planName}>{membership?.planName || 'Sin plan'}</div>
                <StatusBadge status={membership?.status || 'none'} expiresAt={membership?.expiresAt} />
              </div>

              {isActive && daysLeft !== null && (
                <div className={styles.daysBox}>
                  <div className={`${styles.daysNumber} ${isExpiring ? styles.daysNumberExpiring : ''}`}>
                    {daysLeft}
                  </div>
                  <div className={styles.daysLabel}>días restantes</div>
                </div>
              )}
            </div>

            {membership?.expiresAt && (
              <div className={styles.expiryRow}>
                <Calendar size={12} />
                Vence el {new Date(membership.expiresAt).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}
          </div>

          <div className={styles.actions}>
            {(!isActive || isExpiring) && (
              <button onClick={() => navigate('/plans')} className={styles.btnPrimary}>
                PAGAR MEMBRESÍA
              </button>
            )}
            <button onClick={() => navigate('/plans')} className={styles.btnOutline}>
              Ver planes
            </button>
          </div>

          {isExpiring && (
            <div className={styles.alert}>
              <AlertCircle size={15} />
              Tu membresía vence en {daysLeft} día{daysLeft !== 1 ? 's' : ''}. ¡Renová ahora para no perder continuidad!
            </div>
          )}
        </>
      )}
    </Layout>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

---

### Task 8: Plans

**Files:**
- Create: `src/pages/Plans.module.css`
- Modify: `src/pages/Plans.tsx`

- [ ] **Step 1: Create `src/pages/Plans.module.css`**

```css
.header { margin-bottom: 2rem; }

.title {
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.subtitle { color: var(--text-secondary); font-size: 13px; margin-top: 4px; }

.error {
  background: rgba(192, 57, 43, 0.1);
  border: 1px solid var(--red);
  color: var(--red);
  padding: 0.75rem 1rem;
  font-size: 13px;
  margin-bottom: 1.5rem;
}

.loading { color: var(--text-secondary); font-size: 13px; }

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 900px;
}

@media (min-width: 640px)  { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }

.card {
  position: relative;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-top: 3px solid var(--border);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
}

.cardPopular {
  border-top-color: var(--orange);
  border-color: var(--orange);
}

.popularBadge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--orange);
  color: white;
  font-size: 10px;
  font-weight: 900;
  padding: 3px 12px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  white-space: nowrap;
}

.planName {
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.5rem;
}

.price {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.pricePopular { color: var(--orange); }

.priceMeta { font-size: 11px; color: var(--text-secondary); margin-bottom: 1.25rem; }

.features { list-style: none; flex: 1; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }

.feature {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}

.featureIcon { color: var(--green-bright); flex-shrink: 0; }

.btn {
  width: 100%;
  padding: 0.75rem;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  border: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  border-radius: 2px;
}

.btn:disabled { opacity: 0.6; cursor: not-allowed; }

.btnFilled { background: var(--red); color: white; }
.btnFilled:hover:not(:disabled) { background: var(--red-dark); }

.btnOutline { background: transparent; color: var(--text-primary); border: 1px solid var(--red); }
.btnOutline:hover:not(:disabled) { background: rgba(192,57,43,0.1); }
```

- [ ] **Step 2: Rewrite `src/pages/Plans.tsx`**

```tsx
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import Layout from '../components/Layout'
import client from '../api/client'
import { Check } from 'lucide-react'
import styles from './Plans.module.css'

interface Plan {
  id: string
  name: string
  price: number
  durationDays: number
  active: boolean
}

export default function Plans() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [error, setError] = useState('')

  const { data: plans = [], isLoading } = useQuery<Plan[]>({
    queryKey: ['plans'],
    queryFn: () => client.get('/plans').then(r => r.data),
  })

  const handleSelectPlan = async (plan: Plan) => {
    setError('')
    setLoadingPlan(plan.id)
    try {
      const res = await client.post('/payments/preference', { planId: plan.id })
      window.location.href = res.data.initPoint
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Error al procesar el pago. Intentá de nuevo.')
      setLoadingPlan(null)
    }
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(price)

  const getPlanFeatures = (days: number) => {
    const base = ['Acceso ilimitado al box', 'Clases WOD diarias', 'Coaching profesional']
    if (days >= 365) return [...base, 'Mayor ahorro', 'Evaluación física bimestral', 'Acceso a eventos exclusivos']
    if (days >= 90)  return [...base, 'Descuento especial', 'Evaluación física mensual']
    return base
  }

  return (
    <Layout>
      <div className={styles.header}>
        <h1 className={styles.title}>Planes de Membresía</h1>
        <p className={styles.subtitle}>Elegí el plan que mejor se adapte a tu entrenamiento</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {isLoading ? (
        <div className={styles.loading}>Cargando planes...</div>
      ) : (
        <div className={styles.grid}>
          {plans.map(plan => {
            const popular = plan.durationDays === 90
            const features = getPlanFeatures(plan.durationDays)
            const pricePerDay = (plan.price / plan.durationDays).toFixed(0)

            return (
              <div key={plan.id} className={`${styles.card} ${popular ? styles.cardPopular : ''}`}>
                {popular && <div className={styles.popularBadge}>MÁS POPULAR</div>}

                <div className={`${styles.price} ${popular ? styles.pricePopular : ''}`}>
                  {formatPrice(plan.price)}
                </div>
                <div className={styles.planName}>{plan.name}</div>
                <div className={styles.priceMeta}>{plan.durationDays} días · ${pricePerDay}/día</div>

                <ul className={styles.features}>
                  {features.map((f, i) => (
                    <li key={i} className={styles.feature}>
                      <Check size={13} className={styles.featureIcon} /> {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={loadingPlan === plan.id}
                  className={`${styles.btn} ${popular ? styles.btnFilled : styles.btnOutline}`}
                >
                  {loadingPlan === plan.id ? 'Procesando...' : 'SELECCIONAR PLAN'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

---

### Task 9: AdminDashboard

**Files:**
- Create: `src/pages/admin/AdminDashboard.module.css`
- Modify: `src/pages/admin/AdminDashboard.tsx`

- [ ] **Step 1: Create `src/pages/admin/AdminDashboard.module.css`**

```css
.header { margin-bottom: 2rem; }

.title {
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.subtitle { color: var(--text-secondary); font-size: 13px; margin-top: 4px; }
.loading  { color: var(--text-secondary); font-size: 13px; }

.statsGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

@media (min-width: 640px)  { .statsGrid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .statsGrid { grid-template-columns: repeat(5, 1fr); } }

.statCard {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-top: 3px solid var(--border);
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.statCardRed    { border-top-color: var(--red); }
.statCardGreen  { border-top-color: var(--green-bright); }
.statCardOrange { border-top-color: var(--orange); }
.statCardYellow { border-top-color: var(--yellow); }
.statCardBlue   { border-top-color: #63B3ED; }

.statLabel {
  font-size: 10px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 0.5rem;
}

.statValue {
  font-size: 2rem;
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1;
}

.iconRed    { color: var(--red); }
.iconGreen  { color: var(--green-bright); }
.iconOrange { color: var(--orange); }
.iconYellow { color: var(--yellow); }
.iconBlue   { color: #63B3ED; }

.panels {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1024px) { .panels { grid-template-columns: repeat(2, 1fr); } }

.panel {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  padding: 1.5rem;
}

.panelTitle {
  font-size: 13px;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.quickLinks { display: flex; flex-direction: column; gap: 0.75rem; }

.quickLink {
  display: block;
  padding: 0.75rem 1rem;
  background: var(--bg-base);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 13px;
  text-decoration: none;
  transition: border-color 0.15s, color 0.15s;
}

.quickLink:hover { border-color: var(--orange); color: var(--text-primary); }

.infoRow {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border);
}

.infoRow:last-child { border-bottom: none; }

.infoLabel { color: var(--text-secondary); }
.statusOk  { color: var(--green-bright); font-size: 12px; }
.statusWarn { color: var(--yellow); font-size: 12px; }
```

- [ ] **Step 2: Rewrite `src/pages/admin/AdminDashboard.tsx`**

```tsx
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import client from '../../api/client'
import { Users, CheckCircle, XCircle, DollarSign, CreditCard } from 'lucide-react'
import styles from './AdminDashboard.module.css'

interface Stats {
  totalMembers: number
  activeMembers: number
  expiredMembers: number
  monthlyRevenue: number
  totalPayments: number
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ['stats'],
    queryFn: () => client.get('/memberships/stats').then(r => r.data),
  })

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(n)

  const statCards = stats ? [
    { label: 'Total Miembros',     value: stats.totalMembers,              Icon: Users,        mod: styles.statCardRed,    iconMod: styles.iconRed },
    { label: 'Membresías Activas', value: stats.activeMembers,             Icon: CheckCircle,  mod: styles.statCardGreen,  iconMod: styles.iconGreen },
    { label: 'Vencidas',           value: stats.expiredMembers,            Icon: XCircle,      mod: styles.statCardOrange, iconMod: styles.iconOrange },
    { label: 'Ingresos del Mes',   value: formatMoney(stats.monthlyRevenue), Icon: DollarSign, mod: styles.statCardYellow, iconMod: styles.iconYellow },
    { label: 'Pagos Aprobados',    value: stats.totalPayments,             Icon: CreditCard,   mod: styles.statCardBlue,   iconMod: styles.iconBlue },
  ] : []

  return (
    <Layout>
      <div className={styles.header}>
        <h1 className={styles.title}>Panel Administrador</h1>
        <p className={styles.subtitle}>Resumen general de SportLife CrossFit</p>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Cargando estadísticas...</div>
      ) : (
        <div className={styles.statsGrid}>
          {statCards.map((card, i) => (
            <div key={i} className={`${styles.statCard} ${card.mod}`}>
              <div>
                <div className={styles.statLabel}>{card.label}</div>
                <div className={styles.statValue}>{card.value}</div>
              </div>
              <card.Icon size={24} className={card.iconMod} />
            </div>
          ))}
        </div>
      )}

      <div className={styles.panels}>
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Accesos Rápidos</h3>
          <div className={styles.quickLinks}>
            <Link to="/admin/users" className={styles.quickLink}>→ Ver todos los miembros</Link>
            <Link to="/admin/plans" className={styles.quickLink}>→ Gestionar planes</Link>
            <Link to="/admin/payments" className={styles.quickLink}>→ Historial de pagos</Link>
            <Link to="/admin/mercadopago" className={styles.quickLink}>→ Configuración MercadoPago</Link>
          </div>
        </div>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Info del Sistema</h3>
          <div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>API Endpoint</span>
              <span className={styles.statusOk}>● Conectado</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>MercadoPago</span>
              <span className={styles.statusWarn}>⚠ Config pendiente</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

---

### Task 10: AdminUsers + AdminPayments (shared table styles)

**Files:**
- Create: `src/styles/table.module.css`
- Modify: `src/pages/admin/AdminUsers.tsx`
- Modify: `src/pages/admin/AdminPayments.tsx`

- [ ] **Step 1: Create `src/styles/table.module.css`**

```css
.pageHeader {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
}

.title {
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.subtitle { color: var(--text-secondary); font-size: 13px; margin-top: 4px; }
.loading  { color: var(--text-secondary); font-size: 13px; }

.tableWrap {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  overflow: hidden;
}

.scrollX { overflow-x: auto; }

.table { width: 100%; border-collapse: collapse; }

.thead { background: var(--bg-elevated); }

.th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  white-space: nowrap;
  border-bottom: 1px solid var(--border);
}

.tr { border-bottom: 1px solid var(--border); }
.tr:last-child { border-bottom: none; }
.tr:hover { background: var(--bg-elevated); }

.tdPrimary {
  padding: 0.875rem 1rem;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.tdSecondary {
  padding: 0.875rem 1rem;
  color: var(--text-secondary);
  font-size: 13px;
  white-space: nowrap;
}

.tdMuted {
  padding: 0.875rem 1rem;
  color: var(--text-secondary);
  font-size: 11px;
  white-space: nowrap;
  opacity: 0.7;
}

.tdMono {
  padding: 0.875rem 1rem;
  color: var(--text-secondary);
  font-size: 11px;
  font-family: monospace;
  white-space: nowrap;
}

.tdAccent {
  padding: 0.875rem 1rem;
  color: var(--orange);
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

.td { padding: 0.875rem 1rem; }

.empty {
  padding: 2.5rem 1rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 13px;
}

.roleBadge {
  display: inline-block;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 1px solid;
  border-radius: 0;
}

.roleAdmin  { color: var(--red);    border-color: var(--red);    background: rgba(192,57,43,0.1); }
.roleMember { color: #63B3ED;       border-color: #63B3ED;       background: rgba(99,179,237,0.1); }

.btnPrimary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.625rem 1.25rem;
  background: var(--red);
  color: white;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
  border-radius: 2px;
}

.btnPrimary:hover { background: var(--red-dark); }
```

- [ ] **Step 2: Rewrite `src/pages/admin/AdminUsers.tsx`**

```tsx
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
```

- [ ] **Step 3: Rewrite `src/pages/admin/AdminPayments.tsx`**

```tsx
import { useQuery } from '@tanstack/react-query'
import Layout from '../../components/Layout'
import StatusBadge from '../../components/StatusBadge'
import client from '../../api/client'
import styles from '../../styles/table.module.css'

interface Payment {
  id: string
  userId: string
  userName: string
  planId: string
  planName: string
  mercadoPagoPaymentId?: string
  status: string
  amount: number
  createdAt: string
  approvedAt?: string
}

export default function AdminPayments() {
  const { data: payments = [], isLoading } = useQuery<Payment[]>({
    queryKey: ['admin-payments'],
    queryFn: () => client.get('/payments').then(r => r.data),
  })

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(n)

  return (
    <Layout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Pagos</h1>
          <p className={styles.subtitle}>Historial completo de pagos</p>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Cargando pagos...</div>
      ) : (
        <div className={styles.tableWrap}>
          <div className={styles.scrollX}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  {['Miembro', 'Plan', 'Monto', 'Estado', 'Fecha', 'MP ID'].map(h => (
                    <th key={h} className={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} className={styles.tr}>
                    <td className={styles.tdPrimary}>{p.userName}</td>
                    <td className={styles.tdSecondary}>{p.planName}</td>
                    <td className={styles.tdAccent}>{formatMoney(p.amount)}</td>
                    <td className={styles.td}><StatusBadge status={p.status} /></td>
                    <td className={styles.tdMuted}>{new Date(p.createdAt).toLocaleDateString('es-AR')}</td>
                    <td className={styles.tdMono}>{p.mercadoPagoPaymentId ? p.mercadoPagoPaymentId.slice(0, 12) + '...' : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {payments.length === 0 && <div className={styles.empty}>No hay pagos registrados</div>}
          </div>
        </div>
      )}
    </Layout>
  )
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

---

### Task 11: AdminPlans

**Files:**
- Create: `src/pages/admin/AdminPlans.module.css`
- Modify: `src/pages/admin/AdminPlans.tsx`

- [ ] **Step 1: Create `src/pages/admin/AdminPlans.module.css`**

```css
.header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
}

.title {
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.subtitle { color: var(--text-secondary); font-size: 13px; margin-top: 4px; }
.loading  { color: var(--text-secondary); font-size: 13px; }

.btnNew {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.625rem 1.25rem;
  background: var(--red);
  color: white;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
  border-radius: 2px;
}

.btnNew:hover { background: var(--red-dark); }

.form {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-left: 4px solid var(--orange);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.formTitle {
  font-size: 13px;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.formGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

@media (min-width: 640px) { .formGrid { grid-template-columns: repeat(3, 1fr); } }

.field { display: flex; flex-direction: column; gap: 0.5rem; }

.label {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: var(--bg-base);
  border: 1px solid var(--border);
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
  border-radius: 2px;
}

.input:focus { border-color: var(--orange); }

.formActions { display: flex; gap: 0.75rem; }

.btnSave {
  padding: 0.625rem 1.25rem;
  background: var(--red);
  color: white;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
  border-radius: 2px;
}

.btnSave:hover { background: var(--red-dark); }

.btnCancel {
  padding: 0.625rem 1rem;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  border-radius: 2px;
}

.btnCancel:hover { border-color: var(--border-hot); color: var(--text-primary); }

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px)  { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }

.card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-top: 3px solid var(--orange);
  padding: 1.25rem;
}

.cardInactive { opacity: 0.5; border-top-color: var(--border); }

.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.planName {
  font-size: 14px;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.cardActions { display: flex; gap: 4px; }

.iconBtn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--text-secondary);
  transition: color 0.15s;
  display: flex;
}

.iconBtn:hover { color: var(--text-primary); }
.iconBtnDanger:hover { color: var(--red); }

.planPrice {
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--orange);
  margin-bottom: 2px;
}

.planDays { font-size: 11px; color: var(--text-secondary); }
.planInactive { font-size: 10px; color: var(--text-secondary); margin-top: 6px; }
```

- [ ] **Step 2: Rewrite `src/pages/admin/AdminPlans.tsx`**

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import Layout from '../../components/Layout'
import client from '../../api/client'
import { Plus, Edit, Trash2 } from 'lucide-react'
import styles from './AdminPlans.module.css'

interface Plan {
  id: string
  name: string
  price: number
  durationDays: number
  active: boolean
}

export default function AdminPlans() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editPlan, setEditPlan] = useState<Plan | null>(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [days, setDays] = useState('')

  const { data: plans = [], isLoading } = useQuery<Plan[]>({
    queryKey: ['admin-plans'],
    queryFn: () => client.get('/plans/all').then(r => r.data),
  })

  const resetForm = () => { setShowForm(false); setEditPlan(null); setName(''); setPrice(''); setDays('') }

  const createMutation = useMutation({
    mutationFn: (data: { name: string; price: number; durationDays: number }) => client.post('/plans', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-plans'] }); resetForm() },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Plan> }) => client.put(`/plans/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-plans'] }); resetForm() },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => client.delete(`/plans/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-plans'] }),
  })

  const openEdit = (plan: Plan) => {
    setEditPlan(plan); setName(plan.name); setPrice(String(plan.price)); setDays(String(plan.durationDays)); setShowForm(true)
  }

  const handleSubmit = () => {
    if (!name || !price || !days) return
    const data = { name, price: Number(price), durationDays: Number(days) }
    if (editPlan) updateMutation.mutate({ id: editPlan.id, data })
    else createMutation.mutate(data)
  }

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(n)

  return (
    <Layout>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Planes</h1>
          <p className={styles.subtitle}>Gestión de planes de membresía</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className={styles.btnNew}>
          <Plus size={15} /> NUEVO PLAN
        </button>
      </div>

      {showForm && (
        <div className={styles.form}>
          <h3 className={styles.formTitle}>{editPlan ? 'Editar Plan' : 'Nuevo Plan'}</h3>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Nombre</label>
              <input value={name} onChange={e => setName(e.target.value)} className={styles.input} placeholder="Plan Mensual" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Precio (ARS)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} className={styles.input} placeholder="15000" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Días</label>
              <input type="number" value={days} onChange={e => setDays(e.target.value)} className={styles.input} placeholder="30" />
            </div>
          </div>
          <div className={styles.formActions}>
            <button onClick={handleSubmit} className={styles.btnSave}>{editPlan ? 'GUARDAR' : 'CREAR'}</button>
            <button onClick={resetForm} className={styles.btnCancel}>Cancelar</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className={styles.loading}>Cargando...</div>
      ) : (
        <div className={styles.grid}>
          {plans.map(plan => (
            <div key={plan.id} className={`${styles.card} ${!plan.active ? styles.cardInactive : ''}`}>
              <div className={styles.cardHeader}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className={styles.cardActions}>
                  <button onClick={() => openEdit(plan)} className={styles.iconBtn}><Edit size={14} /></button>
                  <button onClick={() => deleteMutation.mutate(plan.id)} className={`${styles.iconBtn} ${styles.iconBtnDanger}`}><Trash2 size={14} /></button>
                </div>
              </div>
              <div className={styles.planPrice}>{formatPrice(plan.price)}</div>
              <div className={styles.planDays}>{plan.durationDays} días</div>
              {!plan.active && <div className={styles.planInactive}>● Inactivo</div>}
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

---

### Task 12: AdminMercadoPago

**Files:**
- Create: `src/pages/admin/AdminMercadoPago.module.css`
- Modify: `src/pages/admin/AdminMercadoPago.tsx`

- [ ] **Step 1: Create `src/pages/admin/AdminMercadoPago.module.css`**

```css
.header { margin-bottom: 2rem; }

.title {
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.subtitle { color: var(--text-secondary); font-size: 13px; margin-top: 4px; }
.loading  { color: var(--text-secondary); font-size: 13px; }

.sections { max-width: 720px; display: flex; flex-direction: column; gap: 1.5rem; }

.section {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-left: 4px solid var(--border);
  padding: 1.5rem;
}

.sectionTitle {
  font-size: 13px;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.25rem;
}

.modeRow { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }

.modeBtn {
  padding: 0.5rem 1.25rem;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
  border-radius: 2px;
}

.modeBtnSandbox.active { background: var(--yellow); color: #000; border-color: var(--yellow); }
.modeBtnProd.active    { background: var(--green);  color: #fff; border-color: var(--green); }

.modeNote {
  font-size: 12px;
  margin-top: 0.75rem;
}

.modeNoteSandbox { color: var(--yellow); }
.modeBtnProd     { color: var(--green-bright); }

.fields { display: flex; flex-direction: column; gap: 1.25rem; }

.field { display: flex; flex-direction: column; gap: 0.5rem; }

.label {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.fieldHint { font-size: 11px; color: var(--text-secondary); opacity: 0.7; margin-top: 4px; }

.inputWrap { position: relative; }

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-base);
  border: 1px solid var(--border);
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
  border-radius: 2px;
}

.inputWithBtn { padding-right: 2.5rem; }

.input:focus { border-color: var(--orange); }
.input::placeholder { color: var(--text-secondary); opacity: 0.6; }

.eyeBtn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  transition: color 0.15s;
}

.eyeBtn:hover { color: var(--text-primary); }

.actions { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }

.btnTest {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.625rem 1.25rem;
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  border-radius: 2px;
}

.btnTest:hover:not(:disabled) { border-color: var(--orange); color: var(--text-primary); }
.btnTest:disabled { opacity: 0.6; cursor: not-allowed; }

.btnSave {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.625rem 1.5rem;
  background: var(--red);
  color: white;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
  border-radius: 2px;
}

.btnSave:hover:not(:disabled) { background: var(--red-dark); }
.btnSave:disabled { opacity: 0.6; cursor: not-allowed; }

.alertOk {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.75rem 1rem;
  background: rgba(74,122,58,0.1);
  border: 1px solid var(--green);
  color: var(--green-bright);
  font-size: 13px;
}

.alertErr {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.75rem 1rem;
  background: rgba(192,57,43,0.1);
  border: 1px solid var(--red);
  color: var(--red);
  font-size: 13px;
}

.guide { background: var(--bg-surface); border: 1px solid var(--border); padding: 1.5rem; }

.guideTitle {
  font-size: 13px;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.25rem;
}

.guideSection { margin-bottom: 1.25rem; }

.guideSectionTitle {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.guideOl {
  list-style: decimal;
  list-style-position: inside;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: var(--text-secondary);
  font-size: 13px;
}

.guideOl li span { color: var(--orange); }

.cards {
  background: var(--bg-base);
  border: 1px solid var(--border);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: monospace;
  font-size: 12px;
}

.cardRow { color: var(--text-secondary); }
.cardRow span { color: var(--text-primary); }
.cardApprove { color: var(--green-bright); }
.cardReject  { color: var(--red); }

.guideFooter { font-size: 11px; color: var(--text-secondary); opacity: 0.6; }
```

- [ ] **Step 2: Rewrite `src/pages/admin/AdminMercadoPago.tsx`**

```tsx
import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import client from '../../api/client'
import { Save, Wifi, WifiOff, Eye, EyeOff, RefreshCw } from 'lucide-react'
import styles from './AdminMercadoPago.module.css'

interface MpConfig {
  accessToken: string
  publicKey: string
  webhookSecret: string
  notificationUrl: string
  successUrl: string
  failureUrl: string
  pendingUrl: string
  isTestMode: boolean
  updatedAt: string
}

interface TestResult {
  connected: boolean
  error?: string
}

export default function AdminMercadoPago() {
  const [config, setConfig] = useState<MpConfig>({
    accessToken: '', publicKey: '', webhookSecret: '',
    notificationUrl: '', successUrl: '', failureUrl: '', pendingUrl: '',
    isTestMode: true, updatedAt: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [showToken, setShowToken] = useState(false)
  const [showSecret, setShowSecret] = useState(false)

  useEffect(() => {
    client.get('/configurations/mercadopago')
      .then(r => setConfig(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true); setSaveMsg(null)
    try {
      const res = await client.put('/configurations/mercadopago', config)
      setConfig(res.data)
      setSaveMsg({ ok: true, text: 'Configuración guardada correctamente.' })
    } catch {
      setSaveMsg({ ok: false, text: 'Error al guardar. Verificá los datos.' })
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    setTesting(true); setTestResult(null)
    try {
      const res = await client.post('/configurations/mercadopago/test')
      setTestResult(res.data)
    } catch (err: unknown) {
      const data = (err as { response?: { data?: TestResult } })?.response?.data
      setTestResult(data ?? { connected: false, error: 'Error de conexión' })
    } finally {
      setTesting(false)
    }
  }

  const urlFields = [
    { key: 'notificationUrl', label: 'Notification URL (Webhook)', placeholder: 'https://tmntech.ddns.net/sportlife-api/api/webhooks/mercadopago' },
    { key: 'successUrl',      label: 'Success URL',                placeholder: 'https://tmntech.ddns.net/sportlife/payment/success' },
    { key: 'failureUrl',      label: 'Failure URL',                placeholder: 'https://tmntech.ddns.net/sportlife/payment/failure' },
    { key: 'pendingUrl',      label: 'Pending URL',                placeholder: 'https://tmntech.ddns.net/sportlife/payment/pending' },
  ]

  if (loading) return <Layout><div className={styles.loading}>Cargando configuración...</div></Layout>

  return (
    <Layout>
      <div className={styles.header}>
        <h1 className={styles.title}>MercadoPago</h1>
        <p className={styles.subtitle}>Configuración del sistema de pagos</p>
      </div>

      <div className={styles.sections}>
        {/* Modo */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Modo de Operación</h3>
          <div className={styles.modeRow}>
            <button
              onClick={() => setConfig(c => ({ ...c, isTestMode: true }))}
              className={`${styles.modeBtn} ${styles.modeBtnSandbox} ${config.isTestMode ? 'active' : ''}`}
            >
              Sandbox (pruebas)
            </button>
            <button
              onClick={() => setConfig(c => ({ ...c, isTestMode: false }))}
              className={`${styles.modeBtn} ${styles.modeBtnProd} ${!config.isTestMode ? 'active' : ''}`}
            >
              Producción (real)
            </button>
          </div>
          {config.isTestMode && <p className={`${styles.modeNote} ${styles.modeNoteSandbox}`}>Modo sandbox activo — los pagos son simulados.</p>}
          {!config.isTestMode && <p className={`${styles.modeNote} ${styles.modeBtnProd}`}>Modo producción activo — los pagos son reales.</p>}
        </div>

        {/* Credenciales */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Credenciales</h3>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Access Token</label>
              <div className={styles.inputWrap}>
                <input
                  type={showToken ? 'text' : 'password'}
                  value={config.accessToken}
                  onChange={e => setConfig(c => ({ ...c, accessToken: e.target.value }))}
                  placeholder={config.isTestMode ? 'TEST-xxxx...' : 'APP_USR-xxxx...'}
                  className={`${styles.input} ${styles.inputWithBtn}`}
                />
                <button onClick={() => setShowToken(v => !v)} className={styles.eyeBtn}>
                  {showToken ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p className={styles.fieldHint}>
                {config.isTestMode ? 'Usá el Access Token de SANDBOX (empieza con TEST-)' : 'Usá el Access Token de PRODUCCIÓN (empieza con APP_USR-)'}
              </p>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Public Key</label>
              <input
                type="text"
                value={config.publicKey}
                onChange={e => setConfig(c => ({ ...c, publicKey: e.target.value }))}
                placeholder={config.isTestMode ? 'TEST-xxxx...' : 'APP_USR-xxxx...'}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Webhook Secret</label>
              <div className={styles.inputWrap}>
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={config.webhookSecret}
                  onChange={e => setConfig(c => ({ ...c, webhookSecret: e.target.value }))}
                  placeholder="Secret para validar webhooks"
                  className={`${styles.input} ${styles.inputWithBtn}`}
                />
                <button onClick={() => setShowSecret(v => !v)} className={styles.eyeBtn}>
                  {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* URLs */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>URLs de Redirección</h3>
          <div className={styles.fields}>
            {urlFields.map(({ key, label, placeholder }) => (
              <div key={key} className={styles.field}>
                <label className={styles.label}>{label}</label>
                <input
                  type="url"
                  value={(config as unknown as Record<string, string>)[key]}
                  onChange={e => setConfig(c => ({ ...c, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className={styles.input}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button onClick={handleTest} disabled={testing} className={styles.btnTest}>
            {testing ? <RefreshCw size={15} className="animate-spin" /> : <Wifi size={15} />}
            {testing ? 'Probando...' : 'Probar conexión'}
          </button>
          <button onClick={handleSave} disabled={saving} className={styles.btnSave}>
            <Save size={15} />
            {saving ? 'Guardando...' : 'Guardar configuración'}
          </button>
        </div>

        {testResult && (
          <div className={testResult.connected ? styles.alertOk : styles.alertErr}>
            {testResult.connected
              ? <><Wifi size={15} /> Conexión exitosa con MercadoPago</>
              : <><WifiOff size={15} /> Error: {testResult.error}</>
            }
          </div>
        )}

        {saveMsg && (
          <div className={saveMsg.ok ? styles.alertOk : styles.alertErr}>
            {saveMsg.text}
          </div>
        )}

        {/* Guía */}
        <div className={styles.guide}>
          <h3 className={styles.guideTitle}>Guía Rápida</h3>
          <div className={styles.guideSection}>
            <p className={styles.guideSectionTitle}>Para recibir pagos reales en tu cuenta:</p>
            <ol className={styles.guideOl}>
              <li>Entrá a <span>developers.mercadopago.com</span></li>
              <li>Creá una aplicación</li>
              <li>Copiá el Access Token de PRODUCCIÓN (empieza con APP_USR-)</li>
              <li>Pegalo arriba, activá modo Producción y guardá</li>
              <li>Asegurate que la Notification URL sea accesible desde internet</li>
            </ol>
          </div>

          <div className={styles.guideSection}>
            <p className={styles.guideSectionTitle}>Tarjetas de prueba (modo Sandbox):</p>
            <div className={styles.cards}>
              <div className={styles.cardRow}>Visa: <span>4509 9535 6623 3704</span> CVV: <span>123</span> Venc: <span>11/25</span></div>
              <div className={styles.cardRow}>Mastercard: <span>5031 7557 3453 0604</span> CVV: <span>123</span> Venc: <span>11/25</span></div>
              <div>Titular: <span className={styles.cardApprove}>APRO</span> (aprobar) / <span className={styles.cardReject}>OTHE</span> (rechazar)</div>
            </div>
          </div>

          {config.updatedAt && (
            <p className={styles.guideFooter}>
              Última actualización: {new Date(config.updatedAt).toLocaleString('es-AR')}
            </p>
          )}
        </div>
      </div>
    </Layout>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

---

### Task 13: Final build verification

**Files:** none

- [ ] **Step 1: Full production build**

```bash
npm run build
```
Expected: `✓ built in X.XXs` — zero TypeScript errors, zero warnings about missing modules.

- [ ] **Step 2: Start dev server and smoke-test**

```bash
npm run dev
```

Open `http://localhost:5173/sportlife/` and verify:
- Login page: dark olive card, orange left border, red SPORTLIFE title
- Sidebar: olive background, orange active link border
- Dashboard: military card with left border color matching membership status
- Plans: cards with orange top border, popular card highlighted
- Admin tables: military headers uppercase, defined borders
- AdminMercadoPago: all fields, test + save buttons functional

- [ ] **Step 3: Commit**

```bash
git add src/ docs/
git commit -m "feat: CSS Modules + Tactical Military design system"
```
