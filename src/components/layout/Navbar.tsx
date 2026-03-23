import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, Shield, BookOpen, Users, Home, Menu, X, HandCoins } from 'lucide-react'
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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // FIX 3: added '/track' so navbar is transparent on that page too
  const isHeroPage = [
    '/', '/adopto', '/raporto', '/edukim',
    '/kontakt', '/donacion', '/track',
  ].includes(location.pathname)

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
        backgroundColor: scrolled
          ? 'rgba(255,255,255,0.96)'
          : isHeroPage
            ? 'rgba(10,8,5,0.25)'
            : 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid #e6ddd3' : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.35s ease',
      }}>
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={bashkiaLogo} alt="Bashkia Tiranë" className="h-9 w-auto" />
            <div className="flex flex-col leading-tight">
              <span className="font-black text-base tracking-tight transition-colors"
                style={{ color: scrolled || !isHeroPage ? '#1c1410' : '#ffffff' }}>
                Më Adopto
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest transition-colors"
                style={{ color: scrolled || !isHeroPage ? '#9b8c7e' : 'rgba(255,255,255,0.55)' }}>
                Bashkia Tiranë
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 rounded-full px-2 py-1.5 transition-colors"
            style={{
              backgroundColor: scrolled || !isHeroPage ? '#f7f4ef' : 'rgba(255,255,255,0.12)',
              border: scrolled || !isHeroPage ? '1px solid #e6ddd3' : '1px solid rgba(255,255,255,0.2)',
            }}>
            {navItems.map(({ label, path, icon: Icon }) => {
              const isActive = location.pathname === path
              const baseText = scrolled || !isHeroPage ? '#5c4f42' : 'rgba(255,255,255,0.75)'
              const activeStyle = {
                backgroundColor: '#ffffff',
                color: '#1c1410',
                boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
              }
              const inactiveStyle = { color: isActive ? '#1c1410' : baseText }
              return (
                <Link key={path} to={path}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 hover:bg-white/80"
                  style={isActive ? activeStyle : inactiveStyle}>
                  <Icon size={13} />
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop donate button */}
          <Link to="/donacion"
            className="hidden md:flex items-center gap-1.5 text-white text-xs font-bold px-4 py-2 rounded-full transition-all hover:brightness-110"
            style={{ backgroundColor: '#dc2626', boxShadow: '0 2px 10px rgba(220,38,38,0.35)' }}>
            <HandCoins size={13} /> Dhuro
          </Link>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(o => !o)}
            className="md:hidden p-2 rounded-xl transition-colors"
            style={{ color: scrolled || !isHeroPage ? '#1c1410' : '#ffffff' }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className="md:hidden fixed inset-0"
        style={{
          zIndex: 9998,
          backgroundColor: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(2px)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
        onClick={() => setMenuOpen(false)}
      />

      {/* Drawer panel */}
      <div
        className="md:hidden fixed top-0 right-0 h-full"
        style={{
          zIndex: 9999,
          width: '72vw',
          maxWidth: '300px',
          backgroundColor: '#ffffff',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid #f3f4f6' }}>
          <div className="flex items-center gap-2">
            <img src={bashkiaLogo} alt="Bashkia Tiranë" className="h-7 w-auto" />
            <span className="font-black text-sm" style={{ color: '#1c1410' }}>Më Adopto</span>
          </div>
          <button onClick={() => setMenuOpen(false)}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: '#9b8c7e', backgroundColor: '#f7f4ef' }}>
            <X size={16} />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex flex-col gap-1 px-4 py-4 flex-1 overflow-y-auto">
          {navItems.map(({ label, path, icon: Icon }) => {
            const isActive = location.pathname === path
            return (
              <Link key={path} to={path}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  backgroundColor: isActive ? '#fef2f2' : 'transparent',
                  color: isActive ? '#dc2626' : '#1c1410',
                }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: isActive ? '#fecaca' : '#f7f4ef' }}>
                  <Icon size={15} style={{ color: isActive ? '#dc2626' : '#9b8c7e' }} />
                </div>
                {label}
              </Link>
            )
          })}
        </div>

        {/* FIX 1: "Donacio" → "Dhuro" */}
        <div className="px-4 pb-8 pt-3" style={{ borderTop: '1px solid #f3f4f6' }}>
          <Link to="/donacion"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#dc2626', boxShadow: '0 4px 14px rgba(220,38,38,0.35)' }}>
            <HandCoins size={16} /> Dhuro
          </Link>
        </div>
      </div>
    </>
  )
}