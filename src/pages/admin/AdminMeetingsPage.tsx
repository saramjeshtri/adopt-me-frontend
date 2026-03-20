import { useEffect, useState } from 'react'
import { Search, Eye, X, CheckCircle, AlertCircle, Calendar } from 'lucide-react'
import { adminGetMeetings, adminUpdateMeeting } from '../../api/client'
import type { AdoptionMeeting } from '../../types'

const STATUSES = ['Në pritje', 'Konfirmuar', 'Përfunduar', 'Anulluar']

function statusBadge(status: string) {
  const base = 'text-xs font-semibold px-2.5 py-1 rounded-full'
  if (status === 'Konfirmuar')  return `${base} bg-green-900/40 text-green-400`
  if (status === 'Në pritje')   return `${base} bg-yellow-900/40 text-yellow-400`
  if (status === 'Përfunduar')  return `${base} bg-blue-900/40 text-blue-400`
  if (status === 'Anulluar')    return `${base} bg-gray-700 text-gray-400`
  return `${base} bg-gray-700 text-gray-400`
}

export default function AdminMeetingsPage() {
  const [meetings, setMeetings] = useState<AdoptionMeeting[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<AdoptionMeeting | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [updating, setUpdating] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => { load() }, [filterStatus])

  const load = () => {
    setLoading(true)
    const params: any = {}
    if (filterStatus) params.status = filterStatus
    adminGetMeetings(params)
      .then(setMeetings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const openDetail = (m: AdoptionMeeting) => {
    setSelected(m)
    setNewStatus(m.status)
  }

  const handleUpdate = async () => {
    if (!selected) return
    setUpdating(true)
    try {
      await adminUpdateMeeting(selected.meeting_id, { status: newStatus })
      showToast('success', 'Statusi i takimit u përditësua.')
      setSelected(null)
      load()
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      showToast('error', typeof detail === 'string' ? detail : 'Ndodhi një gabim.')
    } finally {
      setUpdating(false)
    }
  }

  const filtered = meetings.filter(m => {
    if (!search) return true
    const q = search.toLowerCase().trim()
    // Exact ID match — typing "2" only shows meeting #2, not #12 or #20
    if (/^\d+$/.test(q)) {
      return String(m.meeting_id) === q
    }
    // Otherwise match by name or email
    return (
      m.visitor_name.toLowerCase().includes(q) ||
      (m.visitor_email ?? '').toLowerCase().includes(q) ||
      (m.visitor_phone ?? '').includes(q)
    )
  })

  return (
    <div>
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium
          ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Takimet</h1>
          <p className="text-gray-500 text-sm">{meetings.length} takime gjithsej</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Kërko sipas emrit, emailit, ose ID ekzakte..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer">
          <option value="" className="bg-gray-900">Të gjitha statuset</option>
          {STATUSES.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#1e293b' }}>
        {loading ? (
          <div className="p-10 text-center text-gray-500 text-sm">Duke ngarkuar takimet...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-500 text-sm">Nuk u gjetën takime.</div>
        ) : (
          <table className="w-full">
            <thead style={{ backgroundColor: '#1e293b' }}>
              <tr>
                {['#ID', 'Vizitori', 'Kafsha #', 'Data', 'Ora', 'Statusi', 'Veprime'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={m.meeting_id}
                  className="border-t hover:bg-white/5 transition-colors"
                  style={{ borderColor: '#1e293b', backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                  <td className="px-4 py-3 text-sm text-gray-400 font-mono">#{m.meeting_id}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-white font-medium">{m.visitor_name}</p>
                    {m.visitor_email && <p className="text-xs text-gray-500">{m.visitor_email}</p>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400 font-mono">#{m.animal_id}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      {new Date(m.preferred_date).toLocaleDateString('sq-AL')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {m.preferred_time.slice(0, 5)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={statusBadge(m.status)}>{m.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openDetail(m)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                      <Eye size={14} /> Shiko
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>

            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#334155' }}>
              <div>
                <h2 className="text-lg font-bold text-white">Takim #{selected.meeting_id}</h2>
                <p className="text-gray-400 text-sm">Kafsha #{selected.animal_id}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white cursor-pointer p-1">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <InfoRow label="Vizitori"  value={selected.visitor_name} />
              <InfoRow label="Telefon"   value={selected.visitor_phone} />
              {selected.visitor_email && <InfoRow label="Email" value={selected.visitor_email} />}
              <InfoRow label="Data"
                value={new Date(selected.preferred_date).toLocaleDateString('sq-AL', { year: 'numeric', month: 'long', day: 'numeric' })} />
              <InfoRow label="Ora"       value={selected.preferred_time.slice(0, 5)} />
              {selected.notes && <InfoRow label="Shënime" value={selected.notes} />}
              <InfoRow label="Dërguar"
                value={new Date(selected.created_at).toLocaleDateString('sq-AL', { year: 'numeric', month: 'long', day: 'numeric' })} />

              <div className="pt-3 border-t" style={{ borderColor: '#334155' }}>
                <label className="text-xs text-gray-400 mb-2 block uppercase tracking-wide">Statusi i ri</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer">
                  {STATUSES.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
                </select>
              </div>

              {newStatus === 'Anulluar' && selected.status !== 'Anulluar' && (
                <div className="bg-red-900/20 border border-red-900/30 text-red-400 text-xs rounded-xl px-4 py-3">
                  ⚠️ Anulimi i takimit do të çlirojë kafshën për takime të reja.
                </div>
              )}
            </div>

            <div className="flex gap-3 px-5 pb-5">
              <button onClick={() => setSelected(null)}
                className="flex-1 border border-white/10 text-gray-400 hover:text-white py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer">
                Anulo
              </button>
              <button onClick={handleUpdate} disabled={updating || newStatus === selected.status}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2">
                {updating
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Duke ruajtur...</>
                  : 'Ruaj ndryshimet'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-xs text-gray-500 w-20 shrink-0 pt-0.5 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-gray-300 flex-1">{value}</span>
    </div>
  )
}