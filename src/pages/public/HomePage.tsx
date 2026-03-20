import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Shield, BookOpen, Phone, PawPrint, AlertTriangle, GraduationCap, HandHeart, ArrowRight, Heart, Sparkles } from 'lucide-react'
import { getAnimalStats } from '../../api/client'
import type { AdoptionStats } from '../../types'
import heroBg from '../../assets/images/selected.jpeg'

function useInView() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.06 })
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  return { ref, visible }
}

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(26px)',
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
    }}>{children}</div>
  )
}

export default function HomePage() {
  const [stats, setStats] = useState<AdoptionStats | null>(null)
  useEffect(() => { getAnimalStats().then(setStats).catch(() => {}) }, [])

  return (
    <div style={{ backgroundColor: '#f5f0eb' }}>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url(${heroBg})`, filter: 'brightness(0.45)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.2) 50%, rgba(245,240,235,1) 100%)' }} />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full pt-24 pb-32">
          <FadeUp delay={100}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.0] tracking-tight mb-6" style={{ textShadow: '0 2px 30px rgba(0,0,0,0.3)' }}>
              Një adoptim,<br />
              <span style={{ color: '#fda4af' }}>një jetë e shpëtuar.</span>
            </h1>
          </FadeUp>
          <FadeUp delay={200}>
            <p className="text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Platforma zyrtare e Bashkisë së Tiranës për mbrojtjen dhe adoptimin e kafshëve.
            </p>
          </FadeUp>
          <FadeUp delay={300}>
            <div className="flex gap-3 flex-wrap justify-center">
              <Link to="/adopto"
                className="group flex items-center gap-2 text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-[1.03]"
                style={{ backgroundColor: '#e02424', boxShadow: '0 8px 30px rgba(224,36,36,0.5)' }}>
                <Heart size={16} fill="white" /> Adopto tani
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/raporto"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:bg-white/20"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#ffffff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
                <Shield size={16} /> Raporto keqtrajtim
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* STATS */}
      <FadeUp>
        <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-10 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: stats?.total_rescued,        label: 'Kafshë të shpëtuara',    color: '#e02424', bg: '#fef2f2' },
              { value: stats?.currently_available,  label: 'Disponueshme tani',      color: '#059669', bg: '#f0fdf4' },
              { value: stats?.meetings_scheduled,   label: 'Takime të planifikuara', color: '#2563eb', bg: '#eff6ff' },
              { value: stats?.successfully_adopted, label: 'Kafshë të adoptuara',    color: '#7c3aed', bg: '#f5f3ff' },
            ].map(({ value, label, color, bg }) => (
              <div key={label} className="rounded-2xl p-5 text-center" style={{ backgroundColor: bg, border: '1px solid rgba(0,0,0,0.05)' }}>
                <p className="text-4xl md:text-5xl font-black mb-1" style={{ color }}>
                  {value !== undefined && value !== null ? value : '—'}
                </p>
                <p className="text-xs font-medium mt-1" style={{ color: '#6b7280' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* MISSION */}
      <section className="py-24 px-6 mt-8" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5" style={{ backgroundColor: '#fef2f2', color: '#e02424' }}>
                <Sparkles size={11} /> Misioni Ynë
              </div>
              <h2 className="text-3xl md:text-5xl font-black leading-tight" style={{ color: '#111827' }}>
                Çdo kafshë meriton<br />
                <span style={{ color: '#9ca3af' }}>një jetë të lumtur.</span>
              </h2>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: <HandHeart size={22} />, title: 'Adoptime të Përgjegjshme', text: 'Ndihmojmë në gjetjen e familjeve të përshtatshme për kafshët që kanë nevojë për një shtëpi.', iconBg: '#fef2f2', iconColor: '#e02424', borderTop: '#e02424', delay: 0 },
              { icon: <Shield size={22} />,    title: 'Mbrojtje dhe Siguri',      text: 'Luftojmë keqtrajtimin dhe sigurojmë që çdo kafshë të trajtohet me dinjitet dhe respekt.',       iconBg: '#eff6ff', iconColor: '#2563eb', borderTop: '#2563eb', delay: 100 },
              { icon: <GraduationCap size={22} />, title: 'Edukim dhe Ndërgjegjësim', text: 'Ofrojmë informacion dhe këshilla për kujdesin e duhur ndaj kafshëve.',                    iconBg: '#f5f3ff', iconColor: '#7c3aed', borderTop: '#7c3aed', delay: 200 },
            ].map(({ icon, title, text, iconBg, iconColor, borderTop, delay }) => (
              <FadeUp key={title} delay={delay}>
                <div className="rounded-2xl p-8 h-full hover:-translate-y-1 transition-all duration-300 hover:shadow-xl" style={{ border: '1px solid #f3f4f6', borderTop: `3px solid ${borderTop}`, backgroundColor: '#fafafa' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: iconBg, color: iconColor }}>{icon}</div>
                  <h3 className="font-bold text-base mb-3" style={{ color: '#111827' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{text}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO HELP */}
      <section className="py-24 px-6" style={{ backgroundColor: '#f5f0eb' }}>
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5" style={{ backgroundColor: '#fef2f2', color: '#e02424' }}>
                  Si të Ndihmosh
                </div>
                <h2 className="text-3xl md:text-4xl font-black" style={{ color: '#111827' }}>Si mund të kontribuosh?</h2>
              </div>
              <p className="text-sm max-w-xs leading-relaxed" style={{ color: '#9ca3af' }}>
                Ka shumë mënyra për të kontribuar në mbrojtjen e kafshëve në Tiranë.
              </p>
            </div>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <PawPrint size={22} />,      title: 'Adopto',  desc: 'Gjej shokun tënd të ri', to: '/adopto',  color: '#e02424', bg: '#fef2f2', delay: 0 },
              { icon: <AlertTriangle size={22} />, title: 'Raporto', desc: 'Njofto keqtrajtimin',    to: '/raporto', color: '#ea580c', bg: '#fff7ed', delay: 80 },
              { icon: <BookOpen size={22} />,      title: 'Mëso',    desc: 'Materiale edukative',    to: '/edukim',  color: '#2563eb', bg: '#eff6ff', delay: 160 },
              { icon: <Phone size={22} />,         title: 'Kontakt', desc: 'Na kontaktoni direkt',   to: '/kontakt', color: '#059669', bg: '#f0fdf4', delay: 240 },
            ].map(({ icon, title, desc, to, color, bg, delay }) => (
              <FadeUp key={title} delay={delay}>
                <Link to={to} className="group flex flex-col gap-5 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg h-full"
                  style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg, color }}>{icon}</div>
                  <div className="flex-1">
                    <p className="font-bold text-base" style={{ color: '#111827' }}>{title}</p>
                    <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{desc}</p>
                  </div>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 duration-300" style={{ color: '#d1d5db' }} />
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER — dark warm instead of clashing red */}
      <FadeUp>
        <section className="mx-4 md:mx-8 mb-16">
          <div className="rounded-3xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}>
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #fda4af 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
            <div className="relative px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Heart size={14} fill="#fda4af" style={{ color: '#fda4af' }} />
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>Vepro tani</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
                  Ka një kafshë që është duke<br />pritur për dashurinë tënde.
                </h2>
              </div>
              <Link to="/adopto"
                className="group flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] whitespace-nowrap"
                style={{ backgroundColor: '#e02424', color: '#ffffff', boxShadow: '0 4px 20px rgba(224,36,36,0.4)' }}>
                Shiko kafshët
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </FadeUp>

    </div>
  )
}