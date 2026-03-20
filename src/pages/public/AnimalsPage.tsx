import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Heart, ArrowRight, Search, SlidersHorizontal } from 'lucide-react'
import { getAnimals, getAnimal } from '../../api/client'
import type { Animal } from '../../types'
import heroBg from '../../assets/images/selected.jpeg'

const SPECIES_FILTERS = ['Të gjitha', 'Qen', 'Mace', 'Zog', 'Tjetër']

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.05 })
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
    }}>{children}</div>
  )
}

export default function AnimalsPage() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Të gjitha')

  useEffect(() => {
    getAnimals()
      .then(async (basic) => {
        const detailed = await Promise.all(basic.map((a: Animal) => getAnimal(a.animal_id)))
        setAnimals(detailed)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'Të gjitha' ? animals : animals.filter(a => a.species === filter)

  return (
    <div style={{ backgroundColor: '#f5f0eb', minHeight: '100vh' }}>

      {/* HERO */}
      <section className="relative overflow-hidden text-center" style={{ paddingTop: '7rem', paddingBottom: '5rem' }}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})`, filter: 'brightness(0.45)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(245,240,235,1) 100%)' }} />
        <FadeUp className="relative z-10 px-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
            <Heart size={28} fill="white" style={{ color: 'white' }} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4 text-white" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            Gjej shokun tënd të ri.
          </h1>
          <p className="max-w-md mx-auto text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Çdo kafshë ka një histori. Gjej të tyren dhe jepja një jetë të re plot dashuri.
          </p>
        </FadeUp>
      </section>

      {/* FILTERS — on warm bg */}
      <div className="px-6 pt-2 pb-4" style={{ backgroundColor: '#f5f0eb' }}>
        <FadeUp>
          <div className="flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-white rounded-2xl px-5 py-4 flex-wrap justify-center" style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center gap-1.5 text-xs font-semibold mr-1" style={{ color: '#9ca3af' }}>
                <SlidersHorizontal size={13} /> Filtro:
              </div>
              {SPECIES_FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
                  style={filter === f
                    ? { backgroundColor: '#e02424', color: '#ffffff', boxShadow: '0 2px 10px rgba(224,36,36,0.3)' }
                    : { backgroundColor: '#f5f0eb', color: '#374151', border: '1px solid rgba(0,0,0,0.08)' }
                  }>
                  {f}
                </button>
              ))}
            </div>
            {!loading && (
              <p className="text-xs" style={{ color: '#9ca3af' }}>{filtered.length} kafshë</p>
            )}
          </div>
        </FadeUp>
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto px-6 pb-20 pt-4">
        {loading && (
          <div className="text-center py-24">
            <div className="w-10 h-10 border-2 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm" style={{ color: '#9ca3af' }}>Duke ngarkuar kafshët...</p>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#ffffff' }}>
              <Search size={28} style={{ color: '#d1d5db' }} />
            </div>
            <p className="font-bold text-lg" style={{ color: '#111827' }}>Nuk u gjetën kafshë</p>
            <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>Provoni një filtër tjetër</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((animal, i) => (
            <FadeUp key={animal.animal_id} delay={i % 3 * 60}>
              <AnimalCard animal={animal} />
            </FadeUp>
          ))}
        </div>
      </div>

      {/* CTA */}
      <FadeUp>
        <section className="mx-4 md:mx-8 mb-14">
          <div className="rounded-3xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}>
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #fda4af 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
            <div className="relative px-8 py-14 flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto text-center md:text-left">
              <div>
                <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                  <Heart size={14} fill="#fda4af" style={{ color: '#fda4af' }} />
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>Dhuroni një kafshë</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                  Dëshironi të dhuroni<br />një kafshë?
                </h2>
                <p className="text-sm mt-2 max-w-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Nëse nuk mundeni të kujdeseni më, ne jemi këtu ta strehojmë me kujdes.
                </p>
              </div>
              <Link to="/kontakt"
                className="group flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] whitespace-nowrap text-white"
                style={{ backgroundColor: '#e02424', boxShadow: '0 4px 20px rgba(224,36,36,0.4)' }}>
                Na kontaktoni <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </FadeUp>
    </div>
  )
}

function AnimalCard({ animal }: { animal: Animal }) {
  const primaryPhoto = animal.photos?.find(p => p.is_primary) ?? animal.photos?.[0]
  const isAvailable = animal.adoption_status === 'Disponueshme'
  const cleanDescription = animal.description?.replace(/^Shpëtuar nga raporti #\d+:\s*/i, '') ?? null

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300 hover:shadow-xl" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
      <div className="relative h-52 overflow-hidden" style={{ backgroundColor: '#f5f0eb' }}>
        {primaryPhoto ? (
          <img src={primaryPhoto.photo_url} alt={animal.name ?? animal.species}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {animal.species === 'Qen' ? '🐕' : animal.species === 'Mace' ? '🐈' : '🐾'}
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-white shadow-sm" style={{ color: '#374151' }}>
            {animal.species}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="text-xs font-bold px-3 py-1 rounded-lg"
            style={isAvailable
              ? { backgroundColor: '#dcfce7', color: '#15803d' }
              : { backgroundColor: '#fef9c3', color: '#a16207' }}>
            {animal.adoption_status}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2 min-h-[28px]">
          <h3 className="font-black text-lg" style={{ color: '#111827' }}>{animal.name ?? 'Pa emër'}</h3>
          <span className="text-xs px-2.5 py-1 rounded-lg font-medium shrink-0 ml-2" style={{ backgroundColor: '#f5f0eb', color: '#9ca3af', visibility: animal.health_status ? 'visible' : 'hidden' }}>
            {animal.health_status ?? 'placeholder'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs mb-3" style={{ color: '#9ca3af', minHeight: '18px' }}>
          {animal.age_estimate && <span className="flex items-center gap-1"><Calendar size={10} /> {animal.age_estimate}</span>}
          {animal.gender && <span>· {animal.gender}</span>}
          {animal.breed && <span>· {animal.breed}</span>}
        </div>
        <p className="text-sm leading-relaxed line-clamp-2 flex-1 mb-4" style={{ color: '#6b7280', minHeight: '40px' }}>
          {cleanDescription ?? ''}
        </p>
        <Link to={`/adopto/${animal.animal_id}`}
          className="group flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all mt-auto hover:opacity-90"
          style={{ backgroundColor: '#e02424', color: '#ffffff', boxShadow: '0 2px 12px rgba(224,36,36,0.25)' }}>
          <Heart size={13} fill="white" /> Më shumë info <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}