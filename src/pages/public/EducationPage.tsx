import { useEffect, useState, useRef } from 'react'
import { MapPin, Clock, Users, Heart, BookOpen, ArrowRight, CalendarX, PawPrint } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getEvents } from '../../api/client'

export const ARTICLES = [
  {
    id: 1, emoji: '📖', category: 'Adoptim',
    title: 'Si të përgatisni shtëpinë para adoptimit',
    excerpt: 'Çdo kafshë e re ka nevojë për një hapësirë të sigurt dhe të rehatshme. Mësoni si të krijoni mjedisin e duhur para ditës së parë.',
    readTime: '4 min', color: '#fef3c7', accent: '#d97706',
    content: `Adoptimi i një kafshe shtëpiake është një moment i gëzueshëm, por kërkon përgatitje paraprake. Para se të sillni kafshën e re në shtëpi, sigurohuni që hapësira është e sigurt dhe mikpritëse.\n\n**1. Krijoni një zonë të sigurt**\nRezervoni një dhomë ose kut të qetë ku kafsha mund të qëndrojë gjatë ditëve të para. Kjo do t'i ndihmojë të adaptohet gradualisht pa u ndjerë e mbingarkuar.\n\n**2. Hiqni rreziqet e mundshme**\nKontrolloni për kabllot elektrike të ekspozuara, bimë toksike, dhe hapësirat e ngushta ku kafsha mund të ngujohet. Siguroni dyert dhe dritaret.\n\n**3. Përgatitni pajisjet bazë**\nPara ditës së parë duhet të keni: enë për ushqim dhe ujë, shtroje të rehatshme, collar dhe zinxhir për qenjtë, kuti me rërë për macet, dhe lodra për stimulim mendor.\n\n**4. Planifikoni vizitën e parë te veterineri**\nBrenda javës së parë, çoni kafshën te veterineri për kontroll të plotë, vaksinime, dhe këshilla mbi dietën dhe kujdesin.\n\n**5. Prezantimi gradual me familjen**\nNëse keni fëmijë ose kafshë të tjera, prezantoni ato gradualisht dhe nën mbikëqyrje. Mos e detyroni kafshën të ndërveprojë nëse nuk është e gatshme.`,
  },
  {
    id: 2, emoji: '🍖', category: 'Kujdes',
    title: 'Ushqyerja e duhur për qenin dhe macen tuaj',
    excerpt: "Dieta e balancuar është çelësi i shëndetit të kafshës suaj. Zbuloni çfarë duhet dhe çfarë nuk duhet t'i jepni kafshës tuaj çdo ditë.",
    readTime: '6 min', color: '#fce7f3', accent: '#be185d',
    content: `Ushqyerja e duhur është themeli i shëndetit të kafshës suaj. Zgjedhja e ushqimit të gabuar mund të çojë në probleme shëndetësore serioze.\n\n**Ushqimi për qenjtë**\nQentë janë omnivore dhe kanë nevojë për proteina, karbohidrate, yndyrna, vitamina dhe minerale. Zgjidhni ushqime komerciale me cilësi të lartë ose konsultohuni me veterinerin për dietë shtëpiake.\n\n**Ushqimi për macet**\nMacet janë karnivore të detyrueshme — kanë nevojë për proteina shtazore. Ushqimi i maceve duhet të përmbajë taurine, një aminoacid që nuk prodhohet nga trupi i maceve.\n\n**Ushqimet e ndaluara:**\nÇokollata, qepa dhe hudhra, rrushi, kockat e vogla, alkooli dhe kafeja, avokadoja.\n\n**Sa herë të ushqeni?**\nKëlyshët: 3-4 herë në ditë. Të rriturit: 2 herë në ditë. Shmangni ushqimin e vazhdueshëm pasi çon në obezitet.`,
  },
  {
    id: 3, emoji: '💉', category: 'Shëndet',
    title: 'Vaksinat e detyrueshme — çfarë duhet të dini',
    excerpt: 'Mbrojtja nga sëmundjet fillon me vaksinimin në kohë. Ky udhëzues shpjegon çdo vaksinë të nevojshme dhe kur duhet bërë.',
    readTime: '5 min', color: '#dcfce7', accent: '#16a34a',
    content: `Vaksinimi është mënyra më efektive dhe ekonomike për të mbrojtur kafshën tuaj nga sëmundje potencialisht fatale.\n\n**Vaksinat për qenjtë:**\nTërbimi — i detyrueshëm me ligj, çdo 1-3 vjet. Distemper — sëmundje virale serioze. Parvovirus — shumë i rrezikshëm për këlyshët. Hepatiti infektiv.\n\n**Vaksinat për macet:**\nTërbimi — i detyrueshëm. Panleukopenia — shumë e rrezikshme. Calicivirus dhe Herpesvirus — sëmundje respiratore.\n\n**Kur të filloni?**\nKëlyshët dhe macët e reja duhet të vaksinohen duke filluar nga mosha 6-8 javë, me doza çdo 3-4 javë deri në moshën 16 javë.`,
  },
  {
    id: 4, emoji: '🎓', category: 'Trajnim',
    title: 'Hapat e parë në trajnimin e këlyshit',
    excerpt: 'Muajt e parë janë vendimtar për formimin e karakterit të qenit. Mësoni teknikat bazë të trajnimit me dashamirësi dhe durim.',
    readTime: '8 min', color: '#ede9fe', accent: '#7c3aed',
    content: `Trajnimi i hershëm është investimi më i rëndësishëm që mund të bëni për qenin tuaj dhe marrëdhënien tuaj me të.\n\n**Parimet bazë të trajnimit pozitiv**\nMetoda moderne bazohet në përforcim pozitiv: shpërblejeni sjelljen e dëshiruar me trajtim, lëvdata ose lojë, dhe injoroni sjelljen e padëshiruar.\n\n**Komanda bazë:**\nUlu, Rri, Eja, Lëre — filloni me këto katër komanda bazë.\n\n**Socializimi i hershëm**\nEkspozojeni këlyshit ndaj njerëzve, kafshëve dhe situatave të ndryshme ndërmjet javës 3-14. Kjo periudhë është kritike.\n\n**Sa kohë duhet?**\nSeancat duhet të jenë 5-10 minuta dhe argëtuese. Konsistenca çdo ditë është shumë më e rëndësishme se seancat e gjata.`,
  },
  {
    id: 5, emoji: '🐱', category: 'Adoptim',
    title: 'Ndryshimi mes adoptimit të maceve të reja dhe të moshuara',
    excerpt: 'Macet e moshuara shpesh anashkalohen, por ato janë dhurata. Kuptoni si të zgjidhni macen e duhur për stilin tuaj të jetës.',
    readTime: '5 min', color: '#fff7ed', accent: '#ea580c',
    content: `Shumë njerëz preferojnë këlyshët, por macet e moshuara ofrojnë avantazhe unike që shpesh injorohen.\n\n**Macet e reja (0-2 vjeç)**\nShumë aktive dhe lozonjare. Kërkojnë më shumë vëmendje. Adaptohen lehtë me kafshë të tjera dhe fëmijë.\n\n**Macet e moshuara (3+ vjeç)**\nKarakter i qartë — dini saktësisht çfarë po adoptoni. Më të qeta dhe të ekuilibruara. Shpesh tashmë të vaksinuara dhe të sterilizuara. Ideale për persona që punojnë apo jetojnë vetëm.\n\n**Periudha e adaptimit**\nÇdo mace, pavarësisht moshës, ka nevojë për 2-4 javë për t'u adaptuar plotësisht në shtëpinë e re. Kini durim.`,
  },
  {
    id: 6, emoji: '🌿', category: 'Mjedis',
    title: 'Bimët shtëpiake të rrezikshme për kafshët tuaja',
    excerpt: 'Dhjetëra bimë dekorative janë toksike për qentë dhe macet. Kontrolloni listën tonë para se të blini bimë të reja.',
    readTime: '3 min', color: '#f0fdf4', accent: '#15803d',
    content: `Shumë bimë që dekorojnë shtëpitë tona janë toksike për kafshët shtëpiake.\n\n**Bimët shumë toksike (shmangni plotësisht):**\nLiriodendron (Lily) — toksike jashtëzakonisht për macet. Oleander — toksike për zemrën. Sago Palm — shkakton dështim hepatik.\n\n**Bimët me toksicitet të moderuar:**\nFicus, Dieffenbachia, Pothos, Aloe Vera, Ivy.\n\n**Bimët relativisht të sigurta:**\nPanje Boston, Viola afrikane, Bambu i lumit.\n\n**Çfarë të bëni nëse kafsha ha bimë toksike?**\nKontaktoni menjëherë veterinerin. Merrni kampionin e bimës nëse është e mundur.`,
  },
]

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  'Adoptim': { bg: '#fef2f2', color: '#e02424' },
  'Kujdes':  { bg: '#fdf2f8', color: '#be185d' },
  'Shëndet': { bg: '#f0fdf4', color: '#16a34a' },
  'Trajnim': { bg: '#f5f3ff', color: '#7c3aed' },
  'Mjedis':  { bg: '#ecfdf5', color: '#059669' },
}

interface Event {
  event_id: number; title: string; description: string
  location: string; event_date: string; event_time: string
  is_free: boolean; max_participants?: number; organizer?: string
  image_url?: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('sq-AL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

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
      opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
    }}>{children}</div>
  )
}

export default function EducationPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEvents().then(setEvents).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ backgroundColor: '#faf9f7', minHeight: '100vh' }}>

      {/* HERO */}
      <section className="relative overflow-hidden text-center" style={{ paddingTop: '7rem', paddingBottom: '5rem', background: 'linear-gradient(135deg, #5b21b6 0%, #be185d 100%)' }}>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 60%, #faf9f7 100%)' }} />
        <FadeUp className="relative z-10 px-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}>
            <BookOpen size={28} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 text-white">Edukim &amp; Aktivitete</h1>
          <p className="max-w-md mx-auto text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Udhëzues praktikë për kujdesin e kafshëve dhe aktivitete nga Bashkia e Tiranës
          </p>
        </FadeUp>
      </section>

      {/* STATS */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-4 items-stretch">
          {[
            { icon: BookOpen, label: 'Artikuj',        value: `${ARTICLES.length}`, color: '#e02424', bg: '#fef2f2' },
            { icon: Users,    label: 'Evente gjithsej', value: String(events.length || '—'),           color: '#2563eb', bg: '#eff6ff' },
            { icon: Heart,    label: 'Adoptim falas',   value: '100%',                                 color: '#16a34a', bg: '#f0fdf4' },
          ].map(({ icon: Icon, label, value, color, bg }, i) => (
            <FadeUp key={label} delay={i * 80} className="flex">
              <div className="bg-white rounded-2xl p-5 text-center flex flex-col items-center justify-center w-full" style={{ border: '1px solid #f3f4f6' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: bg }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <p className="text-3xl font-black mb-1" style={{ color }}>{value}</p>
                <p className="text-xs" style={{ color: '#9ca3af' }}>{label}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* ARTICLES */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <FadeUp>
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-black" style={{ color: '#111827' }}>Artikuj &amp; Udhëzues</h2>
            <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Këshilla praktike për çdo pronar kafshësh</p>
          </div>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {ARTICLES.map((article, i) => {
            const catStyle = CATEGORY_COLORS[article.category] ?? { bg: '#f9fafb', color: '#6b7280' }
            return (
              <FadeUp key={article.id} delay={i * 70} className="flex">
                <Link to={`/edukim/artikull/${article.id}`}
                  className="bg-white rounded-2xl overflow-hidden hover:-translate-y-1.5 transition-all duration-300 hover:shadow-xl flex flex-col w-full"
                  style={{ border: '1px solid #f3f4f6' }}>
                  <div className="h-1.5 w-full" style={{ backgroundColor: article.accent }} />
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: article.color }}>
                        {article.emoji}
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-lg" style={{ backgroundColor: catStyle.bg, color: catStyle.color }}>
                        {article.category}
                      </span>
                    </div>
                    <h3 className="font-black text-base mb-2 leading-snug" style={{ color: '#111827' }}>{article.title}</h3>
                    <p className="text-sm leading-relaxed line-clamp-3 flex-1 mb-4" style={{ color: '#6b7280' }}>{article.excerpt}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs flex items-center gap-1" style={{ color: '#d1d5db' }}>
                        <Clock size={11} /> {article.readTime} lexim
                      </span>
                      <span className="text-xs font-bold flex items-center gap-1" style={{ color: '#e02424' }}>
                        Lexo <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeUp>
            )
          })}
        </div>
      </section>

      {/* EVENTS */}
      <section className="px-6 pb-20" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #f3f4f6', paddingTop: '5rem' }}>
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-5" style={{ backgroundColor: '#fef2f2', color: '#e02424', border: '1px solid #fecaca' }}>
                <Users size={12} /> Bashkia Tiranë
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color: '#111827' }}>Aktivitete &amp; Evente</h2>
              <p className="text-sm" style={{ color: '#9ca3af' }}>Aktivitete të organizuara nga Bashkia e Tiranës për mbrojtjen e kafshëve</p>
            </div>
          </FadeUp>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm" style={{ color: '#9ca3af' }}>Duke ngarkuar eventet...</p>
            </div>
          ) : events.length === 0 ? (
            <FadeUp>
              <div className="text-center py-16">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f9fafb' }}>
                  <CalendarX size={24} style={{ color: '#d1d5db' }} />
                </div>
                <p className="font-semibold" style={{ color: '#374151' }}>Nuk ka evente të shtuara ende.</p>
                <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Kontrolloni përsëri së shpejti!</p>
              </div>
            </FadeUp>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((event, i) => (
                <FadeUp key={event.event_id} delay={i * 60} className="flex">
                  <div className="bg-white rounded-2xl overflow-hidden flex flex-col w-full hover:-translate-y-1 transition-all duration-300 hover:shadow-md"
                    style={{ border: '1px solid #f3f4f6' }}>

                    {/* Cover image or date header */}
                    {event.image_url ? (
                      <div className="relative h-44 overflow-hidden">
                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
                        <div className="absolute top-3 left-3 rounded-xl px-3 py-1.5 text-center" style={{ backgroundColor: '#e02424', backdropFilter: 'blur(8px)' }}>
                          <p className="text-white font-black text-lg leading-none">{new Date(event.event_date).getDate()}</p>
                          <p className="text-white/80 text-xs">{new Date(event.event_date).toLocaleDateString('sq-AL', { month: 'short' })}</p>
                        </div>
                        {event.is_free && (
                          <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-lg" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>Falas</span>
                        )}
                      </div>
                    ) : (
                      <div className="h-20 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#e02424' }}>
                        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '14px 14px' }} />
                        <div className="text-center relative z-10">
                          <p className="text-3xl font-black leading-none text-white">{new Date(event.event_date).getDate()}</p>
                          <p className="text-xs font-semibold mt-0.5 text-white/80">
                            {new Date(event.event_date).toLocaleDateString('sq-AL', { month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        {event.is_free && (
                          <span className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>Falas</span>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-black text-base leading-tight mb-2" style={{ color: '#111827' }}>{event.title}</h3>
                      <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: '#6b7280' }}>{event.description}</p>
                      <div className="space-y-1.5 mt-auto">
                        <div className="flex items-center gap-2 text-xs" style={{ color: '#9ca3af' }}>
                          <Clock size={11} style={{ color: '#e02424' }} />
                          {formatDate(event.event_date)} · {event.event_time}
                        </div>
                        <div className="flex items-center gap-2 text-xs" style={{ color: '#9ca3af' }}>
                          <MapPin size={11} style={{ color: '#e02424' }} />
                          {event.location}
                        </div>
                        {event.max_participants && (
                          <div className="flex items-center gap-2 text-xs" style={{ color: '#9ca3af' }}>
                            <Users size={11} style={{ color: '#e02424' }} />
                            Maks. {event.max_participants} pjesëmarrës
                          </div>
                        )}
                        {event.organizer && (
                          <p className="text-xs pt-1" style={{ color: '#d1d5db' }}>Organizuar nga: {event.organizer}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <FadeUp>
        <section className="py-20 px-6 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: '#fef2f2' }}>
              <PawPrint size={24} style={{ color: '#e02424' }} />
            </div>
            <h3 className="text-2xl font-black mb-3" style={{ color: '#111827' }}>Gati të bëni ndryshimin?</h3>
            <p className="text-sm mb-7 leading-relaxed" style={{ color: '#6b7280' }}>Adoptoni një kafshë sot dhe jepini asaj shansin që meriton.</p>
            <Link to="/adopto"
              className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: '#e02424', boxShadow: '0 4px 20px rgba(224,36,36,0.3)' }}>
              <Heart size={15} /> Shiko kafshët për adoptim
            </Link>
          </div>
        </section>
      </FadeUp>

    </div>
  )
}