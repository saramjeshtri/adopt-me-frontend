import { useState } from 'react'
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

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <img src={bashkiaLogo} alt="Bashkia Tiranës" className="h-8 md:h-10 w-auto" />
            <div className="flex flex-col leading-tight">
              <span className="text-base md:text-xl font-bold text-red-600">Më Adopto 🐾</span>
              <span className="text-xs text-gray-400">Bashkia Tiranë</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-100 rounded-full px-2 py-2">
            {navItems.map(({ label, path, icon: Icon }) => {
              const isActive = location.pathname === path
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${isActive
                      ? 'bg-red-600 text-white shadow'
                      : 'text-gray-600 hover:bg-white hover:shadow-sm'
                    }`}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen
              ? <X size={22} className="text-gray-700" />
              : <Menu size={22} className="text-gray-700" />
            }
          </button>

        </div>
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile side drawer */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-2xl transform transition-transform duration-300 md:hidden
        ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <img src={bashkiaLogo} alt="Bashkia Tiranë" className="h-8 w-auto" />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-red-600 text-sm">Më Adopto 🐾</span>
              <span className="text-xs text-gray-400">Bashkia Tiranë</span>
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-4 py-6">
          {navItems.map(({ label, path, icon: Icon }) => {
            const isActive = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-red-600'
                  }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}