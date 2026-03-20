import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, Calendar, MapPin, Shield, ArrowLeft, Phone, CheckCircle } from 'lucide-react'
import { getAnimal, createMeeting } from '../../api/client'
import type { Animal } from '../../types'

export default function AnimalDetailPage() {
  const { id } = useParams()
  const [animal, setAnimal] = useState<Animal | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  const [form, setForm] = useState({
    visitor_first_name: '',
    visitor_last_name: '',
    visitor_email: '',
    visitor_phone: '',
    preferred_date: '',
    notes: '',
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getAnimal(Number(id))
      .then((data) => {
        setAnimal(data)
        const primary = data.photos?.find((p: any) => p.is_primary) ?? data.photos?.[0]
        if (primary) setSelectedPhoto(primary.photo_url)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!form.visitor_first_name.trim()) errors.visitor_first_name = 'Emri është i detyrueshëm.'
    if (!form.visitor_last_name.trim()) errors.visitor_last_name = 'Mbiemri është i detyrueshëm.'
    if (!form.visitor_email.trim()) errors.visitor_email = 'Emaili është i detyrueshëm.'
    if (!form.preferred_date) errors.preferred_date = 'Data e takimit është e detyrueshme.'
    return errors
  }

  const handleSubmit = async () => {
    const errors = validate()
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return }
    setFieldErrors({})
    setSubmitting(true)
    setError(null)
    try {
      await createMeeting({
        animal_id: Number(id),
        visitor_name: `${form.visitor_first_name} ${form.visitor_last_name}`.trim(),
        visitor_email: form.visitor_email,
        visitor_phone: form.visitor_phone,
        preferred_date: form.preferred_date,
        preferred_time: '10:00:00',
        notes: form.notes,
      })
      setSubmitted(true)
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Diçka shkoi keq. Provoni përsëri.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputBase = (field: string) =>
    `w-full rounded-xl px-4 py-3 text-sm transition-all outline-none ${fieldErrors[field]
      ? 'border-2 border-red-400 bg-red-50'
      : 'border border-gray-200 bg-gray-50 focus:border-gray-900 focus:bg-white'
    }`

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf9f7' }}>
      <div className="w-8 h-8 border-2 border-red-200 border-t-red-500 rounded-full animate-spin" />
    </div>
  )

  if (!animal) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf9f7' }}>
      <p className="text-gray-400">Kafsha nuk u gjet.</p>
    </div>
  )

  const primaryPhoto = animal.photos?.find((p: any) => p.is_primary) ?? animal.photos?.[0]
  const displayPhoto = selectedPhoto ?? primaryPhoto?.photo_url ?? null
  const cleanDescription = animal.description?.replace(/^Shpëtuar nga raporti #\d+:\s*/i, '') ?? null
  const isAvailable = animal.adoption_status === 'Disponueshme'
  const isUnavailable = animal.adoption_status === 'Adoptuar'

  return (
    <div style={{ backgroundColor: '#faf9f7' }} className="min-h-screen">

      {/* Top bar */}
      <div className="relative overflow-hidden" style={{ paddingTop: '4.5rem', background: 'linear-gradient(135deg, #b91c1c 0%, #c2410c 100%)' }}>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        <div className="max-w-6xl mx-auto px-6 py-4 relative z-10">
          <Link to="/adopto" className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80 text-white/80 hover:text-white">
            <ArrowLeft size={15} /> Kthehu tek kafshët
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* LEFT — Photos */}
        <div>
          <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 mb-3 shadow-sm">
            {displayPhoto ? (
              <img src={displayPhoto} alt={animal.name ?? animal.species} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl bg-gray-50">
                {animal.species === 'Qen' ? '🐕' : animal.species === 'Mace' ? '🐈' : '🐾'}
              </div>
            )}
          </div>
          {animal.photos && animal.photos.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {animal.photos.map((photo: any) => (
                <button key={photo.photo_id} onClick={() => setSelectedPhoto(photo.photo_url)}
                  className={`w-18 h-18 rounded-xl overflow-hidden transition-all cursor-pointer`}
                  style={{ width: 72, height: 72, border: selectedPhoto === photo.photo_url ? '3px solid #111827' : '2px solid transparent', opacity: selectedPhoto === photo.photo_url ? 1 : 0.7 }}>
                  <img src={photo.photo_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div>
          {/* Animal info */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold px-3 py-1.5 rounded-lg"
                style={isAvailable
                  ? { backgroundColor: '#dcfce7', color: '#15803d' }
                  : { backgroundColor: '#fef9c3', color: '#a16207' }}>
                {animal.adoption_status}
              </span>
              <span className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}>
                {animal.species}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-5" style={{ color: '#111827' }}>
              {animal.name ?? 'Pa emër'}
            </h1>

            <div className="flex flex-wrap gap-3 mb-6">
              {animal.age_estimate && (
                <div className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl" style={{ backgroundColor: '#f9fafb', color: '#374151', border: '1px solid #f3f4f6' }}>
                  <Calendar size={13} style={{ color: '#e02424' }} /> {animal.age_estimate}
                </div>
              )}
              {animal.gender && (
                <div className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl" style={{ backgroundColor: '#f9fafb', color: '#374151', border: '1px solid #f3f4f6' }}>
                  <Heart size={13} style={{ color: '#e02424' }} /> {animal.gender}
                </div>
              )}
              {animal.breed && (
                <div className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl" style={{ backgroundColor: '#f9fafb', color: '#374151', border: '1px solid #f3f4f6' }}>
                  <MapPin size={13} style={{ color: '#e02424' }} /> {animal.breed}
                </div>
              )}
              {animal.health_status && (
                <div className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl" style={{ backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #dcfce7' }}>
                  <Shield size={13} /> {animal.health_status}
                </div>
              )}
            </div>

            {cleanDescription && (
              <p className="text-base leading-relaxed" style={{ color: '#4b5563' }}>{cleanDescription}</p>
            )}
          </div>

          {/* Form box */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #f3f4f6', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

            {isUnavailable ? (
              <div className="text-center p-10">
                <div className="text-5xl mb-4">🏠</div>
                <h3 className="text-lg font-black mb-2" style={{ color: '#111827' }}>Kafsha është adoptuar</h3>
                <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Kjo kafshë ka gjetur tashmë një familje të re.</p>
                <Link to="/adopto" className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold text-sm" style={{ backgroundColor: '#e02424' }}>
                  <Heart size={14} /> Shiko kafshë të tjera
                </Link>
              </div>

            ) : submitted ? (
              <div className="text-center p-10">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f0fdf4' }}>
                  <CheckCircle size={32} style={{ color: '#16a34a' }} />
                </div>
                <h3 className="text-xl font-black mb-2" style={{ color: '#111827' }}>Takimi u planifikua!</h3>
                <p className="text-sm mb-2" style={{ color: '#6b7280' }}>
                  Stafi i Bashkisë do t'ju kontaktojë në emailin ose numrin e dhënë.
                </p>
                <p className="text-xs mb-6" style={{ color: '#9ca3af' }}>
                  Përgjigjia vonohet 1–2 ditë.
                </p>
                <Link to="/adopto" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:opacity-70" style={{ color: '#e02424' }}>
                  <ArrowLeft size={14} /> Shiko kafshë të tjera
                </Link>
              </div>

            ) : (
              <div className="p-6">
                <h3 className="font-black text-lg mb-1" style={{ color: '#111827' }}>Planifiko një takim 📅</h3>
                <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>Plotësoni formularin dhe stafi ynë do t'ju kontaktojë.</p>

                {error && (
                  <div className="rounded-xl px-4 py-3 mb-4 text-sm" style={{ backgroundColor: '#fef2f2', color: '#e02424', border: '1px solid #fecaca' }}>
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input type="text" placeholder="Emri" value={form.visitor_first_name}
                        onChange={e => { setForm({ ...form, visitor_first_name: e.target.value }); setFieldErrors(p => ({ ...p, visitor_first_name: '' })) }}
                        className={inputBase('visitor_first_name')} />
                      {fieldErrors.visitor_first_name && <p className="text-xs mt-1 ml-1" style={{ color: '#e02424' }}>{fieldErrors.visitor_first_name}</p>}
                    </div>
                    <div>
                      <input type="text" placeholder="Mbiemri" value={form.visitor_last_name}
                        onChange={e => { setForm({ ...form, visitor_last_name: e.target.value }); setFieldErrors(p => ({ ...p, visitor_last_name: '' })) }}
                        className={inputBase('visitor_last_name')} />
                      {fieldErrors.visitor_last_name && <p className="text-xs mt-1 ml-1" style={{ color: '#e02424' }}>{fieldErrors.visitor_last_name}</p>}
                    </div>
                  </div>

                  <div>
                    <input type="email" placeholder="Email" value={form.visitor_email}
                      onChange={e => { setForm({ ...form, visitor_email: e.target.value }); setFieldErrors(p => ({ ...p, visitor_email: '' })) }}
                      className={inputBase('visitor_email')} />
                    {fieldErrors.visitor_email && <p className="text-xs mt-1 ml-1" style={{ color: '#e02424' }}>{fieldErrors.visitor_email}</p>}
                  </div>

                  <div className="relative">
                    <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }} />
                    <input type="tel" placeholder="Numri i telefonit" value={form.visitor_phone}
                      onChange={e => setForm({ ...form, visitor_phone: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm outline-none focus:border-gray-900 bg-gray-50 focus:bg-white transition-all" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#6b7280' }}>Data e preferuar për takim</label>
                    <input type="date" value={form.preferred_date}
                      onChange={e => { setForm({ ...form, preferred_date: e.target.value }); setFieldErrors(p => ({ ...p, preferred_date: '' })) }}
                      className={inputBase('preferred_date')} style={{ color: '#374151' }} />
                    {fieldErrors.preferred_date && <p className="text-xs mt-1 ml-1" style={{ color: '#e02424' }}>{fieldErrors.preferred_date}</p>}
                  </div>

                  <textarea placeholder="Pse dëshironi të adoptoni këtë kafshë? (opsionale)" value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-900 bg-gray-50 focus:bg-white transition-all resize-none" />

                  <button onClick={handleSubmit} disabled={submitting}
                    className="w-full text-white py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: '#e02424' }}>
                    <Heart size={15} />
                    {submitting ? 'Duke dërguar...' : 'Planifiko takimin'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}