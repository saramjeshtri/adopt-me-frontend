import { useState, useRef } from 'react'
import { Shield, MapPin, Phone, Mail, Camera, ChevronRight, ChevronLeft, CheckCircle, AlertTriangle, Search, X, Image, Video } from 'lucide-react'
import { createReport, uploadReportMedia } from '../../api/client'

const REPORT_TYPES = [
  { value: 'Abuzim me kafshë',   label: 'Abuzim me kafshë',   emoji: '🚨', desc: 'Keqtrajtim ose dhunë ndaj kafshës' },
  { value: 'Kafshë e humbur',    label: 'Kafshë e humbur',    emoji: '🔍', desc: 'Kafshë shtëpiake e humbur' },
  { value: 'Kafshë agresive',    label: 'Kafshë agresive',    emoji: '⚠️', desc: 'Kafshë që paraqet rrezik publik' },
  { value: 'Kafshë e lënduar',   label: 'Kafshë e lënduar',   emoji: '🏥', desc: 'Kafshë që ka nevojë për ndihmë mjekësore' },
  { value: 'Braktisje kafshësh', label: 'Braktisje kafshësh', emoji: '💔', desc: 'Kafshë e braktisur nga pronari' },
  { value: 'Tjetër',             label: 'Tjetër',             emoji: '📋', desc: 'Raste të tjera që kanë nevojë për vëmendje' },
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
    report_type: '',
    report_description: '',
    location_address: '',
    latitude: 41.3275,
    longitude: 19.8187,
    phoneNr: '',
    email: '',
    photoUrl: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [reportId, setReportId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const set = (key: keyof FormData, value: string | number) =>
    setForm(f => ({ ...f, [key]: value }))

  const canNext = () => {
    if (step === 0) return !!form.report_type
    if (step === 1) return form.report_description.length >= 10 && !!form.location_address
    if (step === 2) return true // contact is optional but good
    return true
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      // Step 1: Create the report
      const res = await createReport({
        report_type:        form.report_type,
        report_description: form.report_description,
        location_address:   form.location_address,
        latitude:           form.latitude,
        longitude:          form.longitude,
        phoneNr:            form.phoneNr || undefined,
        email:              form.email   || undefined,
      })
      const newReportId = res.report_id
      setReportId(newReportId)

      // Step 2: Upload media files one by one
      if (mediaFiles.length > 0) {
        for (let i = 0; i < mediaFiles.length; i++) {
          setUploadProgress(`Duke ngarkuar skedarin ${i + 1} nga ${mediaFiles.length}...`)
          try {
            await uploadReportMedia(newReportId, mediaFiles[i])
          } catch {
            // Don't fail the whole submission if a file upload fails
          }
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
    <div style={{ backgroundColor: '#fdf6f0' }} className="min-h-screen">

      {/* HERO */}
      <section className="bg-gray-900 py-12 md:py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #dc2626 0%, transparent 50%), radial-gradient(circle at 80% 50%, #1d4ed8 0%, transparent 50%)' }}
        />
        <div className="relative z-10 px-4">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-red-600 rounded-2xl mb-4 shadow-xl shadow-red-900/50">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            Raporto një Rast
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto text-sm md:text-base">
            Ndihmoni kafshët në nevojë. Raportet tuaja dërgohen automatikisht
            te departamenti i duhur i Bashkisë së Tiranës.
          </p>
          <a
            href="/track"
            className="inline-flex items-center gap-1.5 mt-4 text-xs text-gray-500 hover:text-white transition-colors border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-full"
          >
            <Search size={12} /> Keni raportuar më parë? Gjurmoni statusin →
          </a>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-10">

        {/* Stepper — between hero and card */}
        {!submitted && (
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center w-full max-w-sm">
              {STEPS.map((label, i) => (
                <div key={i} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold transition-all
                      ${i < step   ? 'bg-green-500 text-white shadow-md'
                      : i === step ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                      : 'bg-gray-200 text-gray-400'}`}
                    >
                      {i < step ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs mt-1.5 font-semibold whitespace-nowrap transition-colors
                      ${i === step ? 'text-red-600' : i < step ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-1 mx-3 mb-5 rounded-full transition-colors ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success state */}
        {submitted ? (
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-orange-50 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Raporti u dërgua!</h2>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              Faleminderit për raportimin. Stafi i Bashkisë do të shqyrtojë rastin tuaj dhe do të ndërhyjë sa më shpejt.
            </p>

            {reportId && (
              <div className="bg-orange-50 rounded-2xl p-5 mb-6">
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">ID e raportit tuaj</p>
                <p className="text-4xl font-bold text-red-600 mb-1">#{reportId}</p>
                <p className="text-xs text-gray-400">
                  📋 Ruajeni këtë numër — do ta keni nevojë për të gjurmuar statusin
                </p>
              </div>
            )}

            <a
              href={`/track?id=${reportId}`}
              className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl font-semibold text-sm transition-all mb-3 shadow-lg shadow-red-100"
            >
              <Search size={16} /> Gjurmo statusin e raportit tënd
            </a>

            <button
              onClick={() => {
                setSubmitted(false)
                setReportId(null)
                setStep(0)
                setMediaFiles([])
                setForm({
                  report_type: '', report_description: '', location_address: '',
                  latitude: 41.3275, longitude: 19.8187, phoneNr: '', email: '', photoUrl: '',
                })
              }}
              className="w-full border border-gray-200 text-gray-500 hover:bg-gray-50 px-6 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer"
            >
              Raporto rast tjetër
            </button>
          </div>
        ) : (
          <>
            {/* Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-orange-50 p-6 md:p-8">

              {/* STEP 0 — Type */}
              {step === 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Çfarë dëshironi të raportoni?</h2>
                  <p className="text-gray-400 text-sm mb-6">Zgjidhni kategorinë që përshkruan më mirë situatën.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {REPORT_TYPES.map(rt => (
                      <button
                        key={rt.value}
                        onClick={() => set('report_type', rt.value)}
                        className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer
                          ${form.report_type === rt.value
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-100 hover:border-red-200 hover:bg-orange-50/50'}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{rt.emoji}</span>
                          <div>
                            <p className={`font-semibold text-sm ${form.report_type === rt.value ? 'text-red-700' : 'text-gray-800'}`}>
                              {rt.label}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{rt.desc}</p>
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
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Detajet e rastit</h2>
                  <p className="text-gray-400 text-sm mb-6">
                    Sa më shumë detaje të jepni, aq më shpejt mund të ndihmojmë.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                        Përshkrimi i situatës *
                      </label>
                      <textarea
                        value={form.report_description}
                        onChange={e => set('report_description', e.target.value)}
                        rows={4}
                        placeholder="Përshkruani çfarë keni parë, gjendjen e kafshës, çdo detaj që mund të ndihmojë..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 bg-gray-50 resize-none transition-colors"
                      />
                      <p className={`text-xs mt-1 ${form.report_description.length < 10 ? 'text-gray-300' : 'text-green-500'}`}>
                        {form.report_description.length}/10 karaktere minimale
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                        <MapPin size={12} className="inline mr-1" /> Adresa e vendndodhjes *
                      </label>
                      <input
                        type="text"
                        value={form.location_address}
                        onChange={e => set('location_address', e.target.value)}
                        placeholder="p.sh. Rruga e Elbasanit, afër parkut, Tiranë"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 bg-gray-50 transition-colors"
                      />
                    </div>

                    <LocationButton form={form} setForm={setForm} />

                    {/* Media Upload */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                        <Camera size={12} className="inline mr-1" /> Foto / Video
                        <span className="ml-1 text-gray-300 font-normal normal-case">(opsionale)</span>
                      </label>

                      {/* Drop zone */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-gray-200 rounded-xl px-4 py-5 text-center cursor-pointer hover:border-red-300 hover:bg-orange-50/50 transition-all"
                      >
                        <Camera size={22} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-sm text-gray-400">Klikoni për të ngarkuar foto ose video</p>
                        <p className="text-xs text-gray-300 mt-1">JPEG, PNG, WebP, MP4, MOV · maks 10MB</p>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
                        className="hidden"
                        onChange={e => {
                          const files = Array.from(e.target.files || [])
                          setMediaFiles(prev => {
                            const existing = new Set(prev.map(f => f.name + f.size))
                            const newFiles = files.filter(f => !existing.has(f.name + f.size))
                            return [...prev, ...newFiles].slice(0, 5) // max 5 files
                          })
                          e.target.value = ''
                        }}
                      />

                      {/* Preview selected files */}
                      {mediaFiles.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {mediaFiles.map((file, i) => {
                            const isVideo = file.type.startsWith('video/')
                            const sizeMB = (file.size / 1024 / 1024).toFixed(1)
                            return (
                              <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                                  {isVideo
                                    ? <Video size={14} className="text-red-400" />
                                    : <Image size={14} className="text-red-400" />
                                  }
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-700 truncate">{file.name}</p>
                                  <p className="text-xs text-gray-400">{sizeMB} MB</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setMediaFiles(prev => prev.filter((_, j) => j !== i))}
                                  className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer shrink-0"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            )
                          })}
                          {mediaFiles.length < 5 && (
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-xs text-red-500 hover:text-red-600 cursor-pointer transition-colors"
                            >
                              + Shto skedar tjetër ({mediaFiles.length}/5)
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 — Contact */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Informacioni juaj</h2>
                  <p className="text-gray-400 text-sm mb-6">
                    Opsionale, por ndihmon stafin të ju kontaktojë për detaje shtesë.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                        <Phone size={12} className="inline mr-1" /> Numri i telefonit
                      </label>
                      <input
                        type="tel"
                        value={form.phoneNr}
                        onChange={e => set('phoneNr', e.target.value)}
                        placeholder="+355 6X XXX XXXX"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 bg-gray-50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                        <Mail size={12} className="inline mr-1" /> Adresa email
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => set('email', e.target.value)}
                        placeholder="juaji@email.com"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 bg-gray-50 transition-colors"
                      />
                    </div>

                    <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 flex gap-2 text-xs text-orange-700">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      <span>
                        Informacioni juaj do të përdoret vetëm nga stafi i Bashkisë dhe nuk do të ndahet me palë të treta.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 — Confirm */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Konfirmoni raportin</h2>
                  <p className="text-gray-400 text-sm mb-6">
                    Kontrolloni informacionin para se ta dërgoni.
                  </p>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5 flex gap-2">
                      <AlertTriangle size={16} className="shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="space-y-3">
                    <SummaryRow label="Lloji i raportit" value={form.report_type} />
                    <SummaryRow label="Adresa" value={form.location_address} />
                    <SummaryRow label="Koordinatat" value={`${form.latitude}, ${form.longitude}`} />
                    <SummaryRow label="Përshkrimi" value={form.report_description} multiline />
                    {form.phoneNr && <SummaryRow label="Telefon" value={form.phoneNr} />}
                    {form.email   && <SummaryRow label="Email"   value={form.email}   />}
                  </div>

                  <div className="mt-6 bg-gray-50 rounded-xl px-4 py-3 text-xs text-gray-400 leading-relaxed">
                    Duke dërguar këtë raport, ju konfirmoni se informacioni i dhënë është i saktë dhe se
                    raportet e rreme mund të kenë pasoja ligjore sipas legjislacionit shqiptar.
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className={`flex mt-8 gap-3 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
                {step > 0 && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 px-5 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer"
                  >
                    <ChevronLeft size={16} /> Prapa
                  </button>
                )}

                {step < STEPS.length - 1 ? (
                  <button
                    onClick={() => { if (canNext()) setStep(s => s + 1) }}
                    disabled={!canNext()}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    Vazhdo <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    {submitting
                      ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {uploadProgress || 'Duke dërguar...'}</>
                      : <><Shield size={15} /> Dërgo raportin{mediaFiles.length > 0 ? ` + ${mediaFiles.length} skedar` : ''}</>
                    }
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function SummaryRow({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="flex gap-3 py-3 border-b border-gray-50 last:border-0">
      <span className="text-xs font-semibold text-gray-400 w-28 shrink-0 pt-0.5 uppercase tracking-wide">{label}</span>
      <span className={`text-sm text-gray-700 flex-1 ${multiline ? 'whitespace-pre-wrap' : ''}`}>{value || '—'}</span>
    </div>
  )
}

function LocationButton({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  const [locState, setLocState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [skipped, setSkipped] = useState(false)

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocState('error')
      return
    }
    setSkipped(false)
    setLocState('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(f => ({
          ...f,
          latitude:  pos.coords.latitude,
          longitude: pos.coords.longitude,
        }))
        setLocState('success')
      },
      () => setLocState('error'),
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  const handleSkip = () => {
    setSkipped(true)
    setLocState('idle')
    // Reset to Tirana center default
    setForm(f => ({ ...f, latitude: 41.3275, longitude: 19.8187 }))
  }

  if (skipped) {
    return (
      <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
        <p className="text-sm text-gray-400">Vendndodhja GPS u anashkalua</p>
        <button
          type="button"
          onClick={() => setSkipped(false)}
          className="text-xs text-red-500 hover:underline cursor-pointer"
        >
          Shto vendndodhjen
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <MapPin size={12} className="inline mr-1" /> Vendndodhja GPS
          <span className="ml-1 text-gray-300 font-normal normal-case">(opsionale)</span>
        </label>
        <button
          type="button"
          onClick={handleSkip}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          Kalo →
        </button>
      </div>

      <button
        type="button"
        onClick={handleGetLocation}
        disabled={locState === 'loading'}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-sm font-medium transition-all cursor-pointer
          ${locState === 'success'
            ? 'border-green-300 bg-green-50 text-green-700'
            : locState === 'error'
            ? 'border-red-200 bg-red-50 text-red-500'
            : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-red-300 hover:text-red-600 hover:bg-orange-50'
          }`}
      >
        {locState === 'loading' && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
        {locState === 'success' && '✅'}
        {locState === 'error'   && '⚠️'}
        {locState === 'idle'    && <MapPin size={15} />}

        {locState === 'idle'    && 'Përdor vendndodhjen time aktuale'}
        {locState === 'loading' && 'Duke gjetur vendndodhjen...'}
        {locState === 'success' && `Vendndodhja u gjet (${form.latitude.toFixed(4)}, ${form.longitude.toFixed(4)})`}
        {locState === 'error'   && 'Nuk mund të gjendej — provoni përsëri'}
      </button>

      {locState === 'error' && (
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-xs text-gray-400">Sigurohuni që keni dhënë leje për vendndodhjen.</p>
          <button type="button" onClick={handleSkip} className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">
            Kalo →
          </button>
        </div>
      )}

      <p className="text-xs text-gray-300 mt-1.5">
        Nëse nuk jeni në vendngjarje, mund ta kaloni këtë hap.
      </p>
    </div>
  )
}