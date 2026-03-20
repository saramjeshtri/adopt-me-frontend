import { useEffect, useState } from 'react'
import { Heart, Phone, Mail, CheckCircle, AlertCircle, X, ChevronDown, Eye, Inbox , ImageIcon} from 'lucide-react'
import {
  adminGetSurrenders, adminUpdateSurrenderStatus, adminRejectSurrender,
  adminAcceptSurrender,
} from '../../api/client'

interface SurrenderMedia { media_id: number; file_url: string }
interface Surrender {
  surrender_id:  number
  owner_name:    string
  phone:         string
  email?:        string
  species:       string
  breed?:        string
  age?:          string
  is_vaccinated?: string
  reason:        string
  notes?:        string
  status:        string
  created_at:    string
  media:         SurrenderMedia[]
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  'New':       { label: 'E re',       cls: 'bg-blue-900/40 text-blue-400' },
  'Contacted': { label: 'Kontaktuar', cls: 'bg-yellow-900/40 text-yellow-400' },
  'Accepted':  { label: 'Pranuar',    cls: 'bg-green-900/40 text-green-400' },
  'Rejected':  { label: 'Refuzuar',   cls: 'bg-red-900/40 text-red-400' },
}

const HEALTH_OPTIONS  = ['Shëndetshëm', 'I lënduar', 'Në trajtim']
const GENDER_OPTIONS  = ['Mashkull', 'Femër', 'E panjohur']

export default function AdminSurrenderPage() {
  const [surrenders, setSurrenders] = useState<Surrender[]>([])
  const [loading, setLoading]       = useState(true)
  const [filter, setFilter]         = useState('all')
  const [selected, setSelected]     = useState<Surrender | null>(null)
  const [toast, setToast]           = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  // Accept modal state
  const [acceptModal, setAcceptModal] = useState<Surrender | null>(null)
  const [acceptForm, setAcceptForm]   = useState({ name: '', health_status: 'Shëndetshëm', gender: 'E panjohur', description: '' })
  const [accepting, setAccepting]     = useState(false)

  // Reject confirm
  const [rejectId, setRejectId] = useState<number | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [rejecting, setRejecting] = useState(false)

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  const load = () => {
    setLoading(true)
    adminGetSurrenders()
      .then(setSurrenders)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = surrenders.filter(s => filter === 'all' || s.status === filter)

  const handleContact = async (id: number) => {
    try {
      await adminUpdateSurrenderStatus(id, 'Contacted')
      showToast('success', 'Statusi u ndryshua në "Kontaktuar".')
      load()
    } catch { showToast('error', 'Ndodhi një gabim.') }
  }

  const handleAccept = async () => {
    if (!acceptModal) return
    setAccepting(true)
    try {
      await adminAcceptSurrender(acceptModal.surrender_id, acceptForm)
      showToast('success', 'Kafsha u shtua në listën e adoptimit! 🐾')
      setAcceptModal(null)
      setSelected(null)
      load()
    } catch { showToast('error', 'Ndodhi një gabim.') }
    finally { setAccepting(false) }
  }

  const handleReject = async () => {
    if (!rejectId) return
    setRejecting(true)
    try {
      await adminRejectSurrender(rejectId, rejectReason || 'Nuk u dha arsye specifike.')
      showToast('success', 'Kërkesa u refuzua me sukses.')
      setRejectId(null)
      setRejectReason('')
      setSelected(null)
      load()
    } catch { showToast('error', 'Ndodhi një gabim.') }
    finally { setRejecting(false) }
  }

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
  const selectCls = `${inputCls} appearance-none`

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
          <h1 className="text-2xl font-bold text-white mb-1">Dhuro Kafshë</h1>
          <p className="text-gray-500 text-sm">{surrenders.length} kërkesa gjithsej</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          ['all', 'Të gjitha'],
          ['New', 'Të reja'],
          ['Contacted', 'Kontaktuar'],
          ['Accepted', 'Pranuar'],
          ['Rejected', 'Refuzuar'],
        ].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer
              ${filter === val ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'}`}>
            {label}
            {val !== 'all' && (
              <span className="ml-1.5 opacity-60">
                {surrenders.filter(s => s.status === val).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-gray-500 text-sm">Duke ngarkuar...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Inbox size={26} className="text-gray-500" />
          </div>
          <p className="text-gray-400">Nuk ka kërkesa në këtë kategori.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(s => {
            const st = STATUS_LABELS[s.status] || { label: s.status, cls: 'bg-gray-700 text-gray-400' }
            return (
              <div key={s.surrender_id}
                className="rounded-2xl border p-5 transition-all hover:border-white/20"
                style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <span className="text-white font-semibold">{s.owner_name}</span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                      {s.media.length > 0 && (
                        <span className="text-xs text-gray-500 flex items-center gap-1"><ImageIcon size={11} /> {s.media.length} foto</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-2">
                      <span className="flex items-center gap-1.5"><Phone size={11} /> {s.phone}</span>
                      {s.email && <span className="flex items-center gap-1.5"><Mail size={11} /> {s.email}</span>}
                    </div>
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">{s.species}{s.breed ? ` — ${s.breed}` : ''}</span>
                      {s.age && <span className="text-gray-500"> · {s.age}</span>}
                      {s.is_vaccinated && <span className="text-gray-500"> · Vaksinuar: {s.is_vaccinated}</span>}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Arsyeja: {s.reason}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button onClick={() => setSelected(s)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-white/5">
                      <Eye size={13} /> Shiko
                    </button>
                    {s.status === 'New' && (
                      <button onClick={() => handleContact(s.surrender_id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-yellow-400 hover:text-yellow-300 bg-yellow-900/20 hover:bg-yellow-900/30 transition-all cursor-pointer border border-yellow-900/30">
                        <Phone size={13} /> Kontakto
                      </button>
                    )}
                    {(s.status === 'New' || s.status === 'Contacted') && (
                      <>
                        <button onClick={() => { setAcceptModal(s); setAcceptForm({ name: '', health_status: 'Shëndetshëm', gender: 'E panjohur', description: s.notes || '' }) }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-green-400 hover:text-green-300 bg-green-900/20 hover:bg-green-900/30 transition-all cursor-pointer border border-green-900/30">
                          <Heart size={13} /> Prano
                        </button>
                        <button onClick={() => { setRejectId(s.surrender_id); setRejectReason('') }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30 transition-all cursor-pointer border border-red-900/30">
                          <X size={13} /> Refuzo
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border my-6" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#334155' }}>
              <h2 className="text-lg font-bold text-white">Detajet e kërkesës #{selected.surrender_id}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white cursor-pointer p-1"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Owner */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Pronari</p>
                <p className="text-white font-semibold">{selected.owner_name}</p>
                <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1"><Phone size={12} /> {selected.phone}</p>
                {selected.email && <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-0.5"><Mail size={12} /> {selected.email}</p>}
              </div>
              {/* Animal */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Kafsha</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-500">Lloji:</span> <span className="text-white">{selected.species}</span></div>
                  {selected.breed && <div><span className="text-gray-500">Raca:</span> <span className="text-white">{selected.breed}</span></div>}
                  {selected.age && <div><span className="text-gray-500">Mosha:</span> <span className="text-white">{selected.age}</span></div>}
                  {selected.is_vaccinated && <div><span className="text-gray-500">Vaksinuar:</span> <span className="text-white">{selected.is_vaccinated}</span></div>}
                </div>
              </div>
              {/* Reason */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Arsyeja</p>
                <p className="text-sm text-white">{selected.reason}</p>
                {selected.notes && <p className="text-sm text-gray-400 mt-1">{selected.notes}</p>}
              </div>
              {/* Photos */}
              {selected.media.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Foto</p>
                  <div className="flex gap-2 flex-wrap">
                    {selected.media.map(m => (
                      <img key={m.media_id} src={m.file_url} alt=""
                        className="w-20 h-20 rounded-xl object-cover border border-white/10" />
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Actions inside modal */}
            {(selected.status === 'New' || selected.status === 'Contacted') && (
              <div className="flex gap-3 px-5 pb-5">
                <button
                  onClick={() => { setAcceptModal(selected); setAcceptForm({ name: '', health_status: 'Shëndetshëm', gender: 'E panjohur', description: selected.notes || '' }); setSelected(null) }}
                  className="flex-1 bg-green-700 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2">
                  <Heart size={14} /> Prano & Shto në Adoptim
                </button>
                <button onClick={() => { setRejectId(selected.surrender_id); setRejectReason(''); setSelected(null) }}
                  className="flex-1 border border-white/10 text-gray-400 hover:text-white py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer">
                  Refuzo
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Accept modal */}
      {acceptModal && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#334155' }}>
              <div>
                <h2 className="text-lg font-bold text-white">Prano & Shto në Adoptim 🐾</h2>
                <p className="text-xs text-gray-500 mt-0.5">{acceptModal.species}{acceptModal.breed ? ` · ${acceptModal.breed}` : ''}</p>
              </div>
              <button onClick={() => setAcceptModal(null)} className="text-gray-500 hover:text-white cursor-pointer p-1"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-xs text-gray-400 bg-white/5 rounded-xl px-4 py-3">
                Kafsha do të shfaqet menjëherë në listën e adoptimit si <span className="text-white font-medium">"E panjohur"</span>. Mund ta riemërtoni nga faqja e kafshëve.
              </p>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Emri (opsionale)</label>
                <input placeholder="Lëreni bosh për &quot;E panjohur&quot;"
                  value={acceptForm.name} onChange={e => setAcceptForm(f => ({ ...f, name: e.target.value }))}
                  className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Gjinia</label>
                  <div className="relative">
                    <select value={acceptForm.gender} onChange={e => setAcceptForm(f => ({ ...f, gender: e.target.value }))}
                      className={selectCls}>
                      {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Shëndeti</label>
                  <div className="relative">
                    <select value={acceptForm.health_status} onChange={e => setAcceptForm(f => ({ ...f, health_status: e.target.value }))}
                      className={selectCls}>
                      {HEALTH_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Përshkrimi (opsionale)</label>
                <textarea rows={3} placeholder="Lëreni bosh për të përdorur shënimet e pronarit..."
                  value={acceptForm.description} onChange={e => setAcceptForm(f => ({ ...f, description: e.target.value }))}
                  className={`${inputCls} resize-none`} />
              </div>
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <button onClick={() => setAcceptModal(null)}
                className="flex-1 border border-white/10 text-gray-400 hover:text-white py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer">
                Anulo
              </button>
              <button onClick={handleAccept} disabled={accepting}
                className="flex-1 bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2">
                {accepting
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Duke shtuar...</>
                  : <><Heart size={14} /> Shto në Adoptim</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject confirm */}
      {rejectId !== null && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl border p-6" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
            <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <X size={22} className="text-red-400" />
            </div>
            <h3 className="text-white font-bold text-lg text-center mb-2">Refuzo kërkesën?</h3>
            <p className="text-gray-400 text-sm text-center mb-4">
'Shkruani arsyen e refuzimit (opsionale).'
            </p>
            <div className="mb-4">
              <label className="text-xs text-gray-400 uppercase tracking-wide mb-1.5 block">Arsyeja e refuzimit</label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="p.sh. Strehimorja është plot momentalisht..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setRejectId(null)}
                className="flex-1 border border-white/10 text-gray-400 hover:text-white py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer">
                Anulo
              </button>
              <button onClick={handleReject} disabled={rejecting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2">
                {rejecting
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Duke refuzuar...</>
                  : 'Po, refuzo'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}