import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, Shield, BookOpen, Users, Home, Menu, X } from 'lucide-react'
import bashkiaLogo from '../../assets/images/logoja.png'

const navItems = [
  { label: 'Kryesore', path: '/',        icon: Home     },
  { label: 'Adopto',   path: '/adopto',  icon: Heart    },
  { label: 'Raporto',  path: '/raporto', icon: Shield   },
  { label: 'Edukim',   path: '/edukim',  icon: BookOpen },
  { label: 'Kontakt',  path: '/kontakt', icon: Users    },
]

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const transparent = !scrolled

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
        backgroundColor: transparent ? 'rgba(10,8,5,0.25)' : 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: transparent ? '1px solid transparent' : '1px solid #e5e7eb',
        boxShadow: transparent ? 'none' : '0 1px 12px rgba(0,0,0,0.05)',
        transition: 'all 0.35s ease',
      }}>
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={bashkiaLogo} alt="Bashkia Tiranë" className="h-9 w-auto" />
            <div className="flex flex-col leading-tight">
              <span className="font-black text-base tracking-tight transition-colors"
                style={{ color: transparent ? '#ffffff' : '#111827' }}>
                Më Adopto
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest transition-colors"
                style={{ color: transparent ? 'rgba(255,255,255,0.55)' : '#9ca3af' }}>
                Bashkia Tiranë
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ label, path, icon: Icon }) => {
              const isActive = location.pathname === path
              return (
                <Link key={path} to={path}
                  className="relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 group"
                  style={isActive
                    ? { color: '#e02424', backgroundColor: '#fef2f2' }
                    : { color: transparent ? 'rgba(255,255,255,0.85)' : '#6b7280' }
                  }>
                  <Icon size={13} />
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(o => !o)}
            className="md:hidden p-2 rounded-xl transition-colors"
            style={{ color: transparent ? '#ffffff' : '#111827' }}>
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}

      {/* Backdrop */}
      <div
        className="md:hidden fixed inset-0"
        style={{
          zIndex: 99998,
          backgroundColor: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(2px)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
        onClick={() => setMenuOpen(false)}
      />

      {/* Drawer panel — slides from left */}
      <div
        className="md:hidden fixed top-0 left-0 h-full flex flex-col"
        style={{
          zIndex: 99999,
          width: '72vw',
          maxWidth: 300,
          backgroundColor: '#ffffff',
          boxShadow: '4px 0 40px rgba(0,0,0,0.15)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #f3f4f6' }}>
          <div className="flex items-center gap-2.5">
            <img src={bashkiaLogo} alt="Bashkia Tiranë" className="h-8 w-auto" />
            <div className="flex flex-col leading-tight">
              <span className="font-black text-sm" style={{ color: '#111827' }}>Më Adopto</span>
              <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: '#9ca3af' }}>Bashkia Tiranë</span>
            </div>
          </div>
          <button onClick={() => setMenuOpen(false)}
            className="p-2 rounded-xl transition-colors hover:bg-gray-100"
            style={{ color: '#6b7280' }}>
            <X size={18} />
          </button>
        </div>

        {/* Nav links with staggered animation */}
        <nav className="flex-1 px-4 py-5 flex flex-col gap-1 overflow-y-auto">
          {navItems.map(({ label, path, icon: Icon }, i) => {
            const isActive = location.pathname === path
            return (
              <Link key={path} to={path}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all"
                style={{
                  backgroundColor: isActive ? '#fef2f2' : 'transparent',
                  color: isActive ? '#e02424' : '#374151',
                  transform: menuOpen ? 'translateX(0)' : 'translateX(-20px)',
                  opacity: menuOpen ? 1 : 0,
                  transition: `background-color 0.15s, color 0.15s, transform 0.4s ease ${i * 55 + 100}ms, opacity 0.4s ease ${i * 55 + 100}ms`,
                }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: isActive ? '#fee2e2' : '#f9fafb', color: isActive ? '#e02424' : '#9ca3af' }}>
                  <Icon size={16} />
                </div>
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-5" style={{ borderTop: '1px solid #f3f4f6' }}>
          <p className="text-xs font-semibold" style={{ color: '#6b7280' }}>📞 0800 0888</p>
          <p className="text-[11px] mt-1" style={{ color: '#d1d5db' }}>Bashkia e Tiranës © 2026</p>
        </div>
      </div>
    </>
  )
}