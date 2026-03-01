import { useState, useRef, useEffect } from 'react'
import { MapPin, Phone, Mail, Clock, Heart, CheckCircle, AlertCircle, ChevronDown, Upload, X } from 'lucide-react'
import heroBg from '../../assets/images/selected.jpeg'
import { createSurrender, uploadSurrenderMedia } from '../../api/client'

const SPECIES = ['Qen', 'Mace', 'Zog', 'Tjetër']
const REASONS = [
  'Nuk mundem ta kujdesem financiarisht',
  'Probleme shëndetësore të pronarit',
  'Lëvizje / emigrim',
  'Alergjia e familjes',
  'Kafsha nuk përshtatet me fëmijët / kafshë të tjera',
  'Tjetër',
]

function AnimatedSection({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.08 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: 'opacity 0.55s ease, transform 0.55s ease',
    }}>{children}</div>
  )
}

export default function ContactPage() {
  // Dhuro form state
  const [form, setForm] = useState({
    owner_name: '', phone: '', email: '',
    species: '', breed: '', age: '',
    is_vaccinated: '', reason: '', notes: '',
  });
  const [photos, setPhotos]     = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]       = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const setF = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setPhotos(prev => {
      const combined = [...prev, ...files]
      const unique = combined.filter((f, i, arr) => arr.findIndex(x => x.name === f.name && x.size === f.size) === i)
      return unique.slice(0, 3)
    })
    e.target.value = ''
  }

  const handleSubmit = async () => {
    if (!form.owner_name || !form.phone || !form.species || !form.reason) {
      setError('Ju lutemi plotësoni të gjitha fushat e detyrueshme.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const surrender = await createSurrender(form)
      // Upload photos sequentially
      for (const photo of photos) {
        try { await uploadSurrenderMedia(surrender.surrender_id, photo) } catch {}
      }
      setSubmitted(true)
    } catch {
      setError('Ndodhi një gabim. Ju lutemi provoni përsëri.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all bg-white"
  const labelCls = "block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide"

  return (
    <div style={{ backgroundColor: '#fdf6f0' }} className="min-h-screen">

      {/* HERO */}
      <section className="relative py-16 md:py-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 bg-gray-900/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
        <div className="relative z-10 px-4">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-red-600 rounded-2xl mb-4 shadow-xl shadow-red-900/50">
            <Phone size={26} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">Na Kontaktoni 📞</h1>
          <p className="text-gray-200 max-w-xl mx-auto text-sm md:text-base">
            Jemi këtu për çdo pyetje, sugjerim ose nevojë. Bashkia e Tiranës — Sektori i Mbrojtjes së Kafshëve.
          </p>
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            icon: MapPin, label: 'Adresa',
            lines: ['Sheshi "Skënderbej", Godina nr. 2', 'Tiranë, 1001, Shqipëri'],
            accent: '#fee2e2', iconColor: 'text-red-500',
          },
          {
            icon: Phone, label: 'Telefon',
            lines: ['0800 0888 (pa pagesë)', 'E Hënë – E Premte, 08:00–16:00'],
            accent: '#fef9c3', iconColor: 'text-yellow-500',
          },
          {
            icon: Mail, label: 'Email',
            lines: ['info@tirana.al', 'Përgjigje brenda 24 orëve'],
            accent: '#dcfce7', iconColor: 'text-green-500',
          },
        ].map(({ icon: Icon, label, lines, accent, iconColor }) => (
          <AnimatedSection key={label}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-50 flex items-start gap-4 h-full hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: accent }}>
                <Icon size={20} className={iconColor} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                {lines.map((l, j) => (
                  <p key={j} className={j === 0 ? 'text-sm font-semibold text-gray-900' : 'text-xs text-gray-400 mt-0.5'}>{l}</p>
                ))}
              </div>
            </div>
          </AnimatedSection>
        ))}
      </section>

      {/* DHURO KAFSHË */}
      <section style={{ backgroundColor: '#fff8f3' }} className="border-t border-orange-100 py-20 px-4">
        <div className="max-w-2xl mx-auto">

          <AnimatedSection>
            <div className="text-center mb-10">
              <div className="text-5xl mb-3">🏠</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Dëshironi të dhuroni një kafshë?</h2>
              <p className="text-gray-500 leading-relaxed">
                Nëse nuk mundeni të kujdeseni më për kafshën tuaj, ne jemi këtu ta strehojmë me kujdes dhe t'i gjejmë një familje të re plot dashuri.
              </p>
            </div>
          </AnimatedSection>

          {submitted ? (
            <AnimatedSection>
              <div className="bg-white rounded-3xl p-10 shadow-sm border border-green-100 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Faleminderit! 🐾</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
                  Kërkesa juaj u dërgua me sukses. Ekipi ynë do t'ju kontaktojë brenda 24–48 orëve për të planifikuar pritjen e kafshës.
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ owner_name: '', phone: '', email: '', species: '', breed: '', age: '', is_vaccinated: '', reason: '', notes: '' }); setPhotos([]) }}
                  className="mt-6 text-sm text-red-500 hover:text-red-600 font-medium cursor-pointer transition-colors">
                  Dërgoni kërkesë tjetër
                </button>
              </div>
            </AnimatedSection>
          ) : (
            <AnimatedSection>
              <div className="bg-white rounded-3xl shadow-sm border border-orange-100 overflow-hidden">

                {/* Section 1: Owner info */}
                <div className="p-6 md:p-8 border-b border-gray-50">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</div>
                    <h3 className="font-bold text-gray-900">Informacioni juaj</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Emri i plotë *</label>
                      <input placeholder="p.sh. Arta Kelmendi" value={form.owner_name}
                        onChange={e => setF('owner_name', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Telefon *</label>
                      <input placeholder="06X XXX XXXX" value={form.phone}
                        onChange={e => setF('phone', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Email (opsionale)</label>
                      <input placeholder="email@shembull.al" value={form.email}
                        onChange={e => setF('email', e.target.value)} className={inputCls} />
                    </div>
                  </div>
                </div>

                {/* Section 2: Animal info */}
                <div className="p-6 md:p-8 border-b border-gray-50">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</div>
                    <h3 className="font-bold text-gray-900">Detajet e kafshës</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Lloji *</label>
                      <div className="relative">
                        <select value={form.species} onChange={e => setF('species', e.target.value)}
                          className={`${inputCls} appearance-none pr-10`}>
                          <option value="">Zgjidhni llojin...</option>
                          {SPECIES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Raca (opsionale)</label>
                      <input placeholder="p.sh. Labrador, e panjohur..." value={form.breed}
                        onChange={e => setF('breed', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Mosha e përafërt</label>
                      <input placeholder="p.sh. 3 vjeç, 6 muaj..." value={form.age}
                        onChange={e => setF('age', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>E vaksinuar?</label>
                      <div className="relative">
                        <select value={form.is_vaccinated} onChange={e => setF('is_vaccinated', e.target.value)}
                          className={`${inputCls} appearance-none pr-10`}>
                          <option value="">Zgjidhni...</option>
                          <option value="po">Po</option>
                          <option value="jo">Jo</option>
                          <option value="nuk_di">Nuk e di</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Photo upload */}
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Foto të kafshës (maks. 3)</label>
                      <div onClick={() => fileRef.current?.click()}
                        className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-all">
                        <Upload size={20} className="text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Kliko për të ngarkuar foto</p>
                        <p className="text-xs text-gray-300 mt-0.5">JPEG, PNG • Maks. 3 foto</p>
                      </div>
                      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
                        multiple className="hidden" onChange={handlePhotos} />
                      {photos.length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {photos.map((f, i) => (
                            <div key={i} className="relative">
                              <img src={URL.createObjectURL(f)} alt=""
                                className="w-16 h-16 rounded-xl object-cover border border-orange-100" />
                              <button onClick={() => setPhotos(p => p.filter((_, j) => j !== i))}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 3: Reason */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</div>
                    <h3 className="font-bold text-gray-900">Arsyeja e dorëzimit</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Arsyeja kryesore *</label>
                      <div className="relative">
                        <select value={form.reason} onChange={e => setF('reason', e.target.value)}
                          className={`${inputCls} appearance-none pr-10`}>
                          <option value="">Zgjidhni arsyen...</option>
                          {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Shënime shtesë (opsionale)</label>
                      <textarea placeholder="Çdo informacion tjetër që mendoni se është i rëndësishëm për kafshën tuaj..."
                        value={form.notes} onChange={e => setF('notes', e.target.value)}
                        rows={3} className={`${inputCls} resize-none`} />
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">
                        <AlertCircle size={15} /> {error}
                      </div>
                    )}

                    <button onClick={handleSubmit} disabled={submitting}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer shadow-lg shadow-red-100 flex items-center justify-center gap-2">
                      {submitting
                        ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Duke dërguar...</>
                        : <><Heart size={15} /> Dërgo kërkesën</>
                      }
                    </button>

                    <p className="text-xs text-gray-300 text-center">
                      Duke dërguar këtë formular, pranoni që Bashkia e Tiranës do të kontaktojë kafshën tuaj për strehim.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* MAP + HOURS */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <AnimatedSection>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-orange-50 h-full hover:shadow-md transition-all">
              <iframe
                title="Bashkia Tiranë"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.3!2d19.8183!3d41.3283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13503102861ec0e7%3A0x5a6ab3b41d3aad7b!2sSheshi%20Sk%C3%ABnderbej%2C%20Tiran%C3%AB!5e0!3m2!1ssq!2sal!4v1700000000000"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-5">
                <h3 className="font-bold text-gray-900 mb-1">Bashkia Tiranë</h3>
                <p className="text-sm text-gray-400">Sheshi "Skënderbej", Godina nr. 2, Tiranë 1001</p>
                <a href="https://maps.google.com/?q=Sheshi+Skenderbej+Bashkia+Tirane" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-red-500 hover:text-red-600 font-medium mt-2 inline-block transition-colors">
                  Hap në Google Maps →
                </a>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-50 h-full hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                  <Clock size={18} className="text-yellow-500" />
                </div>
                <h3 className="font-bold text-gray-900">Oraret e Punës</h3>
              </div>
              <div className="space-y-3">
                {[
                  { day: 'E Hënë – E Premte', time: '08:00 – 16:00', open: true },
                  { day: 'E Shtunë',          time: 'Mbyllur',        open: false },
                  { day: 'E Diel',            time: 'Mbyllur',        open: false },
                ].map(({ day, time, open }) => (
                  <div key={day} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-600">{day}</span>
                    <span className={`text-sm font-semibold ${open ? 'text-green-600' : 'text-gray-300'}`}>{time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 bg-red-50 rounded-xl p-4">
                <p className="text-xs text-red-600 font-medium">📞 Numri i gjelbër (pa pagesë)</p>
                <p className="text-xl font-bold text-red-700 mt-1">0800 0888</p>
                <p className="text-xs text-red-400 mt-0.5">E Hënë – E Premte, 08:00–16:00</p>
              </div>
            </div>
          </AnimatedSection>

        </div>
      </section>

    </div>
  )
}