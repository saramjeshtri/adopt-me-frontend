import { useState, useEffect } from 'react'
import { Search, Shield, Clock, CheckCircle, AlertCircle, Loader, MapPin, Phone, Mail, FileText } from 'lucide-react'
import { getReport } from '../../api/client'
import type { Report } from '../../types'

function StatusTimeline({ status }: { status: string }) {
  const steps = [
    { key: 'Hapur',    label: 'Hapur',     icon: FileText },
    { key: 'Në proces', label: 'Në proces', icon: Loader  },
    { key: 'zgjidhur', label: 'Zgjidhur',  icon: CheckCircle },
  ]
  const currentIndex =
    status === 'Hapur' ? 0
    : status === 'Në proces' ? 1
    : 2

  return (
    <div className="flex items-center gap-0 mb-6">
      {steps.map((s, i) => {
        const Icon = s.icon
        const done    = i < currentIndex
        const active  = i === currentIndex
        return (
          <div key={s.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
                ${done   ? 'bg-green-500 text-white'
                : active ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                : 'bg-gray-100 text-gray-300'}`}>
                <Icon size={18} />
              </div>
              <span className={`text-xs mt-1.5 font-medium text-center leading-tight
                ${done ? 'text-green-600' : active ? 'text-red-600' : 'text-gray-300'}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-4 transition-colors ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function statusBadgeClass(status: string) {
  if (status === 'Hapur')     return 'bg-red-100 text-red-700'
  if (status === 'Në proces') return 'bg-yellow-100 text-yellow-700'
  if (status.startsWith('Zgjidhur')) return 'bg-green-100 text-green-700'
  return 'bg-gray-100 text-gray-600'
}

export default function TrackReportPage() {
  const [reportId, setReportId] = useState('')
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  // Auto-load if ?id= is in the URL (coming from ReportPage success screen)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const idFromUrl = params.get('id')
    if (idFromUrl) {
      setReportId(idFromUrl)
      doSearch(idFromUrl)
    }
  }, [])

  const doSearch = async (id: string) => {
    const parsed = parseInt(id)
    if (!parsed || isNaN(parsed)) {
      setError('Ju lutem shkruani një ID të vlefshme.')
      return
    }
    setLoading(true)
    setError(null)
    setReport(null)
    setSearched(true)
    try {
      const data = await getReport(parsed)
      setReport(data)
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setError('Nuk u gjet asnjë raport me këtë ID.')
      } else {
        setError('Diçka shkoi keq. Provoni përsëri.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => doSearch(reportId)

  return (
    <div style={{ backgroundColor: '#fdf6f0' }} className="min-h-screen">

      {/* HERO */}
      <section className="bg-gray-900 py-12 md:py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #1d4ed8 0%, transparent 50%), radial-gradient(circle at 70% 50%, #dc2626 0%, transparent 50%)' }}
        />
        <div className="relative z-10 px-4">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-700 rounded-2xl mb-4 shadow-xl shadow-blue-900/50">
            <Search size={28} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            Gjurmo Raportin
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto text-sm md:text-base">
            Shkruani ID-në e raportit tuaj për të parë statusin aktual dhe detajet e çështjes suaj.
          </p>
        </div>
      </section>

      <div className="max-w-xl mx-auto px-4 md:px-6 py-10">

        {/* Search box */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-50 p-6 mb-6">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
            ID e Raportit
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              value={reportId}
              onChange={e => setReportId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="p.sh. 1042"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 bg-gray-50 transition-colors"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !reportId}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Search size={16} />
              }
              Kërko
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6 flex gap-2 items-center">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Report result */}
        {report && (
          <div className="bg-white rounded-2xl shadow-sm border border-orange-50 p-6">

            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Raporti #{report.report_id}</p>
                <h2 className="text-xl font-bold text-gray-900">{report.report_type}</h2>
              </div>
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusBadgeClass(report.report_status)}`}>
                {report.report_status}
              </span>
            </div>

            {/* Timeline */}
            <StatusTimeline status={report.report_status} />

            {/* Details grid */}
            <div className="space-y-3">
              <DetailRow
                icon={<MapPin size={14} className="text-red-400" />}
                label="Vendndodhja"
                value={report.location_address}
              />
              <DetailRow
                icon={<Clock size={14} className="text-blue-400" />}
                label="Dërguar më"
                value={new Date(report.created_at).toLocaleDateString('sq-AL', {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              />
              {report.resolved_at && (
                <DetailRow
                  icon={<CheckCircle size={14} className="text-green-500" />}
                  label="Zgjidhur më"
                  value={new Date(report.resolved_at).toLocaleDateString('sq-AL', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                />
              )}
              {report.department?.department_name && (
                <DetailRow
                  icon={<Shield size={14} className="text-gray-400" />}
                  label="Departamenti"
                  value={report.department.department_name}
                />
              )}
              {report.phoneNr && (
                <DetailRow
                  icon={<Phone size={14} className="text-gray-400" />}
                  label="Telefon"
                  value={report.phoneNr}
                />
              )}
              {report.email && (
                <DetailRow
                  icon={<Mail size={14} className="text-gray-400" />}
                  label="Email"
                  value={report.email}
                />
              )}
            </div>

            {/* Description */}
            <div className="mt-5 bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Përshkrimi</p>
              <p className="text-sm text-gray-700 leading-relaxed">{report.report_description}</p>
            </div>

            {/* Media attachments */}
            {report.media && report.media.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Foto / Video</p>
                <div className="flex gap-3 flex-wrap">
                  {report.media.map(m => (
                    <a
                      key={m.media_id}
                      href={m.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 hover:opacity-80 transition-opacity block"
                    >
                      {m.media_type === 'foto'
                        ? <img src={m.file_url} alt="media" className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-2xl">🎥</div>
                      }
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state after search */}
        {searched && !loading && !report && !error && (
          <div className="text-center py-10 text-gray-400 text-sm">
            Nuk u gjet asnjë raport.
          </div>
        )}

        {/* Info box */}
        {!searched && (
          <div className="bg-white rounded-2xl border border-orange-50 p-5 text-center">
            <div className="text-3xl mb-3">📋</div>
            <p className="text-sm text-gray-500 leading-relaxed">
              ID-ja e raportit tuaj ju jepet menjëherë pas dërgimit të raportit.
              Ruajeni atë numër për të ndjekur statusin e çështjes suaj.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3 items-start py-2 border-b border-gray-50 last:border-0">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <span className="text-xs font-semibold text-gray-400 w-24 shrink-0 uppercase tracking-wide pt-0.5">{label}</span>
      <span className="text-sm text-gray-700 flex-1">{value}</span>
    </div>
  )
}