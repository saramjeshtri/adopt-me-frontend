import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Shield, BookOpen, Users } from 'lucide-react'
import { getAnimalStats } from '../../api/client'
import type { AdoptionStats } from '../../types'
import heroBg from '../../assets/images/selected.jpeg'

export default function HomePage() {
  const [stats, setStats] = useState<AdoptionStats | null>(null)

  useEffect(() => {
    getAnimalStats()
      .then(setStats)
      .catch(() => {})
  }, [])

  return (
    <div style={{ backgroundColor: '#fdf6f0' }}>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gray-900/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-gray-900/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/25 via-transparent to-gray-900/25" />

        <div className="relative z-10 text-center px-4 md:px-6 max-w-3xl mx-auto w-full">

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-3 md:mb-4 leading-tight">
            Më Adopto{' '}
            <span className="inline-block drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
              🐾
            </span>
          </h1>

          <h2 className="text-base sm:text-lg md:text-2xl text-red-300 font-medium mb-4 md:mb-6">
            Gjej shokun tënd të ri
          </h2>

          <p className="text-gray-200 mb-6 md:mb-10 leading-relaxed text-sm sm:text-base md:text-lg max-w-xl mx-auto">
            Platforma zyrtare e Bashkisë së Tiranës për mbrojtjen dhe
            adoptimin e kafshëve. Jep një jetë më të mirë kafshëve
            që kanë nevojë për dashuri.
          </p>

          <div className="flex gap-3 md:gap-4 flex-wrap justify-center">
            <Link
              to="/adopto"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 md:px-10 py-3 md:py-4 rounded-full font-semibold transition-all shadow-xl shadow-red-900/40 text-sm"
            >
              <Heart size={16} /> Adopto një kafshë
            </Link>
            <Link
              to="/raporto"
              className="flex items-center gap-2 border-2 border-white/70 text-white hover:bg-white hover:text-gray-900 px-6 md:px-10 py-3 md:py-4 rounded-full font-semibold transition-all text-sm backdrop-blur-sm"
            >
              <Shield size={16} /> Raporto keqtrajtim
            </Link>
          </div>

        </div>
      </section>

      {/* STATS */}
      <section className="py-12 md:py-16" style={{ backgroundColor: '#fdf6f0' }}>
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 md:mb-12">Ndikimi Ynë</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <Stat number={stats?.total_rescued}        label="Kafshë të shpëtuara"    color="text-red-600"  />
            <Stat number={stats?.currently_available}  label="Disponueshme tani"      color="text-blue-700" />
            <Stat number={stats?.meetings_scheduled}   label="Takime të planifikuara" color="text-red-600"  />
            <Stat number={stats?.successfully_adopted} label="Kafshë të adoptuara"    color="text-blue-700" />
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-12 md:py-16" style={{ backgroundColor: '#faf2ec' }}>
        <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Misioni Ynë</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-8 md:mb-12 text-sm md:text-base">
            Të krijojmë një komunitet ku çdo kafshë ka mundësinë për një jetë
            të lumtur dhe të sigurt.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <MissionCard
              icon={<Heart size={24} className="text-red-600" />}
              title="Adoptime të Përgjegjshme"
              text="Ndihmojmë në gjetjen e familjeve të përshtatshme për kafshët që kanë nevojë për një shtëpi."
              delay="0ms"
            />
            <MissionCard
              icon={<Shield size={24} className="text-blue-700" />}
              title="Mbrojtje dhe Siguri"
              text="Luftojmë keqtrajtimin dhe sigurojmë që çdo kafshë të trajtohet me dinjitet dhe respekt."
              delay="150ms"
            />
            <MissionCard
              icon={<BookOpen size={24} className="text-red-600" />}
              title="Edukim dhe Ndërgjegjësim"
              text="Ofrojmë informacion dhe këshilla për kujdesin e duhur ndaj kafshëve."
              delay="300ms"
            />
          </div>
        </div>
      </section>

      {/* HOW TO HELP */}
      <section className="py-12 md:py-16" style={{ backgroundColor: '#fdf6f0' }}>
        <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Si Mund të Ndihmosh?</h2>
          <p className="text-gray-500 mb-8 md:mb-12 text-sm md:text-base">
            Ka shumë mënyra për të kontribuar në mbrojtjen e kafshëve në Tiranë
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <HelpCard
              icon={<Heart size={20} className="text-red-600" />}
              title="Adopto"
              text="Gjej shokun tënd të ri"
              to="/adopto"
            />
            <HelpCard
              icon={<Shield size={20} className="text-blue-700" />}
              title="Raporto"
              text="Njofto keqtrajtimin"
              to="/raporto"
            />
            <HelpCard
              icon={<BookOpen size={20} className="text-red-600" />}
              title="Mëso"
              text="Materiale edukative"
              to="/edukim"
            />
            <HelpCard
              icon={<Users size={20} className="text-blue-700" />}
              title="Kontakt"
              text="Na kontaktoni"
              to="/kontakt"
            />
          </div>
        </div>
      </section>

    </div>
  )
}

function Stat({ number, label, color }: {
  number?: number
  label: string
  color: string
}) {
  return (
    <div>
      <p className={`text-3xl md:text-5xl font-bold ${color}`}>
        {number !== undefined && number !== null ? number : '—'}
      </p>
      <p className="text-gray-500 text-xs md:text-sm mt-2">{label}</p>
    </div>
  )
}

function MissionCard({ icon, title, text, delay }: {
  icon: React.ReactNode
  title: string
  text: string
  delay: string
}) {
  return (
    <div
      className="bg-white/80 rounded-2xl p-6 md:p-8 shadow-sm border border-orange-50 text-center h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:bg-white hover:border-red-100 group"
      style={{ animationDelay: delay }}
    >
      <div className="flex justify-center mb-3 md:mb-4">
        <div className="bg-orange-50/50 p-3 md:p-4 rounded-full transition-all duration-300 group-hover:bg-red-50 group-hover:scale-110">
          {icon}
        </div>
      </div>
      <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base group-hover:text-red-600 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{text}</p>
    </div>
  )
}

function HelpCard({ icon, title, text, to }: {
  icon: React.ReactNode
  title: string
  text: string
  to: string
}) {
  return (
    <Link
      to={to}
      className="bg-white/60 hover:bg-white hover:shadow-md rounded-2xl p-4 md:p-6 text-center transition-all duration-300 border border-orange-50 hover:border-orange-100 hover:-translate-y-1 block cursor-pointer group"
    >
      <div className="flex justify-center mb-2 md:mb-3">
        <div className="bg-white p-2 md:p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
      <h3 className="font-bold text-gray-900 text-xs md:text-sm mb-1">{title}</h3>
      <p className="text-gray-400 text-xs hidden sm:block">{text}</p>
    </Link>
  )
}