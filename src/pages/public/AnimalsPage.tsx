import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Heart } from 'lucide-react'
import { getAnimals, getAnimal } from '../../api/client'
import type { Animal } from '../../types'
import heroBg from '../../assets/images/selected.jpeg'

const SPECIES_FILTERS = ['Të gjitha', 'Qen', 'Mace', 'Zog', 'Tjetër']

export default function AnimalsPage() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Të gjitha')

  useEffect(() => {
    getAnimals()
      .then(async (basicAnimals) => {
        const detailed = await Promise.all(
          basicAnimals.map((a: Animal) => getAnimal(a.animal_id))
        )
        setAnimals(detailed)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'Të gjitha'
    ? animals
    : animals.filter(a => a.species === filter)

  return (
    <div style={{ backgroundColor: '#fdf6f0' }}>

      {/* HERO */}
      <section className="relative py-16 md:py-24 text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gray-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent" />

        <div className="relative z-10 px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            Adopto një Kafshë 🐾
          </h1>
          <p className="text-gray-200 max-w-xl mx-auto text-sm md:text-base">
            Gjej shokun tënd të ri dhe jepja një jetë më të mirë një kafshë
            që ka nevojë për dashuri
          </p>
        </div>
      </section>

      {/* FILTERS */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 flex gap-2 md:gap-3 flex-wrap justify-center">
        {SPECIES_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all cursor-pointer
              ${filter === f
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:text-red-600'
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-16">

        {loading && (
          <div className="text-center py-20 text-gray-400 text-sm">
            Duke ngarkuar kafshët...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Nuk u gjetën kafshë</p>
            <p className="text-gray-300 text-sm mt-2">Provoni një filtër tjetër</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filtered.map(animal => (
            <AnimalCard key={animal.animal_id} animal={animal} />
          ))}
        </div>

      </div>

      {/* BOTTOM CTA */}
      <section className="py-12 md:py-16 text-center" style={{ backgroundColor: '#faf2ec' }}>
        <div className="max-w-xl mx-auto px-4 md:px-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            Dëshironi të dhuroni një kafshë? 🏠
          </h2>
          <p className="text-gray-500 text-sm md:text-base mb-8">
            Nëse nuk mundeni të kujdeseni më për kafshën tuaj, ne jemi këtu
            ta strehojmë me kujdes dhe t'i gjejmë një familje të re plot dashuri.
          </p>
          <Link
            to="/kontakt"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg shadow-red-200 text-sm"
          >
            <Heart size={16} /> Na kontaktoni
          </Link>
        </div>
      </section>

    </div>
  )
}

function AnimalCard({ animal }: { animal: Animal }) {
  const primaryPhoto = animal.photos?.find(p => p.is_primary) ?? animal.photos?.[0]

  const statusColor = animal.adoption_status === 'Disponueshme'
    ? 'bg-green-100 text-green-700'
    : 'bg-yellow-100 text-yellow-700'

  const cleanDescription = animal.description
    ? animal.description.replace(/^Shpëtuar nga raporti #\d+:\s*/i, '')
    : null

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-orange-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col">

      <div className="relative h-48 md:h-56 bg-gray-100 overflow-hidden">
        {primaryPhoto ? (
          <img
            src={primaryPhoto.photo_url}
            alt={animal.name ?? animal.species}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl md:text-6xl bg-orange-50/50">
            {animal.species === 'Qen' ? '🐕' : animal.species === 'Mace' ? '🐈' : '🐾'}
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
          {animal.species}
        </div>
        <div className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}>
          {animal.adoption_status}
        </div>
      </div>

      <div className="p-4 md:p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-900 text-base md:text-lg">
            {animal.name ?? 'Pa emër'}
          </h3>
          {animal.health_status && (
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              {animal.health_status}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3 text-xs text-gray-500 mb-3 md:mb-4">
          {animal.age_estimate && (
            <span className="flex items-center gap-1">
              <Calendar size={11} /> {animal.age_estimate}
            </span>
          )}
          {animal.gender && <span>• {animal.gender}</span>}
          {animal.breed && <span>• {animal.breed}</span>}
        </div>

        {cleanDescription && (
          <p className="text-gray-500 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2 leading-relaxed">
            {cleanDescription}
          </p>
        )}

        <Link
          to={`/adopto/${animal.animal_id}`}
          className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-all mt-auto"
        >
          <Heart size={15} /> Më shumë info
        </Link>
      </div>

    </div>
  )
}