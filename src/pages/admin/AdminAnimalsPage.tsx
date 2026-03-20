import { useEffect, useState, useRef } from 'react'
import { Search, Eye, X, CheckCircle, AlertCircle, Upload, Trash2, ClipboardList, ArrowRight } from 'lucide-react'
import { adminGetAnimals, adminGetAnimal, adminUpdateAnimal, adminUploadAnimalPhoto, adminDeleteAnimalPhoto } from '../../api/client'


const SPECIES   = ['Qen', 'Mace', 'Zog', 'Kalë', 'Tjetër']
const GENDERS   = ['Mashkull', 'Femër', 'E panjohur']
const HEALTH    = ['Shëndetshëm', 'I lënduar', 'Në trajtim']
const ADOPTIONS = ['Draft', 'Disponueshme', 'Takim i planifikuar', 'Adoptuar', 'Jo disponueshme']

function adoptionBadge(status: string) {
  const base = 'text-xs font-semibold px-2.5 py-1 rounded-full'
  if (status === 'Draft')               return `${base} bg-yellow-900/40 text-yellow-400 border border-yellow-700/40`
  if (status === 'Disponueshme')        return `${base} bg-green-900/40 text-green-400`
  if (status === 'Takim i planifikuar') return `${base} bg-blue-900/40 text-blue-400`
  if (status === 'Adoptuar')            return `${base} bg-purple-900/40 text-purple-400`
  return `${base} bg-gray-700 text-gray-400`
}

function profileProgress(a: any): number {
  let score = 0
  if (a.name && !a.name.startsWith('E panjohur')) score += 20
  if (a.breed)                                    score += 20
  if (a.age_estimate)                             score += 20
  if (a.gender && a.gender !== 'E panjohur')      score += 20
  if (a.photos && a.photos.length > 0)            score += 20
  return score
}

function ProgressBar({ value }: { value: number }) {
  const color = value < 40 ? 'bg-red-500' : value < 80 ? 'bg-yellow-500' : 'bg-green-500'
  return (
    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${value}%` }} />
    </div>
  )
}

export default function AdminAnimalsPage() {
  const [animals, setAnimals]             = useState<any[]>([])
  const [loading, setLoading]             = useState(true)
  const [search, setSearch]               = useState('')
  const [filterAdoption, setFilterAdoption] = useState('')
  const [selected, setSelected]           = useState<any | null>(null)
  const [updateForm, setUpdateForm]       = useState<any>({})
  const [updating, setUpdating]           = useState(false)
  const [uploading, setUploading]         = useState(false)
  const [toast, setToast]                 = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [deleting, setDeleting]           = useState(false)
  const [draftMode, setDraftMode]         = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => { load() }, [filterAdoption])

  const load = () => {
    setLoading(true)
    const params: any = {}
    if (filterAdoption) params.adoption_status = filterAdoption
    adminGetAnimals(params)
      .then(setAnimals)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const drafts = animals.filter(a => a.adoption_status === 'Draft')

  const openDetail = async (a: any, completeDraft = false) => {
    setDraftMode(completeDraft)
    setSelected(a)
    setUpdateForm({
      name:            a.name           ?? '',
      species:         a.species        ?? '',
      breed:           a.breed          ?? '',
      age_estimate:    a.age_estimate   ?? '',
      gender:          a.gender         ?? 'E panjohur',
      description:     a.description    ?? '',
      health_status:   a.health_status  ?? 'Shëndetshëm',
      adoption_status: a.adoption_status ?? '',
    })
    try {
      const full = await adminGetAnimal(a.animal_id)
      setSelected(full)
    } catch {}
  }

  const handleUpdate = async (publishAfter = false) => {
    if (!selected) return
    setUpdating(true)
    try {
      const payload: any = { ...updateForm }
      Object.keys(payload).forEach(k => { if (payload[k] === '') payload[k] = undefined })
      if (publishAfter) payload.adoption_status = 'Disponueshme'
      await adminUpdateAnimal(selected.animal_id, payload)
      showToast('success', publishAfter ? 'Kafsha u publikua në adoptim! 🐾' : 'Kafsha u përditësua me sukses.')
      setSelected(null)
      load()
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      showToast('error', typeof detail === 'string' ? detail : 'Ndodhi një gabim.')
    } finally {
      setUpdating(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selected) return
    setUploading(true)
    try {
      await adminUploadAnimalPhoto(selected.animal_id, file)
      showToast('success', 'Fotoja u ngarkua me sukses.')
      const updated = await adminGetAnimal(selected.animal_id)
      setSelected(updated)
      load()
    } catch {
      showToast('error', 'Ngarkimi i fotos dështoi.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const confirmPhotoDelete = async () => {
    if (!selected || confirmDelete === null) return
    setDeleting(true)
    try {
      await adminDeleteAnimalPhoto(selected.animal_id, confirmDelete)
      showToast('success', 'Fotoja u fshi me sukses.')
      const updated = await adminGetAnimal(selected.animal_id)
      setSelected(updated)
      load()
    } catch {
      showToast('error', 'Fshirja e fotos dështoi.')
    } finally {
      setDeleting(false)
      setConfirmDelete(null)
    }
  }

  const setForm = (key: string, val: string) => setUpdateForm((f: any) => ({ ...f, [key]: val }))

  const filtered = animals.filter(a =>
    !search ||
    (a.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    a.species.toLowerCase().includes(search.toLowerCase()) ||
    String(a.animal_id).includes(search)
  )

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
  const selectCls = `${inputCls} cursor-pointer`
  const canPublish = updateForm.name && !updateForm.name.startsWith('E panjohur') &&
                     updateForm.breed && updateForm.age_estimate && updateForm.description &&
                     selected?.photos?.length > 0

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
          <h1 className="text-2xl font-bold text-white mb-1">Kafshët</h1>
          <p className="text-gray-500 text-sm">{animals.length} kafshë gjithsej</p>
        </div>
      </div>

      {/* Draft Banner */}
      {drafts.length > 0 && (
        <div className="rounded-2xl border border-yellow-700/40 bg-yellow-900/20 p-4 mb-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <ClipboardList size={20} className="text-yellow-400" />
          </div>
          <div className="flex-1">
            <p className="text-yellow-300 font-semibold text-sm mb-1">
              {drafts.length} {drafts.length === 1 ? 'kafshë ka' : 'kafshë kanë'} profil të paplotë
            </p>
            <p className="text-yellow-500/80 text-xs mb-3">
              Këto kafshë nuk janë të dukshme për publikun. Plotëso profilet e tyre dhe publiko në listën e adoptimit.
            </p>
            <div className="flex gap-2 flex-wrap">
              {drafts.map(d => (
                <button key={d.animal_id} onClick={() => openDetail(d, true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-600/30 text-yellow-300 text-xs font-medium transition-all cursor-pointer">
                  {d.species === 'Qen' ? '🐕' : d.species === 'Mace' ? '🐈' : '🐾'}
                  {d.name ?? 'E panjohur'} #{d.animal_id}
                  <ArrowRight size={11} />
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setFilterAdoption('Draft')}
            className="text-xs text-yellow-400 hover:text-yellow-300 underline cursor-pointer shrink-0">
            Shiko të gjitha
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Kërko sipas emrit, llojit..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors" />
        </div>
        <select value={filterAdoption} onChange={e => setFilterAdoption(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer">
          <option value="" className="bg-gray-900">Të gjitha statuset</option>
          {ADOPTIONS.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#1e293b' }}>
        {loading ? (
          <div className="p-10 text-center text-gray-500 text-sm">Duke ngarkuar kafshët...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-500 text-sm">Nuk u gjetën kafshë.</div>
        ) : (
          <table className="w-full">
            <thead style={{ backgroundColor: '#1e293b' }}>
              <tr>
                {['Foto', '#ID', 'Emri', 'Lloji', 'Shëndeti', 'Adoptimi', 'Veprime'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a: any, i) => {
                const primaryPhoto = a.photos?.find((p: any) => p.is_primary) ?? a.photos?.[0]
                const isDraft = a.adoption_status === 'Draft'
                return (
                  <tr key={a.animal_id}
                    className={`border-t transition-colors ${isDraft ? 'hover:bg-yellow-900/10' : 'hover:bg-white/5'}`}
                    style={{ borderColor: '#1e293b', backgroundColor: isDraft ? 'rgba(234,179,8,0.04)' : i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    <td className="px-4 py-3">
                      <div className="relative inline-block">
                        {primaryPhoto
                          ? <img src={primaryPhoto.photo_url} alt="" className="w-10 h-10 rounded-xl object-cover" />
                          : <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                              {a.species === 'Qen' ? '🐕' : a.species === 'Mace' ? '🐈' : a.species === 'Zog' ? '🐦' : '🐾'}
                            </div>
                        }
                        {isDraft && (
                          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-500 rounded-full border-2 border-gray-900" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400 font-mono">#{a.animal_id}</td>
                    <td className="px-4 py-3 text-sm text-white font-medium">{a.name ?? 'Pa emër'}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{a.species}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{a.health_status ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={adoptionBadge(a.adoption_status)}>{a.adoption_status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {isDraft ? (
                        <button onClick={() => openDetail(a, true)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer">
                          <ClipboardList size={14} /> Plotëso
                        </button>
                      ) : (
                        <button onClick={() => openDetail(a)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                          <Eye size={14} /> Shiko
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border my-6" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>

            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#334155' }}>
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-2 mb-1">
                  {draftMode && <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-600/30 px-2 py-0.5 rounded-full font-semibold">Draft</span>}
                  <h2 className="text-lg font-bold text-white truncate">{selected.name ?? 'Pa emër'}</h2>
                </div>
                <p className="text-gray-400 text-xs">Kafshë #{selected.animal_id} · {selected.species}</p>
                {draftMode && (
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Plotësia e profilit</span>
                      <span className="text-xs font-semibold text-gray-400">{profileProgress(selected)}%</span>
                    </div>
                    <ProgressBar value={profileProgress(selected)} />
                  </div>
                )}
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white transition-colors cursor-pointer p-1 shrink-0">
                <X size={20} />
              </button>
            </div>

            {draftMode && (
              <div className="mx-5 mt-5 rounded-xl bg-yellow-900/20 border border-yellow-700/30 px-4 py-3 text-xs text-yellow-400">
                <span className="font-semibold">Plotëso profilin</span> — Kjo kafshë është e fshehur nga publiku. Pasi të plotësosh të gjitha fushat dhe të ngarkosh të paktën 1 foto, kliko <span className="font-semibold">"Publiko në Adoptim"</span>.
              </div>
            )}

            {/* Photos */}
            <div className="p-5 border-b" style={{ borderColor: '#334155' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Fotot</p>
                {draftMode && (!selected.photos || selected.photos.length === 0) && (
                  <span className="text-xs text-red-400 font-medium">⚠ Kërkohet të paktën 1 foto</span>
                )}
              </div>
              <div className="flex gap-3 flex-wrap mb-3">
                {selected.photos && selected.photos.length > 0
                  ? selected.photos.map((p: any) => (
                      <div key={p.photo_id} className="relative">
                        <img src={p.photo_url} alt=""
                          className={`w-20 h-20 rounded-xl object-cover border-2 ${p.is_primary ? 'border-red-500' : 'border-transparent'}`} />
                        {p.is_primary && (
                          <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">★</span>
                        )}
                        <button onClick={() => setConfirmDelete(p.photo_id)}
                          className="absolute bottom-1 right-1 w-6 h-6 bg-black/70 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                          <Trash2 size={11} className="text-white" />
                        </button>
                      </div>
                    ))
                  : <p className="text-gray-500 text-sm">Nuk ka foto.</p>
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              {(selected.photos?.length ?? 0) < 5 ? (
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="inline-flex items-center gap-2 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer">
                  {uploading ? <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> : <Upload size={14} />}
                  {uploading ? 'Duke ngarkuar...' : `Ngarko foto (${selected.photos?.length ?? 0}/5)`}
                </button>
              ) : (
                <p className="text-xs text-gray-500">Maksimumi i fotove u arrit (5/5).</p>
              )}
            </div>

            {/* Form */}
            <div className="p-5 space-y-3">
              <div>
                {draftMode && <label className="text-xs text-gray-400 mb-1.5 block">Emri <span className="text-red-400">*</span></label>}
                <input placeholder="Emri" value={updateForm.name} onChange={e => setForm('name', e.target.value)}
                  className={`${inputCls} ${draftMode && !updateForm.name ? 'border-yellow-700/50' : ''}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={updateForm.species} onChange={e => setForm('species', e.target.value)} className={selectCls}>
                  {SPECIES.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
                </select>
                <select value={updateForm.gender} onChange={e => setForm('gender', e.target.value)} className={selectCls}>
                  {GENDERS.map(g => <option key={g} value={g} className="bg-gray-900">{g}</option>)}
                </select>
              </div>
              <div>
                {draftMode && <label className="text-xs text-gray-400 mb-1.5 block">Raca <span className="text-red-400">*</span></label>}
                <input placeholder="Raca" value={updateForm.breed} onChange={e => setForm('breed', e.target.value)}
                  className={`${inputCls} ${draftMode && !updateForm.breed ? 'border-yellow-700/50' : ''}`} />
              </div>
              <div>
                {draftMode && <label className="text-xs text-gray-400 mb-1.5 block">Mosha e vlerësuar <span className="text-red-400">*</span></label>}
                <input placeholder="Mosha e vlerësuar" value={updateForm.age_estimate} onChange={e => setForm('age_estimate', e.target.value)}
                  className={`${inputCls} ${draftMode && !updateForm.age_estimate ? 'border-yellow-700/50' : ''}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={updateForm.health_status} onChange={e => setForm('health_status', e.target.value)} className={selectCls}>
                  {HEALTH.map(h => <option key={h} value={h} className="bg-gray-900">{h}</option>)}
                </select>
                {!draftMode && (
                  <select value={updateForm.adoption_status} onChange={e => setForm('adoption_status', e.target.value)} className={selectCls}>
                    {ADOPTIONS.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
                  </select>
                )}
              </div>
              <div>
                {draftMode && <label className="text-xs text-gray-400 mb-1.5 block">Përshkrimi <span className="text-red-400">*</span></label>}
                <textarea placeholder="Përshkrimi" value={updateForm.description} onChange={e => setForm('description', e.target.value)}
                  rows={3} className={`${inputCls} resize-none ${draftMode && !updateForm.description ? 'border-yellow-700/50' : ''}`} />
              </div>
            </div>

            {/* Actions */}
            {draftMode ? (
              <div className="flex gap-3 px-5 pb-5">
                <button onClick={() => handleUpdate(false)} disabled={updating}
                  className="flex-1 border border-white/10 text-gray-400 hover:text-white py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer">
                  Ruaj si Draft
                </button>
                <button onClick={() => handleUpdate(true)} disabled={updating || !canPublish}
                  title={!canPublish ? 'Plotëso të gjitha fushat dhe ngarko të paktën 1 foto' : ''}
                  className="flex-1 bg-green-700 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2">
                  {updating
                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Duke publikuar...</>
                    : <><CheckCircle size={14} /> Publiko në Adoptim</>
                  }
                </button>
              </div>
            ) : (
              <div className="flex gap-3 px-5 pb-5">
                <button onClick={() => setSelected(null)}
                  className="flex-1 border border-white/10 text-gray-400 hover:text-white py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer">
                  Anulo
                </button>
                <button onClick={() => handleUpdate(false)} disabled={updating}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-white py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2">
                  {updating
                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Duke ruajtur...</>
                    : 'Ruaj ndryshimet'
                  }
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete photo confirm */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl border p-6" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
            <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <h3 className="text-white font-bold text-lg text-center mb-2">Fshi foton?</h3>
            <p className="text-gray-400 text-sm text-center mb-6">Ky veprim është i pakthyeshëm.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 border border-white/10 text-gray-400 hover:text-white py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer">
                Anulo
              </button>
              <button onClick={confirmPhotoDelete} disabled={deleting}
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