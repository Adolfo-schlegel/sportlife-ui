import { useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar drawer */}
      <div
        className={`fixed top-0 left-0 h-full z-30 transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar onClose={() => setOpen(false)} />
      </div>

      {/* Page content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-4 px-4 py-3 bg-surface border-b border-border-dark sticky top-0 z-10">
          <button
            onClick={() => setOpen(true)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>
          <span className="text-white font-black tracking-widest text-lg">SPORTLIFE</span>
        </div>

        <main className="flex-1 p-4 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
