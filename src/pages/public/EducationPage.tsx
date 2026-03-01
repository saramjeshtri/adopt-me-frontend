import { useEffect, useState, useRef } from 'react'
import { Calendar, MapPin, Clock, Users, Heart, BookOpen, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getEvents } from '../../api/client'
import heroBg from '../../assets/images/selected.jpeg'

// ─── Static Articles ──────────────────────────────────────────────────────────
export const ARTICLES = [
  {
    id: 1,
    emoji: '🏠',
    category: 'Adoptim',
    title: 'Si të përgatisni shtëpinë para adoptimit',
    excerpt: 'Çdo kafshë e re ka nevojë për një hapësirë të sigurt dhe të rehatshme. Mësoni si të krijoni mjedisin e duhur para ditës së parë.',
    readTime: '4 min',
    color: '#fef3c7',
    accent: '#d97706',
    content: `Adoptimi i një kafshe shtëpiake është një moment i gëzueshëm, por kërkon përgatitje paraprake. Para se të sillni kafshën e re në shtëpi, sigurohuni që hapësira është e sigurt dhe mikpritëse.

**1. Krijoni një zonë të sigurt**
Rezervoni një dhomë ose kut të qetë ku kafsha mund të qëndrojë gjatë ditëve të para. Kjo do t'i ndihmojë të adaptohet gradualisht pa u ndjerë e mbingarkuar.

**2. Hiqni rreziqet e mundshme**
Kontrolloni për kabllot elektrike të ekspozuara, bimë toksike, dhe hapësirat e ngushta ku kafsha mund të ngujohet. Siguroni dyert dhe dritaret.

**3. Përgatitni pajisjet bazë**
Para ditës së parë duhet të keni: enë për ushqim dhe ujë, shtroje të rehatshme, collar dhe zinxhir për qenjtë, kuti me rërë për macet, dhe lodra për stimulim mendor.

**4. Planifikoni vizitën e parë te veterineri**
Brenda javës së parë, çoni kafshën te veterineri për kontroll të plotë, vaksinime, dhe këshilla mbi dietën dhe kujdesin.

**5. Prezantimi gradual me familjen**
Nëse keni fëmijë ose kafshë të tjera, prezantoni ato gradualisht dhe nën mbikëqyrje. Mos e detyroni kafshën të ndërveprojë nëse nuk është e gatshme.`,
  },
  {
    id: 2,
    emoji: '🍖',
    category: 'Kujdes',
    title: 'Ushqyerja e duhur për qenin dhe macen tuaj',
    excerpt: "Dieta e balancuar është çelësi i shëndetit të kafshës suaj. Zbuloni çfarë duhet dhe çfarë nuk duhet t'i jepni kafshës tuaj çdo ditë.",
    readTime: '6 min',
    color: '#fce7f3',
    accent: '#be185d',
    content: `Ushqyerja e duhur është themeli i shëndetit të kafshës suaj. Zgjedhja e ushqimit të gabuar mund të çojë në probleme shëndetësore serioze.

**Ushqimi për qenjtë**
Qentë janë omnivore dhe kanë nevojë për proteina, karbohidrate, yndyrna, vitamina dhe minerale. Zgjidhni ushqime komerciale me cilësi të lartë ose konsultohuni me veterinerin për dietë shtëpiake.

**Ushqimi për macet**
Macet janë karnivore të detyrueshme — kanë nevojë për proteina shtazore. Ushqimi i maceve duhet të përmbajë taurine, një aminoacid që nuk prodhohet nga trupi i maceve.

**Ushqimet e ndaluara:**
Çokollata, qepa dhe hudhra, rrushi, kockat e vogla, alkooli dhe kafeja, avokadoja.

**Sa herë të ushqeni?**
Këlyshët: 3-4 herë në ditë. Të rriturit: 2 herë në ditë. Shmangni ushqimin e vazhdueshëm pasi çon në obezitet.`,
  },
  {
    id: 3,
    emoji: '💉',
    category: 'Shëndet',
    title: 'Vaksinat e detyrueshme — çfarë duhet të dini',
    excerpt: 'Mbrojtja nga sëmundjet fillon me vaksinimin në kohë. Ky udhëzues shpjegon çdo vaksinë të nevojshme dhe kur duhet bërë.',
    readTime: '5 min',
    color: '#dcfce7',
    accent: '#16a34a',
    content: `Vaksinimi është mënyra më efektive dhe ekonomike për të mbrojtur kafshën tuaj nga sëmundje potencialisht fatale.

**Vaksinat për qenjtë:**
Tërbimi — i detyrueshëm me ligj, çdo 1-3 vjet. Distemper — sëmundje virale serioze. Parvovirus — shumë i rrezikshëm për këlyshët. Hepatiti infektiv.

**Vaksinat për macet:**
Tërbimi — i detyrueshëm. Panleukopenia — shumë e rrezikshme. Calicivirus dhe Herpesvirus — sëmundje respiratore.

**Kur të filloni?**
Këlyshët dhe macët e reja duhet të vaksinohen duke filluar nga mosha 6-8 javë, me doza çdo 3-4 javë deri në moshën 16 javë.`,
  },
  {
    id: 4,
    emoji: '🎓',
    category: 'Trajnim',
    title: 'Hapat e parë në trajnimin e këlyshit',
    excerpt: 'Muajt e parë janë vendimtar për formimin e karakterit të qenit. Mësoni teknikat bazë të trajnimit me dashamirësi dhe durim.',
    readTime: '8 min',
    color: '#ede9fe',
    accent: '#7c3aed',
    content: `Trajnimi i hershëm është investimi më i rëndësishëm që mund të bëni për qenin tuaj dhe marrëdhënien tuaj me të.

**Parimet bazë të trajnimit pozitiv**
Metoda moderne bazohet në përforcim pozitiv: shpërblejeni sjelljen e dëshiruar me trajtim, lëvdata ose lojë, dhe injoroni sjelljen e padëshiruar.

**Komanda bazë:**
Ulu, Rri, Eja, Lëre — filloni me këto katër komanda bazë.

**Socializimi i hershëm**
Ekspozojeni këlyshit ndaj njerëzve, kafshëve dhe situatave të ndryshme ndërmjet javës 3-14. Kjo periudhë është kritike.

**Sa kohë duhet?**
Seancat duhet të jenë 5-10 minuta dhe argëtuese. Konsistenca çdo ditë është shumë më e rëndësishme se seancat e gjata.`,
  },
  {
    id: 5,
    emoji: '🐱',
    category: 'Adoptim',
    title: 'Ndryshimi mes adoptimit të maceve të reja dhe të moshuara',
    excerpt: 'Macet e moshuara shpesh anashkalohen, por ato janë dhurata. Kuptoni si të zgjidhni macen e duhur për stilin tuaj të jetës.',
    readTime: '5 min',
    color: '#fff7ed',
    accent: '#ea580c',
    content: `Shumë njerëz preferojnë këlyshët, por macet e moshuara ofrojnë avantazhe unike që shpesh injorohen.

**Macet e reja (0-2 vjeç)**
Shumë aktive dhe lozonjare. Kërkojnë më shumë vëmendje. Adaptohen lehtë me kafshë të tjera dhe fëmijë.

**Macet e moshuara (3+ vjeç)**
Karakter i qartë — dini saktësisht çfarë po adoptoni. Më të qeta dhe të ekuilibruara. Shpesh tashmë të vaksinuara dhe të sterilizuara. Ideale për persona që punojnë apo jetojnë vetëm.

**Periudha e adaptimit**
Çdo mace, pavarësisht moshës, ka nevojë për 2-4 javë për t'u adaptuar plotësisht në shtëpinë e re. Kini durim.`,
  },
  {
    id: 6,
    emoji: '🌿',
    category: 'Mjedis',
    title: 'Bimët shtëpiake të rrezikshme për kafshët tuaja',
    excerpt: 'Dhjetëra bimë dekorative janë toksike për qentë dhe macet. Kontrolloni listën tonë para se të blini bimë të reja.',
    readTime: '3 min',
    color: '#f0fdf4',
    accent: '#15803d',
    content: `Shumë bimë që dekorojnë shtëpitë tona janë toksike për kafshët shtëpiake.

**Bimët shumë toksike (shmangni plotësisht):**
Liriodendron (Lily) — toksike jashtëzakonisht për macet. Oleander — toksike për zemrën. Sago Palm — shkakton dështim hepatik.

**Bimët me toksicitet të moderuar:**
Ficus, Dieffenbachia, Pothos, Aloe Vera, Ivy.

**Bimët relativisht të sigurta:**
Panje Boston, Viola afrikane, Bambu i lumit.

**Çfarë të bëni nëse kafsha ha bimë toksike?**
Kontaktoni menjëherë veterinerin. Merrni kampionin e bimës nëse është e mundur.`,
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  'Adoptim': 'bg-red-100 text-red-700',
  'Kujdes':  'bg-pink-100 text-pink-700',
  'Shëndet': 'bg-green-100 text-green-700',
  'Trajnim': 'bg-purple-100 text-purple-700',
  'Mjedis':  'bg-emerald-100 text-emerald-700',
}

interface Event {
  event_id:    number
  title:       string
  description: string
  location:    string
  event_date:  string
  event_time:  string
  is_free:     boolean
  max_participants?: number
  organizer?:  string
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('sq-AL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function isUpcoming(dateStr: string) {
  return new Date(dateStr) >= new Date()
}

function AnimatedCard({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.08 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className} style={{
      opacity:    visible ? 1 : 0,
      transform:  visible ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

export default function EducationPage() {
  const [events, setEvents]   = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filteredEvents = events.filter(e => {
    if (activeFilter === 'upcoming') return isUpcoming(e.event_date)
    if (activeFilter === 'past')     return !isUpcoming(e.event_date)
    return true
  })

  return (
    <div style={{ backgroundColor: '#fdf6f0' }} className="min-h-screen">

      {/* HERO */}
      <section className="relative py-16 md:py-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 bg-gray-900/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
        <div className="relative z-10 px-4">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-red-600 rounded-2xl mb-4 shadow-xl shadow-red-900/50">
            <BookOpen size={28} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            Edukim & Aktivitete 📚
          </h1>
          <p className="text-gray-200 max-w-xl mx-auto text-sm md:text-base">
            Udhëzues praktikë për kujdesin e kafshëve dhe aktivitete të organizuara nga Bashkia e Tiranës
          </p>
        </div>
      </section>

      {/* STATS */}
      <div className="max-w-3xl mx-auto px-4 -mt-8 relative z-10 grid grid-cols-3 gap-3 mb-16">
        {[
          { icon: BookOpen, label: 'Artikuj',       value: `${ARTICLES.length}` },
          { icon: Users,    label: 'Evente aktive', value: String(events.filter(e => isUpcoming(e.event_date)).length || '—') },
          { icon: Heart,    label: 'Adoptim falas', value: '100%' },
        ].map(({ icon: Icon, label, value }, i) => (
          <AnimatedCard key={label} delay={i * 100}>
            <div className="bg-white rounded-2xl p-4 text-center shadow-md border border-orange-50">
              <Icon size={20} className="text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* ARTICLES */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <AnimatedCard>
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Artikuj & Udhëzues</h2>
            <p className="text-gray-400 text-sm mt-1">Këshilla praktike për çdo pronar kafshësh</p>
          </div>
        </AnimatedCard>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ARTICLES.map((article, i) => (
            <AnimatedCard key={article.id} delay={i * 80}>
              <Link to={`/edukim/artikull/${article.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-orange-50 hover:shadow-lg transition-all block"
                style={{ display: 'block' }}
              >
                <div className="h-2" style={{ backgroundColor: article.accent }} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: article.color }}>
                      {article.emoji}
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CATEGORY_COLORS[article.category] || 'bg-gray-100 text-gray-600'}`}>
                      {article.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300 flex items-center gap-1">
                      <Clock size={11} /> {article.readTime} lexim
                    </span>
                    <span className="text-xs font-semibold text-red-500 flex items-center gap-1.5">
                      Lexo <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* EVENTS */}
      <section style={{ backgroundColor: '#fff8f3' }} className="border-t border-orange-100 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedCard>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold px-4 py-2 rounded-full mb-4">
                <Users size={13} /> Bashkia Tiranë
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Aktivitete & Evente</h2>
              <p className="text-gray-400 text-sm">Aktivitete të organizuara nga Bashkia e Tiranës për mbrojtjen e kafshëve</p>
            </div>
          </AnimatedCard>

          <div className="flex justify-center gap-2 mb-8">
            {([['upcoming', 'Të ardhshme'], ['all', 'Të gjitha'], ['past', 'Të kaluara']] as const).map(([val, label]) => (
              <button key={val} onClick={() => setActiveFilter(val)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer
                  ${activeFilter === val ? 'bg-red-600 text-white shadow-md' : 'bg-white text-gray-500 hover:text-gray-700 border border-gray-100'}`}>
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-300 text-sm">Duke ngarkuar eventet...</div>
          ) : filteredEvents.length === 0 ? (
            <AnimatedCard>
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📅</div>
                <p className="text-gray-400 font-medium">
                  {activeFilter === 'upcoming' ? 'Nuk ka evente të planifikuara aktualisht.' : 'Nuk ka evente në këtë kategori.'}
                </p>
                <p className="text-gray-300 text-sm mt-1">Kontrolloni përsëri së shpejti!</p>
              </div>
            </AnimatedCard>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event, i) => {
                const upcoming = isUpcoming(event.event_date)
                return (
                  <AnimatedCard key={event.event_id} delay={i * 80}>
                    <div className={`bg-white rounded-2xl p-6 shadow-sm border transition-all hover:shadow-md
                      ${upcoming ? 'border-orange-100' : 'border-gray-100 opacity-70'}`}>
                      <div className="flex items-start gap-5">
                        <div className={`shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-center
                          ${upcoming ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <span className="text-xl font-bold leading-none">{new Date(event.event_date).getDate()}</span>
                          <span className="text-xs mt-0.5 opacity-80">
                            {new Date(event.event_date).toLocaleDateString('sq-AL', { month: 'short' })}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <h3 className="font-bold text-gray-900 text-base">{event.title}</h3>
                            <div className="flex items-center gap-2 shrink-0">
                              {event.is_free && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">Falas</span>}
                              {!upcoming && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-400">I kaluar</span>}
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm mt-1 mb-3 leading-relaxed">{event.description}</p>
                          <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1.5"><Calendar size={12} className="text-red-400" />{formatDate(event.event_date)}</span>
                            <span className="flex items-center gap-1.5"><Clock size={12} className="text-red-400" />{event.event_time}</span>
                            <span className="flex items-center gap-1.5"><MapPin size={12} className="text-red-400" />{event.location}</span>
                            {event.max_participants && <span className="flex items-center gap-1.5"><Users size={12} className="text-red-400" />Maks. {event.max_participants} pjesëmarrës</span>}
                          </div>
                          {event.organizer && <p className="text-xs text-gray-300 mt-2">Organizuar nga: {event.organizer}</p>}
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <AnimatedCard>
        <section className="py-16 px-4 text-center">
          <div className="max-w-xl mx-auto">
            <div className="text-4xl mb-4">🐾</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Gati të bëni ndryshimin?</h3>
            <p className="text-gray-400 text-sm mb-6">Adoptoni një kafshë sot dhe jepini asaj shansin që meriton.</p>
            <Link to="/adopto"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg shadow-red-200 text-sm">
              <Heart size={15} /> Shiko kafshët për adoptim
            </Link>
          </div>
        </section>
      </AnimatedCard>

    </div>
  )
}