import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, MapPin, Clock, Users, X, CheckCircle, AlertCircle , CalendarX} from 'lucide-react'
import { adminGetEvents, adminCreateEvent, adminUpdateEvent, adminDeleteEvent } from '../../api/client'

interface Event {
  event_id:         number
  title:            string
  description:      string
  location:         string
  event_date:       string
  event_time:       string
  is_free:          boolean
  max_participants?: number
  organizer?:       string
}

const EMPTY_FORM = {
  title:            '',
  description:      '',
  location:         '',
  event_date:       '',
  event_time:       '',
  is_free:          true,
  max_participants: '',
  organizer:        'Bashkia Tiranë',
}

function isUpcoming(dateStr: string) {
  return new Date(dateStr) >= new Date()
}

export default function AdminEventsPage() {
  const [events, setEvents]   = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState<'create' | 'edit' | null>(null)
  const [selected, setSelected] = useState<Event | null>(null)
  const [form, setForm]       = useState({ ...EMPTY_FORM })
  const [saving, setSaving]   = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast]     = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => { load() }, [])

  const load = () => {
    setLoading(true)
    adminGetEvents()
      .then(setEvents)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const openCreate = () => {
    setForm({ ...EMPTY_FORM })
    setSelected(null)
    setModal('create')
  }

  const openEdit = (e: Event) => {
    setSelected(e)
    setForm({
      title:            e.title,
      description:      e.description,
      location:         e.location,
      event_date:       e.event_date.split('T')[0],
      event_time:       e.event_time,
      is_free:          e.is_free,
      max_participants: e.max_participants ? String(e.max_participants) : '',
      organizer:        e.organizer || 'Bashkia Tiranë',
    })
    setModal('edit')
  }

  const handleSave = async () => {
    if (!form.title || !form.event_date || !form.event_time || !form.location) return
    setSaving(true)
    try {
      const payload = {
        ...form,
        max_participants: form.max_participants ? Number(form.max_participants) : undefined,
      }
      if (modal === 'create') {
        await adminCreateEvent(payload)
        showToast('success', 'Eventi u krijua me sukses.')
      } else if (selected) {
        await adminUpdateEvent(selected.event_id, payload)
        showToast('success', 'Eventi u përditësua me sukses.')
      }
      setModal(null)
      load()
    } catch {
      showToast('error', 'Ndodhi një gabim. Provoni përsëri.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await adminDeleteEvent(deleteId)
      showToast('success', 'Eventi u fshi me sukses.')
      setDeleteId(null)
      load()
    } catch {
      showToast('error', 'Fshirja dështoi.')
    } finally {
      setDeleting(false)
    }
  }

  const setF = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }))

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"

  return (
    <div>
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium
          ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Aktivitete & Evente</h1>
          <p className="text-gray-500 text-sm">{events.length} evente gjithsej</p>
        </div>
        <button onClick={openCreate}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-red-900/30">
          <Plus size={16} /> Shto event
        </button>
      </div>

      {/* Events list */}
      {loading ? (
        <div className="text-center py-16 text-gray-500 text-sm">Duke ngarkuar eventet...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4"><CalendarX size={26} className="text-gray-500" /></div>
          <p className="text-gray-400 font-medium">Nuk ka evente ende.</p>
          <button onClick={openCreate} className="mt-4 text-red-400 text-sm hover:text-red-300 cursor-pointer transition-colors">
            + Shto eventin e parë
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map(event => {
            const upcoming = isUpcoming(event.event_date)
            return (
              <div key={event.event_id}
                className="rounded-2xl border p-5 flex items-start gap-4 transition-all hover:border-white/20"
                style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>

                {/* Date block */}
                <div className={`shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center
                  ${upcoming ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-500'}`}>
                  <span className="text-lg font-bold leading-none">
                    {new Date(event.event_date).getDate()}
                  </span>
                  <span className="text-xs opacity-80">
                    {new Date(event.event_date).toLocaleDateString('sq-AL', { month: 'short' })}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-semibold text-sm">{event.title}</h3>
                        {event.is_free && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/40 text-green-400 font-medium">Falas</span>
                        )}
                        {!upcoming && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-500 font-medium">I kaluar</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">{event.description}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => openEdit(event)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteId(event.event_id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock size={11} /> {event.event_time}</span>
                    <span className="flex items-center gap-1"><MapPin size={11} /> {event.location}</span>
                    {event.max_participants && (
                      <span className="flex items-center gap-1"><Users size={11} /> {event.max_participants} pjesëmarrës</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create / Edit modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border my-6" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>

            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#334155' }}>
              <h2 className="text-lg font-bold text-white">
                {modal === 'create' ? 'Shto event të ri' : 'Ndrysho eventin'}
              </h2>
              <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white cursor-pointer transition-colors p-1">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <input placeholder="Titulli i eventit *" value={form.title}
                onChange={e => setF('title', e.target.value)} className={inputCls} />

              <textarea placeholder="Përshkrimi *" value={form.description}
                onChange={e => setF('description', e.target.value)}
                rows={3} className={`${inputCls} resize-none`} />

              <input placeholder="Vendndodhja *" value={form.location}
                onChange={e => setF('location', e.target.value)} className={inputCls} />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Data *</label>
                  <input type="date" value={form.event_date}
                    onChange={e => setF('event_date', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Ora *</label>
                  <input type="time" value={form.event_time}
                    onChange={e => setF('event_time', e.target.value)} className={inputCls} />
                </div>
              </div>

              <input placeholder="Organizatori (opsionale)" value={form.organizer}
                onChange={e => setF('organizer', e.target.value)} className={inputCls} />

              <input type="number" placeholder="Numri maks. i pjesëmarrësve (opsionale)"
                value={form.max_participants}
                onChange={e => setF('max_participants', e.target.value)} className={inputCls} />

              {/* Is free toggle */}
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm text-white font-medium">Eventi është falas</p>
                  <p className="text-xs text-gray-500 mt-0.5">Do të shfaqet badge "Falas" në faqe</p>
                </div>
                <button
                  onClick={() => setF('is_free', !form.is_free)}
                  className={`w-11 h-6 rounded-full transition-all cursor-pointer relative ${form.is_free ? 'bg-red-600' : 'bg-white/10'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.is_free ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>

            <div className="flex gap-3 px-5 pb-5">
              <button onClick={() => setModal(null)}
                className="flex-1 border border-white/10 text-gray-400 hover:text-white py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer">
                Anulo
              </button>
              <button onClick={handleSave} disabled={saving || !form.title || !form.event_date || !form.event_time || !form.location}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2">
                {saving
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Duke ruajtur...</>
                  : modal === 'create' ? <><Plus size={14} /> Shto eventin</> : 'Ruaj ndryshimet'
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl border p-6" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
            <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <h3 className="text-white font-bold text-lg text-center mb-2">Fshi eventin?</h3>
            <p className="text-gray-400 text-sm text-center mb-6">Ky veprim është i pakthyeshëm.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 border border-white/10 text-gray-400 hover:text-white py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer">
                Anulo
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2">
                {deleting
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Duke fshirë...</>
                  : <><Trash2 size={14} /> Po, fshi</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}