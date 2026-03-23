import { useState, useRef, useEffect } from 'react'
import { Shield, MapPin, Phone, Mail, Camera, ChevronRight, ChevronLeft, CheckCircle, AlertTriangle, Search, X, Image, Video, Siren, SearchX, Zap, HeartPulse, HeartCrack, ClipboardList } from 'lucide-react'
import { createReport, uploadReportMedia } from '../../api/client'

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
      transform: visible ? 'translateY(0)' : 'translateY(26px)',
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
    }}>{children}</div>
  )
}

const REPORT_TYPES = [
  { value: 'Abuzim me kafshë',   label: 'Abuzim me kafshë',   icon: Siren,         color: 'text-red-600',    bg: 'bg-red-50',    desc: 'Keqtrajtim ose dhunë ndaj kafshës' },
  { value: 'Kafshë e humbur',    label: 'Kafshë e humbur',    icon: SearchX,       color: 'text-blue-600',   bg: 'bg-blue-50',   desc: 'Kafshë shtëpiake e humbur' },
  { value: 'Kafshë agresive',    label: 'Kafshë agresive',    icon: Zap,           color: 'text-orange-600', bg: 'bg-orange-50', desc: 'Kafshë që paraqet rrezik publik' },
  { value: 'Kafshë e lënduar',   label: 'Kafshë e lënduar',   icon: HeartPulse,    color: 'text-pink-600',   bg: 'bg-pink-50',   desc: 'Kafshë që ka nevojë për ndihmë mjekësore' },
  { value: 'Braktisje kafshësh', label: 'Braktisje kafshësh', icon: HeartCrack,    color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Kafshë e braktisur nga pronari' },
  { value: 'Tjetër',             label: 'Tjetër',             icon: ClipboardList, color: 'text-gray-600',   bg: 'bg-gray-50',   desc: 'Raste të tjera që kanë nevojë për vëmendje' },
]

const STEPS = ['Lloji', 'Detajet', 'Kontakti', 'Konfirmo']

interface FormData {
  report_type: string
  report_description: string
  location_address: string
  latitude: number
  longitude: number
  phoneNr: string
  email: string
  photoUrl: string
}

export default function ReportPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>({
    report_type: '', report_description: '', location_address: '',
    latitude: 41.3275, longitude: 19.8187, phoneNr: '', email: '', photoUrl: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [reportId, setReportId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)

  const validatePhone = (v: string) => {
    if (!v) return null
    const cleaned = v.replace(/\s/g, '')
    if (!/^(\+355|0)[6-9]\d{7,8}$/.test(cleaned)) return 'Numri i telefonit duhet të jetë valid shqiptar (p.sh. +355 69 XXX XXXX)'
    return null
  }
  const validateEmail = (v: string) => {
    if (!v) return null
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Adresa email nuk është e vlefshme'
    return null
  }

  const set = (key: keyof FormData, value: string | number) =>
    setForm(f => ({ ...f, [key]: value }))

  const canNext = () => {
    if (step === 0) return !!form.report_type
    if (step === 1) return form.report_description.length >= 10 && !!form.location_address
    if (step === 2) return !validatePhone(form.phoneNr) && !validateEmail(form.email)
    return true
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const res = await createReport({
        report_type: form.report_type, report_description: form.report_description,
        location_address: form.location_address, latitude: form.latitude, longitude: form.longitude,
        phoneNr: form.phoneNr || undefined, email: form.email || undefined,
      })
      const newReportId = res.report_id
      setReportId(newReportId)
      if (mediaFiles.length > 0) {
        for (let i = 0; i < mediaFiles.length; i++) {
          setUploadProgress(`Duke ngarkuar skedarin ${i + 1} nga ${mediaFiles.length}...`)
          try { await uploadReportMedia(newReportId, mediaFiles[i]) } catch {}
        }
        setUploadProgress(null)
      }
      setSubmitted(true)
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Diçka shkoi keq. Provoni përsëri.')
    } finally {
      setSubmitting(false)
      setUploadProgress(null)
    }
  }

  return (
    <div style={{ backgroundColor: '#f5f0eb', minHeight: '100vh' }}>

      {/* HERO */}
      <FadeUp>
        <section className="relative overflow-hidden text-center" style={{ paddingTop: '7rem', paddingBottom: '5rem', background: 'linear-gradient(135deg, #b91c1c 0%, #c2410c 100%)' }}>
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 60%, #f5f0eb 100%)' }} />
          <div className="relative z-10 px-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}>
              <Shield size={28} style={{ color: 'white' }} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-3 text-white">Raporto një Rast</h1>
            <p className="max-w-lg mx-auto text-sm md:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Ndihmoni kafshët në nevojë. Raportet tuaja dërgohen automatikisht te departamenti i duhur i Bashkisë së Tiranës.
            </p>
            <a href="/track"
              className="inline-flex items-center gap-1.5 mt-5 text-xs font-semibold px-4 py-2 rounded-full transition-all hover:opacity-80"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
              <Search size={12} /> Keni raportuar më parë? Gjurmoni statusin →
            </a>
          </div>
        </section>
      </FadeUp>

      <FadeUp delay={150}>
        <div className="max-w-xl mx-auto px-5 md:px-8 py-10">

          {/* Stepper */}
          {!submitted && (
            <div className="flex justify-center mb-8">
              <div className="flex items-center" style={{ width: '260px' }}>
                {STEPS.map((label, i) => (
                  <div key={i} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                        style={i < step
                          ? { backgroundColor: '#16a34a', color: 'white' }
                          : i === step
                          ? { backgroundColor: '#e02424', color: 'white', boxShadow: '0 2px 8px rgba(224,36,36,0.35)' }
                          : { backgroundColor: '#e5e7eb', color: '#9ca3af' }}>
                        {i < step ? '✓' : i + 1}
                      </div>
                      <span className="text-[10px] mt-1 font-semibold whitespace-nowrap transition-colors"
                        style={{ color: i === step ? '#e02424' : i < step ? '#16a34a' : '#9ca3af' }}>
                        {label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="flex-1 h-0.5 mx-1.5 mb-4 rounded-full transition-colors"
                        style={{ backgroundColor: i < step ? '#bbf7d0' : '#e5e7eb' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success */}
          {submitted ? (
            <div className="bg-white rounded-2xl p-8 md:p-10 text-center" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: '#f0fdf4' }}>
                <CheckCircle size={40} style={{ color: '#16a34a' }} />
              </div>
              <h2 className="text-2xl font-black mb-2" style={{ color: '#111827' }}>Raporti u dërgua!</h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#6b7280' }}>
                Faleminderit për raportimin. Stafi i Bashkisë do të shqyrtojë rastin tuaj dhe do të ndërhyjë sa më shpejt.
              </p>
              {reportId && (
                <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                  <p className="text-xs mb-1 uppercase tracking-wide" style={{ color: '#9ca3af' }}>ID e raportit tuaj</p>
                  <p className="text-4xl font-black mb-1" style={{ color: '#e02424' }}>#{reportId}</p>
                  <p className="text-xs" style={{ color: '#9ca3af' }}>Ruajeni këtë numër — do ta keni nevojë për të gjurmuar statusin</p>
                </div>
              )}
              <a href={`/track?id=${reportId}`}
                className="flex items-center justify-center gap-2 w-full text-white px-6 py-4 rounded-2xl font-bold text-sm transition-all mb-3 hover:opacity-90"
                style={{ backgroundColor: '#e02424', boxShadow: '0 4px 16px rgba(224,36,36,0.3)' }}>
                <Search size={16} /> Gjurmo statusin e raportit tënd
              </a>
              <button onClick={() => {
                setSubmitted(false); setReportId(null); setStep(0); setMediaFiles([])
                setForm({ report_type: '', report_description: '', location_address: '', latitude: 41.3275, longitude: 19.8187, phoneNr: '', email: '', photoUrl: '' })
              }}
                className="w-full px-6 py-3 rounded-2xl font-semibold text-sm transition-all cursor-pointer"
                style={{ border: '1px solid #e5e7eb', color: '#6b7280', backgroundColor: 'transparent' }}>
                Raporto rast tjetër
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 md:p-8" style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>

              {/* STEP 0 — Type */}
              {step === 0 && (
                <div>
                  <h2 className="text-xl font-black mb-1" style={{ color: '#111827' }}>Çfarë dëshironi të raportoni?</h2>
                  <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Zgjidhni kategorinë që përshkruan më mirë situatën.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {REPORT_TYPES.map(rt => (
                      <button key={rt.value} onClick={() => set('report_type', rt.value)}
                        className="text-left p-4 rounded-2xl border-2 transition-all cursor-pointer"
                        style={form.report_type === rt.value
                          ? { borderColor: '#e02424', backgroundColor: '#fef2f2' }
                          : { borderColor: '#f3f4f6', backgroundColor: '#fafafa' }}>
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-xl shrink-0" style={{ backgroundColor: form.report_type === rt.value ? '#fecaca' : '#f3f4f6' }}>
                            <rt.icon size={18} className={form.report_type === rt.value ? 'text-red-600' : rt.color} />
                          </div>
                          <div>
                            <p className="font-bold text-sm" style={{ color: form.report_type === rt.value ? '#e02424' : '#111827' }}>{rt.label}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{rt.desc}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 1 — Details */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-black mb-1" style={{ color: '#111827' }}>Detajet e rastit</h2>
                  <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Sa më shumë detaje të jepni, aq më shpejt mund të ndihmojmë.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide mb-2 block" style={{ color: '#9ca3af' }}>Përshkrimi i situatës *</label>
                      <textarea value={form.report_description} onChange={e => set('report_description', e.target.value)}
                        rows={4} placeholder="Përshkruani çfarë keni parë, gjendjen e kafshës..."
                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none resize-none transition-colors"
                        style={{ border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#111827' }} />
                      <p className="text-xs mt-1" style={{ color: form.report_description.length < 10 ? '#d1d5db' : '#16a34a' }}>
                        {form.report_description.length}/10 karaktere minimale
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide mb-2 block" style={{ color: '#9ca3af' }}>
                        <MapPin size={12} className="inline mr-1" /> Adresa e vendndodhjes *
                      </label>
                      <input type="text" value={form.location_address} onChange={e => set('location_address', e.target.value)}
                        placeholder="p.sh. Rruga e Elbasanit, afër parkut, Tiranë"
                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                        style={{ border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#111827' }} />
                    </div>
                    <LocationButton form={form} setForm={setForm} />
                    {/* Media Upload */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide mb-2 block" style={{ color: '#9ca3af' }}>
                        <Camera size={12} className="inline mr-1" /> Foto / Video <span className="font-normal normal-case" style={{ color: '#d1d5db' }}>(opsionale)</span>
                      </label>
                      <div onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed rounded-2xl px-4 py-5 text-center cursor-pointer transition-all"
                        style={{ borderColor: '#e5e7eb' }}>
                        <Camera size={22} className="mx-auto mb-2" style={{ color: '#d1d5db' }} />
                        <p className="text-sm" style={{ color: '#9ca3af' }}>Klikoni për të ngarkuar foto ose video</p>
                        <p className="text-xs mt-1" style={{ color: '#d1d5db' }}>JPEG, PNG, WebP, MP4, MOV · maks 10MB</p>
                      </div>
                      <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
                        className="hidden" onChange={e => {
                          const files = Array.from(e.target.files || [])
                          setMediaFiles(prev => {
                            const existing = new Set(prev.map(f => f.name + f.size))
                            return [...prev, ...files.filter(f => !existing.has(f.name + f.size))].slice(0, 5)
                          })
                          e.target.value = ''
                        }} />
                      {mediaFiles.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {mediaFiles.map((file, i) => (
                            <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#fef2f2' }}>
                                {file.type.startsWith('video/') ? <Video size={14} style={{ color: '#e02424' }} /> : <Image size={14} style={{ color: '#e02424' }} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate" style={{ color: '#374151' }}>{file.name}</p>
                                <p className="text-xs" style={{ color: '#9ca3af' }}>{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                              </div>
                              <button onClick={() => setMediaFiles(prev => prev.filter((_, j) => j !== i))} className="cursor-pointer" style={{ color: '#d1d5db' }}>
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 — Contact */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-black mb-1" style={{ color: '#111827' }}>Informacioni juaj</h2>
                  <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Opsionale, por ndihmon stafin të ju kontaktojë për detaje shtesë.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide mb-2 block" style={{ color: '#9ca3af' }}>
                        <Phone size={12} className="inline mr-1" /> Numri i telefonit
                      </label>
                      <input type="tel" value={form.phoneNr} onChange={e => { set('phoneNr', e.target.value); setPhoneError(validatePhone(e.target.value)) }}
                        onBlur={e => setPhoneError(validatePhone(e.target.value))}
                        placeholder="+355 6X XXX XXXX"
                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                        style={{ border: `1px solid ${phoneError ? '#f87171' : '#e5e7eb'}`, backgroundColor: '#f9fafb', color: '#111827' }} />
                      {phoneError && <p className="text-xs mt-1.5 font-medium" style={{ color: '#dc2626' }}>{phoneError}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide mb-2 block" style={{ color: '#9ca3af' }}>
                        <Mail size={12} className="inline mr-1" /> Adresa email
                      </label>
                      <input type="email" value={form.email} onChange={e => { set('email', e.target.value); setEmailError(validateEmail(e.target.value)) }}
                        onBlur={e => setEmailError(validateEmail(e.target.value))}
                        placeholder="juaji@email.com"
                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                        style={{ border: `1px solid ${emailError ? '#f87171' : '#e5e7eb'}`, backgroundColor: '#f9fafb', color: '#111827' }} />
                      {emailError && <p className="text-xs mt-1.5 font-medium" style={{ color: '#dc2626' }}>{emailError}</p>}
                    </div>
                    <div className="rounded-2xl px-4 py-3 flex gap-2 text-xs" style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#92400e' }}>
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      <span>Informacioni juaj do të përdoret vetëm nga stafi i Bashkisë dhe nuk do të ndahet me palë të treta.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 — Confirm */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-black mb-1" style={{ color: '#111827' }}>Konfirmoni raportin</h2>
                  <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Kontrolloni informacionin para se ta dërgoni.</p>
                  {error && (
                    <div className="rounded-xl px-4 py-3 mb-5 flex gap-2 text-sm" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#e02424' }}>
                      <AlertTriangle size={16} className="shrink-0" /> {error}
                    </div>
                  )}
                  <div className="space-y-1 rounded-2xl overflow-hidden" style={{ border: '1px solid #f3f4f6' }}>
                    <SummaryRow label="Lloji i raportit" value={form.report_type} />
                    <SummaryRow label="Adresa" value={form.location_address} />
                    <SummaryRow label="Koordinatat" value={`${form.latitude.toFixed(4)}, ${form.longitude.toFixed(4)}`} />
                    <SummaryRow label="Përshkrimi" value={form.report_description} multiline />
                    {form.phoneNr && <SummaryRow label="Telefon" value={form.phoneNr} />}
                    {form.email   && <SummaryRow label="Email"   value={form.email} />}
                  </div>
                  <div className="mt-5 rounded-xl px-4 py-3 text-xs leading-relaxed" style={{ backgroundColor: '#f9fafb', color: '#9ca3af' }}>
                    Duke dërguar këtë raport, ju konfirmoni se informacioni i dhënë është i saktë dhe se raportet e rreme mund të kenë pasoja ligjore.
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className={`flex mt-8 gap-3 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
                {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer"
                    style={{ border: '1px solid #e5e7eb', color: '#6b7280', backgroundColor: 'white' }}>
                    <ChevronLeft size={16} /> Prapa
                  </button>
                )}
                {step < STEPS.length - 1 ? (
                  <button onClick={() => { if (canNext()) setStep(s => s + 1) }} disabled={!canNext()}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer text-white"
                    style={{ backgroundColor: canNext() ? '#e02424' : '#fca5a5', cursor: canNext() ? 'pointer' : 'not-allowed' }}>
                    Vazhdo <ChevronRight size={16} />
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={submitting}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer text-white"
                    style={{ backgroundColor: submitting ? '#fca5a5' : '#e02424', boxShadow: '0 4px 16px rgba(224,36,36,0.3)' }}>
                    {submitting
                      ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {uploadProgress || 'Duke dërguar...'}</>
                      : <><Shield size={15} /> Dërgo raportin{mediaFiles.length > 0 ? ` + ${mediaFiles.length} skedar` : ''}</>
                    }
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </FadeUp>
    </div>
  )
}

function SummaryRow({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="flex gap-3 px-4 py-3" style={{ borderBottom: '1px solid #f9fafb' }}>
      <span className="text-xs font-bold uppercase tracking-wide w-28 shrink-0 pt-0.5" style={{ color: '#9ca3af' }}>{label}</span>
      <span className={`text-sm flex-1 ${multiline ? 'whitespace-pre-wrap' : ''}`} style={{ color: '#374151' }}>{value || '—'}</span>
    </div>
  )
}

function LocationButton({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  const [locState, setLocState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [skipped, setSkipped] = useState(false)

  const handleGetLocation = () => {
    if (!navigator.geolocation) { setLocState('error'); return }
    setSkipped(false); setLocState('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => { setForm(f => ({ ...f, latitude: pos.coords.latitude, longitude: pos.coords.longitude })); setLocState('success') },
      () => setLocState('error'),
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  const handleSkip = () => { setSkipped(true); setLocState('idle'); setForm(f => ({ ...f, latitude: 41.3275, longitude: 19.8187 })) }

  if (skipped) return (
    <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
      <p className="text-sm" style={{ color: '#9ca3af' }}>Vendndodhja GPS u anashkalua</p>
      <button onClick={() => setSkipped(false)} className="text-xs cursor-pointer" style={{ color: '#e02424' }}>Shto vendndodhjen</button>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold uppercase tracking-wide" style={{ color: '#9ca3af' }}>
          <MapPin size={12} className="inline mr-1" /> Vendndodhja GPS <span className="font-normal normal-case" style={{ color: '#d1d5db' }}>(opsionale)</span>
        </label>
        <button onClick={handleSkip} className="text-xs cursor-pointer" style={{ color: '#9ca3af' }}>Kalo →</button>
      </div>
      <button onClick={handleGetLocation} disabled={locState === 'loading'}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-sm font-medium transition-all cursor-pointer"
        style={locState === 'success'
          ? { borderColor: '#bbf7d0', backgroundColor: '#f0fdf4', color: '#16a34a' }
          : locState === 'error'
          ? { borderColor: '#fecaca', backgroundColor: '#fef2f2', color: '#e02424' }
          : { borderColor: '#e5e7eb', backgroundColor: '#f9fafb', color: '#6b7280' }}>
        {locState === 'loading' && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
        {locState === 'success' && '✅'}
        {locState === 'error'   && <AlertTriangle size={14} />}
        {locState === 'idle'    && <MapPin size={15} />}
        {locState === 'idle'    && 'Përdor vendndodhjen time aktuale'}
        {locState === 'loading' && 'Duke gjetur vendndodhjen...'}
        {locState === 'success' && `Vendndodhja u gjet (${form.latitude.toFixed(4)}, ${form.longitude.toFixed(4)})`}
        {locState === 'error'   && 'Nuk mund të gjendej — provoni përsëri'}
      </button>
      <p className="text-xs mt-1.5" style={{ color: '#d1d5db' }}>Nëse nuk jeni në vendngjarje, mund ta kaloni këtë hap.</p>
    </div>
  )
}