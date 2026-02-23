import { useEffect, useState } from 'react'
import { Eye, ChevronDown, Search, Filter, X, CheckCircle, AlertCircle } from 'lucide-react'
import { adminGetReports, adminUpdateReport } from '../../api/client'
import type { Report } from '../../types'

const STATUSES = ['Hapur', 'Në proces', 'Zgjidhur - Kafshë e gjetur', 'Zgjidhur - Nuk u gjet', 'Zgjidhur - Kthyer pronarit']
const SPECIES  = ['Qen', 'Mace', 'Zog', 'Kalë', 'Tjetër']
const GENDERS  = ['Mashkull', 'Femër', 'E panjohur']
const HEALTH   = ['Shëndetshëm', 'I lënduar', 'Në trajtim']

function statusBadge(status: string) {
  const base = 'text-xs font-semibold px-2.5 py-1 rounded-full'
  if (status === 'Hapur')     return `${base} bg-red-900/40 text-red-400`
  if (status === 'Në proces') return `${base} bg-yellow-900/40 text-yellow-400`
  if (status.startsWith('Zgjidhur')) return `${base} bg-green-900/40 text-green-400`
  return `${base} bg-gray-700 text-gray-400`
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Report | null>(null)
  const [updateForm, setUpdateForm] = useState({
    report_status: '',
    animal_name: '',
    animal_species: '',
    animal_gender: 'E panjohur',
    animal_health_status: 'Shëndetshëm',
    animal_breed: '',
    animal_age_estimate: '',
  })
  const [updating, setUpdating] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    load()
  }, [filterStatus])

  const load = () => {
    setLoading(true)
    const params: any = {}
    if (filterStatus) params.status = filterStatus
    adminGetReports(params)
      .then(setReports)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const openDetail = (r: Report) => {
    setSelected(r)
    setUpdateForm({
      report_status: r.report_status,
      animal_name: '',
      animal_species: '',
      animal_gender: 'E panjohur',
      animal_health_status: 'Shëndetshëm',
      animal_breed: '',
      animal_age_estimate: '',
    })
  }

  const handleUpdate = async () => {
    if (!selected) return
    setUpdating(true)
    try {
      const payload: any = { report_status: updateForm.report_status }
      if (updateForm.report_status === 'Zgjidhur - Kafshë e gjetur') {
        payload.animal_name          = updateForm.animal_name
        payload.animal_species       = updateForm.animal_species
        payload.animal_gender        = updateForm.animal_gender
        payload.animal_health_status = updateForm.animal_health_status
        payload.animal_breed         = updateForm.animal_breed
        payload.animal_age_estimate  = updateForm.animal_age_estimate
      }
      await adminUpdateReport(selected.report_id, payload)
      showToast('success', 'Raporti u përditësua me sukses.')
      setSelected(null)
      load()
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      showToast('error', typeof detail === 'string' ? detail : 'Ndodhi një gabim.')
    } finally {
      setUpdating(false)
    }
  }

  const filtered = reports.filter(r =>
    !search || r.location_address.toLowerCase().includes(search.toLowerCase()) ||
    r.report_type.toLowerCase().includes(search.toLowerCase()) ||
    String(r.report_id).includes(search)
  )

  const setForm = (key: string, val: string) => setUpdateForm(f => ({ ...f, [key]: val }))

  return (
    <div>
      {/* Toast */}
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
          <h1 className="text-2xl font-bold text-white mb-1">Raportet</h1>
          <p className="text-gray-500 text-sm">{reports.length} raporte gjithsej</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Kërko sipas ID, lloji, adresës..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl pl-8 pr-8 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer appearance-none"
          >
            <option value="" className="bg-gray-900">Të gjitha statuset</option>
            {STATUSES.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#1e293b' }}>
        {loading ? (
          <div className="p-10 text-center text-gray-500 text-sm">Duke ngarkuar raportet...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-500 text-sm">Nuk u gjetën raporte.</div>
        ) : (
          <table className="w-full">
            <thead style={{ backgroundColor: '#1e293b' }}>
              <tr>
                {['#ID', 'Lloji', 'Adresa', 'Statusi', 'Data', 'Veprime'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr
                  key={r.report_id}
                  style={{ backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', borderColor: '#1e293b' }}
                  className="border-t hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-400 font-mono">#{r.report_id}</td>
                  <td className="px-4 py-3 text-sm text-white font-medium">{r.report_type}</td>
                  <td className="px-4 py-3 text-sm text-gray-400 max-w-40 truncate">{r.location_address}</td>
                  <td className="px-4 py-3">
                    <span className={statusBadge(r.report_status)}>{r.report_status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(r.created_at).toLocaleDateString('sq-AL')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openDetail(r)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      <Eye size={14} /> Shiko
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border my-6" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>

            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#334155' }}>
              <div>
                <h2 className="text-lg font-bold text-white">Raport #{selected.report_id}</h2>
                <p className="text-gray-400 text-sm">{selected.report_type}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white transition-colors cursor-pointer p-1">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <InfoRow label="Adresa"       value={selected.location_address} />
              <InfoRow label="Përshkrimi"   value={selected.report_description} />
              {selected.phoneNr && <InfoRow label="Telefon" value={selected.phoneNr} />}
              {selected.email   && <InfoRow label="Email"   value={selected.email}   />}

              <div className="pt-3 border-t" style={{ borderColor: '#334155' }}>
                <label className="text-xs text-gray-400 mb-2 block uppercase tracking-wide">Statusi i ri</label>
                <select
                  value={updateForm.report_status}
                  onChange={e => setForm('report_status', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  {STATUSES.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
                </select>
              </div>

              {/* Animal fields — only when "Zgjidhur - Kafshë e gjetur" */}
              {updateForm.report_status === 'Zgjidhur - Kafshë e gjetur' && (
                <div className="bg-white/5 rounded-xl p-4 space-y-3 border border-white/10">
                  <p className="text-xs font-semibold text-yellow-400 mb-1">⚠️ Detajet e kafshës (të detyrueshme)</p>
                  <input placeholder="Emri i kafshës *" value={updateForm.animal_name}
                    onChange={e => setForm('animal_name', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500" />
                  <div className="grid grid-cols-2 gap-3">
                    <select value={updateForm.animal_species} onChange={e => setForm('animal_species', e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer">
                      <option value="" className="bg-gray-900">Lloji *</option>
                      {SPECIES.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
                    </select>
                    <select value={updateForm.animal_gender} onChange={e => setForm('animal_gender', e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer">
                      {GENDERS.map(g => <option key={g} value={g} className="bg-gray-900">{g}</option>)}
                    </select>
                  </div>
                  <select value={updateForm.animal_health_status} onChange={e => setForm('animal_health_status', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer">
                    {HEALTH.map(h => <option key={h} value={h} className="bg-gray-900">{h}</option>)}
                  </select>
                  <input placeholder="Raca (opsionale)" value={updateForm.animal_breed}
                    onChange={e => setForm('animal_breed', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500" />
                  <input placeholder="Mosha e vlerësuar (opsionale)" value={updateForm.animal_age_estimate}
                    onChange={e => setForm('animal_age_estimate', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500" />
                </div>
              )}
            </div>

            <div className="flex gap-3 px-5 pb-5">
              <button onClick={() => setSelected(null)}
                className="flex-1 border border-white/10 text-gray-400 hover:text-white py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer">
                Anulo
              </button>
              <button onClick={handleUpdate} disabled={updating}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-white py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2">
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
      <span className="text-xs text-gray-500 w-24 shrink-0 pt-0.5 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-gray-300 flex-1 leading-relaxed">{value}</span>
    </div>
  )
}