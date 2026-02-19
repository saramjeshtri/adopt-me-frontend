import { Link } from 'react-router-dom'
import { Heart, Shield, BookOpen, Users, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Left — Logo + description */}
        <div>
          <p className="text-2xl font-bold text-white">Më Adopto 🐾</p>
          <p className="text-sm text-gray-400 mt-1">Bashkia e Tiranës</p>
          <p className="text-sm text-gray-400 mt-4 leading-relaxed">
            Platforma zyrtare e Bashkisë së Tiranës për mbrojtjen dhe
            adoptimin e kafshëve.
          </p>
        </div>

        {/* Middle — Links */}
        <div>
          <p className="text-white font-semibold mb-4">Lidhje të shpejta</p>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/"        className="flex items-center gap-2 hover:text-white transition-colors"><Heart size={14}    /> Kryesore</Link>
            <Link to="/adopto"  className="flex items-center gap-2 hover:text-white transition-colors"><Heart size={14}    /> Adopto</Link>
            <Link to="/raporto" className="flex items-center gap-2 hover:text-white transition-colors"><Shield size={14}   /> Raporto</Link>
            <Link to="/edukim"  className="flex items-center gap-2 hover:text-white transition-colors"><BookOpen size={14} /> Edukim</Link>
            <Link to="/kontakt" className="flex items-center gap-2 hover:text-white transition-colors"><Users size={14}    /> Kontakt</Link>
          </div>
        </div>

        {/* Right — Contact */}
        <div>
          <p className="text-white font-semibold mb-4">Kontakt</p>
          <div className="flex flex-col gap-3 text-sm">
            <p className="flex items-center gap-2"><Phone size={14} /> +355 4 222 2222</p>
            <p className="flex items-center gap-2"><Mail size={14}  /> kafshë@tirana.al</p>
            <p className="flex items-center gap-2"><MapPin size={14}/> Sheshi "Skënderbej", Tiranë</p>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Bashkia e Tiranës. Të gjitha të drejtat e rezervuara.
      </div>
    </footer>
  )
}