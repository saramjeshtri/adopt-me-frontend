import { Link, useLocation } from 'react-router-dom'
import { Heart, Shield, BookOpen, Users, Home } from 'lucide-react'
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

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3">
          <img src={bashkiaLogo} alt="Bashkia Tiranës" className="h-10 w-auto" />
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-red-600">Më Adopto 🐾</span>
            <span className="text-xs text-gray-400">Bashkia e Tiranës</span>
          </div>
        </Link>

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

      </div>
    </header>
  )
}