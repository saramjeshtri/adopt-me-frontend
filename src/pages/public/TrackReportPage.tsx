import { useState, useEffect, useRef } from 'react'
import { Search, Shield, Clock, CheckCircle, AlertCircle, Loader, MapPin, Phone, Mail, FileText, ArrowRight } from 'lucide-react'
import { getReport } from '../../api/client'
import type { Report } from '../../types'

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
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
    }}>{children}</div>
  )
}

function statusBadgeClass(status: string) {
  if (status === 'Hapur') return 'bg-red-100 text-red-700'
  if (status === 'Në proces') return 'bg-yellow-100 text-yellow-700'
  if (status.startsWith('Zgjidhur')) return 'bg-green-100 text-green-700'
  return 'bg-gray-100 text-gray-600'
}

function StatusTimeline({ status }: { status: string }) {
  const steps = [
    { key: 'Hapur',     label: 'Hapur',     icon: FileText },
    { key: 'Në proces', label: 'Në proces', icon: Loader },
    { key: 'Zgjidhur',  label: 'Zgjidhur',  icon: CheckCircle },
  ]
  const currentIndex = status?.startsWith('Zgjidhur') ? 2 : status === 'Në proces' ? 1 : 0

  return (
    <div className="flex items-center gap-0 mb-6">
      {steps.map((s, i) => {
        const Icon = s.icon
        const done   = i < currentIndex
        const active = i === currentIndex
        return (
          <div key={s.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={done
                  ? { backgroundColor: '#16a34a', color: 'white' }
                  : active
                    ? { backgroundColor: '#e02424', color: 'white', boxShadow: '0 4px 12px rgba(224,36,36,0.3)' }
                    : { backgroundColor: '#f3f4f6', color: '#d1d5db' }}>
                <Icon size={18} />
              </div>
              <span className="text-xs mt-1.5 font-semibold text-center leading-tight"
                style={{ color: done ? '#16a34a' : active ? '#e02424' : '#d1d5db' }}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-1 mb-4 rounded-full transition-colors"
                style={{ backgroundColor: done ? '#bbf7d0' : '#e5e7eb' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3 items-start py-2.5" style={{ borderBottom: '1px solid #f9fafb' }}>
      <div className="mt-0.5 shrink-0" style={{ color: '#9ca3af' }}>{icon}</div>
      <span className="text-xs font-bold uppercase tracking-wide w-24 shrink-0 pt-0.5" style={{ color: '#9ca3af' }}>{label}</span>
      <span className="text-sm flex-1" style={{ color: '#374151' }}>{value}</span>
    </div>
  )
}

export default function TrackReportPage() {
  const [reportId, setReportId] = useState('')
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    if (id) { setReportId(id); doSearch(id) }
  }, [])

  const doSearch = async (id: string) => {
    const parsed = parseInt(id)
    if (!parsed || isNaN(parsed)) { setError('Ju lutem shkruani një ID të vlefshme.'); return }
    setLoading(true); setError(null); setReport(null); setSearched(true)
    try {
      const data = await getReport(parsed)
      setReport(data)
    } catch (err: any) {
      if (err?.response?.status === 404) setError('Nuk u gjet asnjë raport me këtë ID.')
      else setError('Diçka shkoi keq. Provoni përsëri.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => doSearch(reportId)

  return (
    <div style={{ backgroundColor: '#f5f0eb', minHeight: '100vh' }}>

      {/* HERO */}
      <section className="relative overflow-hidden text-center" style={{ paddingTop: '7rem', paddingBottom: '5rem', background: 'linear-gradient(135deg, #065f46 0%, #0e7490 100%)' }}>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 60%, #f5f0eb 100%)' }} />
        <FadeUp className="relative z-10 px-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}>
            <Search size={28} style={{ color: 'white' }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 text-white">Gjurmo Raportin</h1>
          <p className="max-w-md mx-auto text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Shkruani ID-në e raportit tuaj për të parë statusin aktual të rastit.
          </p>
        </FadeUp>
      </section>

      <div className="max-w-xl mx-auto px-4 md:px-6 py-10">

        {/* Search box */}
        <FadeUp delay={100}>
          <div className="bg-white rounded-2xl p-6 mb-6" style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
            <label className="text-xs font-bold uppercase tracking-wide mb-2 block" style={{ color: '#9ca3af' }}>
              ID e Raportit
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                value={reportId}
                onChange={e => setReportId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="p.sh. 1042"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 bg-gray-50 focus:bg-white transition-all"
                style={{ color: '#111827' }}
              />
              <button onClick={handleSearch} disabled={loading || !reportId}
                className="inline-flex items-center gap-2 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: '#e02424' }}>
                {loading
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Search size={16} />}
                Kërko
              </button>
            </div>
          </div>
        </FadeUp>

        {/* Error */}
        {error && (
          <FadeUp>
            <div className="rounded-xl px-4 py-3 mb-6 flex gap-2 items-center text-sm" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#e02424' }}>
              <AlertCircle size={16} className="shrink-0" /> {error}
            </div>
          </FadeUp>
        )}

        {/* Report result */}
        {report && (
          <FadeUp>
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>

              {/* Header */}
              <div className="p-6" style={{ borderBottom: '1px solid #f9fafb' }}>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#9ca3af' }}>Raporti #{report.report_id}</p>
                    <h2 className="text-xl font-black" style={{ color: '#111827' }}>{report.report_type}</h2>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${statusBadgeClass(report.report_status)}`}>
                    {report.report_status}
                  </span>
                </div>
                <StatusTimeline status={report.report_status} />
              </div>

              {/* Details */}
              <div className="px-6 py-2">
                <DetailRow icon={<MapPin size={14} />} label="Vendndodhja" value={report.location_address} />
                <DetailRow icon={<Clock size={14} />} label="Dërguar më" value={new Date(report.created_at).toLocaleDateString('sq-AL', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} />
                {report.resolved_at && <DetailRow icon={<CheckCircle size={14} />} label="Zgjidhur më" value={new Date(report.resolved_at).toLocaleDateString('sq-AL', { year: 'numeric', month: 'long', day: 'numeric' })} />}
                {report.department?.department_name && <DetailRow icon={<Shield size={14} />} label="Departamenti" value={report.department.department_name} />}
                {report.phoneNr && <DetailRow icon={<Phone size={14} />} label="Telefon" value={report.phoneNr} />}
                {report.email && <DetailRow icon={<Mail size={14} />} label="Email" value={report.email} />}
              </div>

              {/* Description */}
              <div className="mx-6 mb-5 mt-3 rounded-2xl p-4" style={{ backgroundColor: '#f5f0eb' }}>
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#9ca3af' }}>Përshkrimi</p>
                <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{report.report_description}</p>
              </div>

              {/* Media */}
              {report.media && report.media.length > 0 && (
                <div className="px-6 pb-6">
                  <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#9ca3af' }}>Foto / Video</p>
                  <div className="flex gap-3 flex-wrap">
                    {report.media.map(m => {
                      const isVideo = /\.(mp4|mov|avi|webm|mkv)$/i.test(m.file_url) || m.media_type === 'video'
                      return isVideo ? (
                        <video key={m.media_id} src={m.file_url} controls className="rounded-2xl border max-h-48" style={{ borderColor: '#f3f4f6' }} />
                      ) : (
                        <a key={m.media_id} href={m.file_url} target="_blank" rel="noreferrer"
                          className="w-20 h-20 rounded-2xl overflow-hidden block hover:opacity-80 transition-opacity"
                          style={{ border: '2px solid #f3f4f6' }}>
                          <img src={m.file_url} alt="" className="w-full h-full object-cover" />
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Help footer */}
              <div className="mx-6 mb-6 rounded-2xl p-4 flex items-center gap-4" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                <div className="flex-1">
                  <p className="text-sm font-bold mb-0.5" style={{ color: '#111827' }}>Keni pyetje?</p>
                  <p className="text-xs" style={{ color: '#6b7280' }}>Kontaktoni stafin tonë në <span className="font-bold">0800 0888</span></p>
                </div>
                <a href="tel:08000888" className="text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 transition-all hover:opacity-80 whitespace-nowrap text-white"
                  style={{ backgroundColor: '#e02424' }}>
                  Telefono <ArrowRight size={11} />
                </a>
              </div>
            </div>
          </FadeUp>
        )}

        {/* Empty state */}
        {!searched && !loading && (
          <FadeUp delay={150}>
            <div className="bg-white rounded-2xl p-8 text-center" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="text-4xl mb-4">📋</div>
              <p className="font-bold mb-2" style={{ color: '#111827' }}>Kërkoni raportin tuaj</p>
              <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
                ID-ja e raportit ju jepet menjëherë pas dërgimit.<br />Ruajeni atë numër për të ndjekur statusin e çështjes suaj.
              </p>
            </div>
          </FadeUp>
        )}

      </div>
    </div>
  )
}