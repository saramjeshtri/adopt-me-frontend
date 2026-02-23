import { useEffect, useState, useRef } from 'react'
import { Search, Eye, X, CheckCircle, AlertCircle, Upload } from 'lucide-react'
import { adminGetAnimals, adminUpdateAnimal, adminUploadAnimalPhoto } from '../../api/client'
import type { Animal } from '../../types'

const SPECIES  = ['Qen', 'Mace', 'Zog', 'Kalë', 'Tjetër']
const GENDERS  = ['Mashkull', 'Femër', 'E panjohur']
const HEALTH   = ['Shëndetshëm', 'I lënduar', 'Në trajtim']
const ADOPTIONS = ['Disponueshme', 'Takim i planifikuar', 'Adoptuar', 'Jo disponueshme']

function adoptionBadge(status: string) {
  const base = 'text-xs font-semibold px-2.5 py-1 rounded-full'
  if (status === 'Disponueshme')        return `${base} bg-green-900/40 text-green-400`
  if (status === 'Takim i planifikuar') return `${base} bg-yellow-900/40 text-yellow-400`
  if (status === 'Adoptuar')            return `${base} bg-blue-900/40 text-blue-400`
  return `${base} bg-gray-700 text-gray-400`
}

export default function AdminAnimalsPage() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterAdoption, setFilterAdoption] = useState('')
  const [selected, setSelected] = useState<Animal | null>(null)
  const [updateForm, setUpdateForm] = useState<any>({})
  const [updating, setUpdating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
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

  const openDetail = (a: Animal) => {
    setSelected(a)
    setUpdateForm({
      name:           a.name          ?? '',
      species:        a.species       ?? '',
      breed:          a.breed         ?? '',
      age_estimate:   a.age_estimate  ?? '',
      gender:         a.gender        ?? 'E panjohur',
      description:    a.description   ?? '',
      health_status:  a.health_status ?? 'Shëndetshëm',
      adoption_status: a.adoption_status ?? '',
    })
  }

  const handleUpdate = async () => {
    if (!selected) return
    setUpdating(true)
    try {
      const payload: any = { ...updateForm }
      // clean empty strings → undefined
      Object.keys(payload).forEach(k => { if (payload[k] === '') payload[k] = undefined })
      await adminUpdateAnimal(selected.animal_id, payload)
      showToast('success', 'Kafsha u përditësua me sukses.')
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
      // refresh selected animal photos
      const updated = await adminGetAnimals({}).then((list: Animal[]) =>
        list.find((a: Animal) => a.animal_id === selected.animal_id)
      )
      if (updated) setSelected(updated)
    } catch {
      showToast('error', 'Ngarkimi i fotos dështoi.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const setForm = (key: string, val: string) => setUpdateForm((f: any) => ({ ...f, [key]: val }))

  const filtered = animals.filter(a =>
    !search ||
    (a.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    a.species.toLowerCase().includes(search.toLowerCase()) ||
    String(a.animal_id).includes(search)
  )

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
          <h1 className="text-2xl font-bold text-white mb-1">Kafshët</h1>
          <p className="text-gray-500 text-sm">{animals.length} kafshë gjithsej</p>
        </div>
      </div>

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
              {filtered.map((a, i) => {
                const primaryPhoto = a.photos?.find(p => p.is_primary) ?? a.photos?.[0]
                return (
                  <tr key={a.animal_id}
                    className="border-t hover:bg-white/5 transition-colors"
                    style={{ borderColor: '#1e293b', backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    <td className="px-4 py-3">
                      {primaryPhoto
                        ? <img src={primaryPhoto.photo_url} alt="" className="w-10 h-10 rounded-xl object-cover" />
                        : <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                            {a.species === 'Qen' ? '🐕' : a.species === 'Mace' ? '🐈' : '🐾'}
                          </div>
                      }
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400 font-mono">#{a.animal_id}</td>
                    <td className="px-4 py-3 text-sm text-white font-medium">{a.name ?? 'Pa emër'}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{a.species}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{a.health_status ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={adoptionBadge(a.adoption_status)}>{a.adoption_status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => openDetail(a)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                        <Eye size={14} /> Shiko
                      </button>
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
              <div>
                <h2 className="text-lg font-bold text-white">{selected.name ?? 'Pa emër'}</h2>
                <p className="text-gray-400 text-sm">Kafshë #{selected.animal_id}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white transition-colors cursor-pointer p-1">
                <X size={20} />
              </button>
            </div>

            {/* Photos */}
            <div className="p-5 border-b" style={{ borderColor: '#334155' }}>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Fotot</p>
              <div className="flex gap-3 flex-wrap mb-3">
                {selected.photos && selected.photos.length > 0
                  ? selected.photos.map((p: any) => (
                      <div key={p.photo_id} className="relative">
                        <img src={p.photo_url} alt="" className={`w-20 h-20 rounded-xl object-cover border-2 ${p.is_primary ? 'border-red-500' : 'border-transparent'}`} />
                        {p.is_primary && (
                          <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">★</span>
                        )}
                      </div>
                    ))
                  : <p className="text-gray-500 text-sm">Nuk ka foto.</p>
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                className="inline-flex items-center gap-2 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer">
                {uploading
                  ? <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  : <Upload size={14} />
                }
                {uploading ? 'Duke ngarkuar...' : 'Ngarko foto'}
              </button>
            </div>

            {/* Edit form */}
            <div className="p-5 space-y-3">
              <input placeholder="Emri" value={updateForm.name}
                onChange={e => setForm('name', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500" />
              <div className="grid grid-cols-2 gap-3">
                <select value={updateForm.species} onChange={e => setForm('species', e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer">
                  {SPECIES.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
                </select>
                <select value={updateForm.gender} onChange={e => setForm('gender', e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer">
                  {GENDERS.map(g => <option key={g} value={g} className="bg-gray-900">{g}</option>)}
                </select>
              </div>
              <input placeholder="Raca" value={updateForm.breed}
                onChange={e => setForm('breed', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500" />
              <input placeholder="Mosha e vlerësuar" value={updateForm.age_estimate}
                onChange={e => setForm('age_estimate', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500" />
              <div className="grid grid-cols-2 gap-3">
                <select value={updateForm.health_status} onChange={e => setForm('health_status', e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer">
                  {HEALTH.map(h => <option key={h} value={h} className="bg-gray-900">{h}</option>)}
                </select>
                <select value={updateForm.adoption_status} onChange={e => setForm('adoption_status', e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer">
                  {ADOPTIONS.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
                </select>
              </div>
              <textarea placeholder="Përshkrimi" value={updateForm.description}
                onChange={e => setForm('description', e.target.value)}
                rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none" />
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