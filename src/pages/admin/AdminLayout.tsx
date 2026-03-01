import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { FileText, PawPrint, Calendar, Menu, Shield, LogOut, ChevronRight, Eye, EyeOff, AlertCircle, Users, Heart } from 'lucide-react'

const navItems = [
  { label: 'Raportet', path: '/admin/reports',   icon: FileText },
  { label: 'Kafshët',  path: '/admin/animals',   icon: PawPrint },
  { label: 'Takimet',  path: '/admin/meetings',  icon: Calendar },
  { label: 'Evente',   path: '/admin/events',    icon: Users    },
  { label: 'Dhurimi',  path: '/admin/surrender', icon: Heart    },
]

const SESSION_KEY = 'meadopto_admin_key'

// ─── Password Gate ─────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [key, setKey]         = useState('')
  const [show, setShow]       = useState(false)
  const [error, setError]     = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!key.trim()) return
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/reports`,
        { headers: { 'X-API-Key': key } }
      )
      if (res.ok) {
        sessionStorage.setItem(SESSION_KEY, key)
        onUnlock()
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0f172a' }}>
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-red-900/50">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Paneli i Administratorit</h1>
          <p className="text-gray-500 text-sm mt-1">Më Adopto · Bashkia Tiranë</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border p-6" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
          <p className="text-sm text-gray-400 mb-5">
            Shkruani çelësin e administratorit për të hyrë në panel.
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-red-900/30 border border-red-900/50 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
              <AlertCircle size={15} className="shrink-0" />
              Çelësi i gabuar. Provoni përsëri.
            </div>
          )}

          <div className="relative mb-4">
            <input
              type={show ? 'text' : 'password'}
              value={key}
              onChange={e => { setKey(e.target.value); setError(false) }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Çelësi sekret..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShow(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer transition-colors"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !key.trim()}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Duke verifikuar...</>
              : <><Shield size={15} /> Hyr në panel</>
            }
          </button>
        </div>

        <p className="text-center text-xs text-gray-700 mt-6">
          Ky panel është vetëm për stafin e Bashkisë së Tiranës.
        </p>
      </div>
    </div>
  )
}

// ─── Admin Shell ───────────────────────────────────────────────────────────
export default function AdminLayout() {
  const [unlocked, setUnlocked] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY)
    if (stored) setUnlocked(true)
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setUnlocked(false)
  }

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0f172a' }}>

      {/* Sidebar */}
      <>
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`
          fixed top-0 left-0 h-full w-64 z-50 flex flex-col
          transition-transform duration-300
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `} style={{ backgroundColor: '#0f172a', borderRight: '1px solid #1e293b' }}>

          <div className="px-6 py-6 border-b" style={{ borderColor: '#1e293b' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/50">
                <Shield size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Më Adopto</p>
                <p className="text-gray-500 text-xs">Paneli i Administratorit</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-1">
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-widest px-3 mb-3">Menaxhim</p>
            {navItems.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                  ${isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon size={16} />
                      {label}
                    </div>
                    <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`} />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="px-3 py-4 space-y-1 border-t" style={{ borderColor: '#1e293b' }}>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-white hover:bg-white/5 transition-all w-full cursor-pointer"
            >
              <LogOut size={16} />
              Kthehu në faqe
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:text-red-400 hover:bg-red-900/20 transition-all w-full cursor-pointer"
            >
              <Shield size={16} />
              Dil nga paneli
            </button>
          </div>
        </aside>
      </>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 py-4 border-b" style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <p className="text-white font-bold text-sm">Admin Panel</p>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
          >
            <Menu size={20} />
          </button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8" style={{ backgroundColor: '#0f172a' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}