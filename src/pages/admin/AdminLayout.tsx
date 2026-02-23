import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { FileText, PawPrint, Calendar, Menu, Shield, LogOut, ChevronRight } from 'lucide-react'

const navItems = [
  { label: 'Raportet',   path: '/admin/reports',  icon: FileText  },
  { label: 'Kafshët',    path: '/admin/animals',  icon: PawPrint  },
  { label: 'Takimet',    path: '/admin/meetings', icon: Calendar  },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0f172a' }}>

      {/* Sidebar */}
      <>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={`
          fixed top-0 left-0 h-full w-64 z-50
          flex flex-col
          transition-transform duration-300
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `} style={{ backgroundColor: '#0f172a', borderRight: '1px solid #1e293b' }}>

          {/* Logo */}
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

          {/* Nav */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-widest px-3 mb-3">
              Menaxhim
            </p>
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

          {/* Footer */}
          <div className="px-3 py-4 border-t" style={{ borderColor: '#1e293b' }}>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-white hover:bg-white/5 transition-all w-full cursor-pointer"
            >
              <LogOut size={16} />
              Kthehu në faqe
            </button>
          </div>
        </aside>
      </>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
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

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8" style={{ backgroundColor: '#0f172a' }}>
          <Outlet />
        </main>

      </div>
    </div>
  )
}