import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, Calendar, MapPin, Shield, ArrowLeft, Phone } from 'lucide-react'
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
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [meetingId, setMeetingId] = useState<string | null>(null)
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

  const handleSubmit = async () => {
    if (!form.visitor_first_name || !form.visitor_last_name || !form.visitor_email || !form.preferred_date) {
      setError('Ju lutem plotësoni të gjitha fushat e detyrueshme.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await createMeeting({
        animal_id: Number(id),
        visitor_name: `${form.visitor_first_name} ${form.visitor_last_name}`.trim(),
        visitor_email: form.visitor_email,
        visitor_phone: form.visitor_phone,
        preferred_date: form.preferred_date,
        preferred_time: '10:00:00',
        notes: form.notes,
      })
      setMeetingId(res.meeting_id)
      setSubmitted(true)
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      if (typeof detail === 'string') {
        setError(detail)
      } else {
        setError('Diçka shkoi keq. Provoni përsëri.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fdf6f0' }}>
      <p className="text-gray-400">Duke ngarkuar...</p>
    </div>
  )

  if (!animal) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fdf6f0' }}>
      <p className="text-gray-400">Kafsha nuk u gjet.</p>
    </div>
  )

  const primaryPhoto = animal.photos?.find((p: any) => p.is_primary) ?? animal.photos?.[0]
  const displayPhoto = selectedPhoto ?? primaryPhoto?.photo_url ?? null

  const cleanDescription = animal.description
    ? animal.description.replace(/^Shpëtuar nga raporti #\d+:\s*/i, '')
    : null

  const statusColor = animal.adoption_status === 'Disponueshme'
    ? 'bg-green-100 text-green-700'
    : 'bg-yellow-100 text-yellow-700'

  const isUnavailable = animal.adoption_status === 'Adoptuar'

  return (
    <div style={{ backgroundColor: '#fdf6f0' }} className="min-h-screen">

      {/* Back button */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-8">
        <Link
          to="/adopto"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> Kthehu tek kafshët
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* LEFT — Photos */}
        <div>
          <div className="rounded-2xl overflow-hidden h-72 md:h-96 bg-orange-50/50 mb-4 shadow-sm">
            {displayPhoto ? (
              <img
                src={displayPhoto}
                alt={animal.name ?? animal.species}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">
                {animal.species === 'Qen' ? '🐕' : animal.species === 'Mace' ? '🐈' : '🐾'}
              </div>
            )}
          </div>

          {animal.photos && animal.photos.length > 1 && (
            <div className="flex gap-3 flex-wrap">
              {animal.photos.map((photo: any) => (
                <button
                  key={photo.photo_id}
                  onClick={() => setSelectedPhoto(photo.photo_url)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer
                    ${selectedPhoto === photo.photo_url ? 'border-red-500' : 'border-transparent'}`}
                >
                  <img src={photo.photo_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Info + Form */}
        <div>

          {/* Animal info */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}>
                {animal.adoption_status}
              </span>
              <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100">
                {animal.species}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {animal.name ?? 'Pa emër'}
            </h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
              {animal.age_estimate && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-red-400" /> {animal.age_estimate}
                </span>
              )}
              {animal.gender && (
                <span className="flex items-center gap-1.5">
                  <Heart size={14} className="text-red-400" /> {animal.gender}
                </span>
              )}
              {animal.breed && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-red-400" /> {animal.breed}
                </span>
              )}
              {animal.health_status && (
                <span className="flex items-center gap-1.5">
                  <Shield size={14} className="text-green-500" /> {animal.health_status}
                </span>
              )}
            </div>

            {cleanDescription && (
              <p className="text-gray-600 leading-relaxed">{cleanDescription}</p>
            )}
          </div>

          {/* Form / Status box */}
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-orange-50">

            {isUnavailable ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl mx-auto mb-4">
                  🏠
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Kafsha është adoptuar
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Kjo kafshë ka gjetur tashmë një familje të re. Shiko kafshët e tjera që presin adoptimin!
                </p>
                <Link
                  to="/adopto"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                >
                  <Heart size={15} /> Shiko kafshë të tjera
                </Link>
              </div>

            ) : submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto mb-4">
                  ✅
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Takimi u planifikua!
                </h3>
                <p className="text-gray-500 mb-4 text-sm">
                  Kërkesa juaj u dërgua me sukses. Stafi ynë do t'ju kontaktojë së shpejti për të konfirmuar orën.
                </p>
                {meetingId && (
                  <div className="bg-orange-50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-500 mb-1">ID e takimit tuaj:</p>
                    <p className="font-bold text-red-600 text-lg">{meetingId}</p>
                    <p className="text-xs text-gray-400 mt-1">Ruajeni këtë ID për të gjurmuar statusin</p>
                  </div>
                )}
                <Link
                  to="/adopto"
                  className="inline-flex items-center gap-2 text-red-600 hover:underline text-sm font-medium"
                >
                  <ArrowLeft size={14} /> Shiko kafshë të tjera
                </Link>
              </div>

            ) : (
              <>
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  Planifiko një takim 📅
                </h3>
                <p className="text-gray-400 text-sm mb-5">
                  Plotësoni formularin dhe stafi ynë do t'ju kontaktojë për të konfirmuar orën e takimit.
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                    {error}
                  </div>
                )}

                <div className="space-y-3">

                  {/* Emri + Mbiemri */}
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Emri *"
                      value={form.visitor_first_name}
                      onChange={e => setForm({ ...form, visitor_first_name: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 bg-gray-50"
                    />
                    <input
                      type="text"
                      placeholder="Mbiemri *"
                      value={form.visitor_last_name}
                      onChange={e => setForm({ ...form, visitor_last_name: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 bg-gray-50"
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="Email *"
                    value={form.visitor_email}
                    onChange={e => setForm({ ...form, visitor_email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 bg-gray-50"
                  />

                  <div className="relative">
                    <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Numri i telefonit"
                      value={form.visitor_phone}
                      onChange={e => setForm({ ...form, visitor_phone: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-red-400 bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Data e preferuar për takim *
                    </label>
                    <input
                      type="date"
                      value={form.preferred_date}
                      onChange={e => setForm({ ...form, preferred_date: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 bg-gray-50 text-gray-600"
                    />
                  </div>

                  <textarea
                    placeholder="Pse dëshironi të adoptoni këtë kafshë? (opsionale)"
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 bg-gray-50 resize-none"
                  />

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Heart size={16} />
                    {submitting ? 'Duke dërguar...' : 'Planifiko takimin'}
                  </button>

                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}