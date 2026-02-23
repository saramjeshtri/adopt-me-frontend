import { Link } from 'react-router-dom'
import { Heart, Shield, BookOpen, Users, Phone, Mail, MapPin } from 'lucide-react'
import bashkiaLogo from '../../assets/images/logoja.png'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#111827', width: '100%', display: 'block', margin: 0, padding: 0 }}>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Left */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img src={bashkiaLogo} alt="Bashkia Tiranë" className="h-10 w-auto" />
            <div>
              <p className="text-xl font-bold text-white">Më Adopto 🐾</p>
              <p className="text-xs text-gray-400">Bashkia Tiranë</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed">
            Platforma zyrtare e Bashkisë së Tiranës për mbrojtjen dhe
            adoptimin e kafshëve.
          </p>
        </div>

        {/* Middle */}
        <div>
          <p className="text-white font-semibold mb-4">Lidhje të shpejta</p>
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <Link to="/"        className="flex items-center gap-2 hover:text-white transition-colors"><Heart size={14}    /> Kryesore</Link>
            <Link to="/adopto"  className="flex items-center gap-2 hover:text-white transition-colors"><Heart size={14}    /> Adopto</Link>
            <Link to="/raporto" className="flex items-center gap-2 hover:text-white transition-colors"><Shield size={14}   /> Raporto</Link>
            <Link to="/edukim"  className="flex items-center gap-2 hover:text-white transition-colors"><BookOpen size={14} /> Edukim</Link>
            <Link to="/kontakt" className="flex items-center gap-2 hover:text-white transition-colors"><Users size={14}    /> Kontakt</Link>
          </div>
        </div>

        {/* Right */}
        <div>
          <p className="text-white font-semibold mb-4">Kontakt</p>
          <div className="flex flex-col gap-3 text-sm text-gray-400">
            <p className="flex items-center gap-2"><Phone size={14} /> +355 4 222 2222</p>
            <p className="flex items-center gap-2"><Mail size={14}  /> kafshë@tirana.al</p>
            <p className="flex items-center gap-2"><MapPin size={14}/> Sheshi "Skënderbej", Tiranë</p>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid #1f2937', backgroundColor: '#111827', width: '100%' }}>
        <p className="text-center text-xs text-gray-500 py-4">
          © {new Date().getFullYear()} Bashkia e Tiranës. Të gjitha të drejtat e rezervuara.
        </p>
      </div>

    </footer>
  )
}