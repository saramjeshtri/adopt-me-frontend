import { useRef, useEffect, useState } from 'react'
import { MapPin, Phone, Mail, Clock, Heart, CheckCircle, AlertCircle, ChevronDown, Upload, X, PawPrint } from 'lucide-react'
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

function FadeUp({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.06 })
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.55s ease, transform 0.55s ease',
    }}>{children}</div>
  )
}

export default function ContactPage() {
  const [form, setForm] = useState({
    owner_name: '', phone: '', email: '',
    species: '', breed: '', age: '',
    is_vaccinated: '', reason: '', notes: '',
  })
  const [photos, setPhotos] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
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
    const errors: Record<string, string> = {}
    if (!form.owner_name.trim()) errors.owner_name = 'Emri i plotë është i detyrueshëm.'
    if (!form.phone.trim()) errors.phone = 'Numri i telefonit është i detyrueshëm.'
    if (!form.species) errors.species = 'Ju lutem zgjidhni llojin e kafshës.'
    if (!form.reason) errors.reason = 'Ju lutem zgjidhni arsyen e dorëzimit.'
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return
    setError('')
    setSubmitting(true)
    try {
      const surrender = await createSurrender(form)
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

  const inputCls = (field?: string) => `w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all bg-gray-50 focus:bg-white ${field && fieldErrors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-gray-900'}`
  const labelCls = 'block text-xs font-semibold mb-1.5 uppercase tracking-wide' 

  return (
    <div style={{ backgroundColor: '#faf9f7', minHeight: '100vh' }}>

      {/* HERO */}
      <section className="relative overflow-hidden text-center" style={{ paddingTop: '7rem', paddingBottom: '5rem', background: 'linear-gradient(135deg, #1d4ed8 0%, #0e7490 100%)' }}>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 60%, #f5f0eb 100%)' }} />
        <FadeUp className="relative z-10 px-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}>
            <Phone size={28} style={{ color: 'white' }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 text-white">Na Kontaktoni</h1>
          <p className="max-w-md mx-auto text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Bashkia e Tiranës — Sektori i Mbrojtjes së Kafshëve. Jemi këtu për çdo pyetje.
          </p>
        </FadeUp>
      </section>

      {/* CONTACT CARDS */}
      <section className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: MapPin, label: 'Adresa', lines: ['Sheshi "Skënderbej", Godina nr. 2', 'Tiranë, 1001, Shqipëri'], bg: '#fef2f2', color: '#e02424' },
          { icon: Phone, label: 'Telefon', lines: ['0800 0888 (pa pagesë)', 'E Hënë – E Premte, 08:00–16:00'], bg: '#fefce8', color: '#ca8a04' },
          { icon: Mail, label: 'Email', lines: ['info@tirana.al', 'Përgjigje brenda 24 orëve'], bg: '#f0fdf4', color: '#16a34a' },
        ].map(({ icon: Icon, label, lines, bg, color }) => (
          <FadeUp key={label}>
            <div className="bg-white rounded-2xl p-6 flex items-start gap-4 h-full hover:-translate-y-1 transition-all duration-300 hover:shadow-lg" style={{ border: '1px solid #f3f4f6' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#9ca3af' }}>{label}</p>
                {lines.map((l, j) => (
                  <p key={j} className={j === 0 ? 'text-sm font-bold' : 'text-xs mt-0.5'} style={{ color: j === 0 ? '#111827' : '#9ca3af' }}>{l}</p>
                ))}
              </div>
            </div>
          </FadeUp>
        ))}
      </section>

      {/* SURRENDER FORM */}
      <section className="px-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: '#fef2f2' }}>
                <PawPrint size={28} style={{ color: '#e02424' }} />
              </div>
              <h2 className="text-3xl font-black mb-3" style={{ color: '#111827' }}>Dëshironi të dhuroni një kafshë?</h2>
              <p className="text-base leading-relaxed" style={{ color: '#6b7280' }}>
                Nëse nuk mundeni të kujdeseni më për kafshën tuaj, ne jemi këtu ta strehojmë me kujdes.
              </p>
            </div>
          </FadeUp>

          {submitted ? (
            <FadeUp>
              <div className="bg-white rounded-2xl p-12 text-center" style={{ border: '1px solid #f3f4f6' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f0fdf4' }}>
                  <CheckCircle size={32} style={{ color: '#16a34a' }} />
                </div>
                <h3 className="text-xl font-black mb-2" style={{ color: '#111827' }}>Faleminderit! 🐾</h3>
                <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: '#6b7280' }}>
                  Kërkesa juaj u dërgua me sukses. Ekipi ynë do t'ju kontaktojë brenda 24–48 orëve.
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ owner_name: '', phone: '', email: '', species: '', breed: '', age: '', is_vaccinated: '', reason: '', notes: '' }); setPhotos([]) }}
                  className="mt-6 text-sm font-semibold cursor-pointer transition-colors hover:opacity-70" style={{ color: '#e02424' }}>
                  Dërgoni kërkesë tjetër
                </button>
              </div>
            </FadeUp>
          ) : (
            <FadeUp>
              <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #f3f4f6', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

                {/* Step 1 */}
                <div className="p-6 md:p-8" style={{ borderBottom: '1px solid #f9fafb' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white" style={{ backgroundColor: '#111827' }}>1</div>
                    <h3 className="font-black" style={{ color: '#111827' }}>Informacioni juaj</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className={labelCls} style={{ color: '#6b7280' }}>Emri i plotë</label>
                      <input placeholder="p.sh. Arta Kelmendi" value={form.owner_name}
                        onChange={e => { setF('owner_name', e.target.value); setFieldErrors(f => ({ ...f, owner_name: '' })) }}
                        className={inputCls('owner_name')} />
                      {fieldErrors.owner_name && <p className="text-xs mt-1" style={{ color: '#e02424' }}>{fieldErrors.owner_name}</p>}
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: '#6b7280' }}>Telefon</label>
                      <input placeholder="06X XXX XXXX" value={form.phone}
                        onChange={e => { setF('phone', e.target.value); setFieldErrors(f => ({ ...f, phone: '' })) }}
                        className={inputCls('phone')} />
                      {fieldErrors.phone && <p className="text-xs mt-1" style={{ color: '#e02424' }}>{fieldErrors.phone}</p>}
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: '#6b7280' }}>Email (opsionale)</label>
                      <input placeholder="email@shembull.al" value={form.email}
                        onChange={e => setF('email', e.target.value)} className={inputCls()} />
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-6 md:p-8" style={{ borderBottom: '1px solid #f9fafb' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white" style={{ backgroundColor: '#111827' }}>2</div>
                    <h3 className="font-black" style={{ color: '#111827' }}>Detajet e kafshës</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls} style={{ color: '#6b7280' }}>Lloji</label>
                      <div className="relative">
                        <select value={form.species} onChange={e => { setF('species', e.target.value); setFieldErrors(f => ({ ...f, species: '' })) }}
                          className={`${inputCls('species')} appearance-none pr-10 cursor-pointer`}>
                          <option value="">Zgjidhni llojin...</option>
                          {SPECIES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9ca3af' }} />
                      </div>
                      {fieldErrors.species && <p className="text-xs mt-1" style={{ color: '#e02424' }}>{fieldErrors.species}</p>}
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: '#6b7280' }}>Raca (opsionale)</label>
                      <input placeholder="p.sh. Labrador..." value={form.breed}
                        onChange={e => setF('breed', e.target.value)} className={inputCls()} />
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: '#6b7280' }}>Mosha e përafërt</label>
                      <input placeholder="p.sh. 3 vjeç, 6 muaj..." value={form.age}
                        onChange={e => setF('age', e.target.value)} className={inputCls()} />
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: '#6b7280' }}>E vaksinuar?</label>
                      <div className="relative">
                        <select value={form.is_vaccinated} onChange={e => setF('is_vaccinated', e.target.value)}
                          className={`${inputCls()} appearance-none pr-10 cursor-pointer`}>
                          <option value="">Zgjidhni...</option>
                          <option value="po">Po</option>
                          <option value="jo">Jo</option>
                          <option value="nuk_di">Nuk e di</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9ca3af' }} />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls} style={{ color: '#6b7280' }}>Foto të kafshës (maks. 3)</label>
                      <div onClick={() => fileRef.current?.click()}
                        className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:border-gray-400"
                        style={{ borderColor: '#e5e7eb' }}>
                        <Upload size={20} className="mx-auto mb-2" style={{ color: '#d1d5db' }} />
                        <p className="text-sm" style={{ color: '#9ca3af' }}>Kliko për të ngarkuar foto</p>
                        <p className="text-xs mt-0.5" style={{ color: '#d1d5db' }}>JPEG, PNG • Maks. 3 foto</p>
                      </div>
                      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handlePhotos} />
                      {photos.length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {photos.map((f, i) => (
                            <div key={i} className="relative">
                              <img src={URL.createObjectURL(f)} alt="" className="w-16 h-16 rounded-xl object-cover" style={{ border: '2px solid #f3f4f6' }} />
                              <button onClick={() => setPhotos(p => p.filter((_, j) => j !== i))}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors hover:opacity-80"
                                style={{ backgroundColor: '#e02424' }}>
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white" style={{ backgroundColor: '#111827' }}>3</div>
                    <h3 className="font-black" style={{ color: '#111827' }}>Arsyeja e dorëzimit</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls} style={{ color: '#6b7280' }}>Arsyeja kryesore</label>
                      <div className="relative">
                        <select value={form.reason} onChange={e => { setF('reason', e.target.value); setFieldErrors(f => ({ ...f, reason: '' })) }}
                          className={`${inputCls('reason')} appearance-none pr-10 cursor-pointer`}>
                          <option value="">Zgjidhni arsyen...</option>
                          {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9ca3af' }} />
                      </div>
                      {fieldErrors.reason && <p className="text-xs mt-1" style={{ color: '#e02424' }}>{fieldErrors.reason}</p>}
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: '#6b7280' }}>Shënime shtesë (opsionale)</label>
                      <textarea placeholder="Çdo informacion tjetër të rëndësishëm..." value={form.notes}
                        onChange={e => setF('notes', e.target.value)}
                        rows={3} className={`${inputCls()} resize-none`} />
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 text-sm rounded-xl px-4 py-3" style={{ backgroundColor: '#fef2f2', color: '#e02424', border: '1px solid #fecaca' }}>
                        <AlertCircle size={14} /> {error}
                      </div>
                    )}
                    <button onClick={handleSubmit} disabled={submitting}
                      className="w-full text-white py-4 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: '#e02424' }}>
                      {submitting
                        ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Duke dërguar...</>
                        : <><Heart size={15} /> Dërgo kërkesën</>
                      }
                    </button>
                    <p className="text-xs text-center" style={{ color: '#d1d5db' }}>
                      Duke dërguar këtë formular, pranoni që Bashkia e Tiranës do të kontaktojë kafshën tuaj për strehim.
                    </p>
                  </div>
                </div>
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      {/* MAP + HOURS */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          <FadeUp className="h-full">
            <div className="bg-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-lg h-full" style={{ border: '1px solid #f3f4f6' }}>
              <iframe title="Bashkia Tiranë"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.3!2d19.8183!3d41.3283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13503102861ec0e7%3A0x5a6ab3b41d3aad7b!2sSheshi%20Sk%C3%ABnderbej%2C%20Tiran%C3%AB!5e0!3m2!1ssq!2sal!4v1700000000000"
                width="100%" height="200" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              <div className="p-5">
                <h3 className="font-bold mb-1" style={{ color: '#111827' }}>Bashkia Tiranë</h3>
                <p className="text-sm" style={{ color: '#6b7280' }}>Sheshi "Skënderbej", Godina nr. 2, Tiranë 1001</p>
                <a href="https://maps.google.com/?q=Sheshi+Skenderbej+Bashkia+Tirane" target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold mt-2 inline-block transition-colors hover:opacity-70" style={{ color: '#e02424' }}>
                  Hap në Google Maps →
                </a>
              </div>
            </div>
          </FadeUp>

          <FadeUp>
            <div className="bg-white rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg h-full" style={{ border: '1px solid #f3f4f6' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#fefce8' }}>
                  <Clock size={18} style={{ color: '#ca8a04' }} />
                </div>
                <h3 className="font-bold" style={{ color: '#111827' }}>Oraret e Punës</h3>
              </div>
              <div className="space-y-3">
                {[
                  { day: 'E Hënë – E Premte', time: '08:00 – 16:00', open: true },
                  { day: 'E Shtunë', time: 'Mbyllur', open: false },
                  { day: 'E Diel', time: 'Mbyllur', open: false },
                ].map(({ day, time, open }) => (
                  <div key={day} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid #f9fafb' }}>
                    <span className="text-sm" style={{ color: '#374151' }}>{day}</span>
                    <span className="text-sm font-bold" style={{ color: open ? '#16a34a' : '#d1d5db' }}>{time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl p-4" style={{ backgroundColor: '#fef2f2' }}>
                <p className="text-xs font-semibold" style={{ color: '#e02424' }}>📞 Numri i gjelbër (pa pagesë)</p>
                <p className="text-2xl font-black mt-1" style={{ color: '#e02424' }}>0800 0888</p>
                <p className="text-xs mt-0.5" style={{ color: '#fca5a5' }}>E Hënë – E Premte, 08:00–16:00</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}