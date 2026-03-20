import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, BookOpen, Heart, FileSearch, PawPrint } from 'lucide-react'
import { ARTICLES } from './EducationPage'

const CATEGORY_STYLES: Record<string, { bg: string; color: string }> = {
  'Adoptim': { bg: '#fef2f2', color: '#e02424' },
  'Kujdes':  { bg: '#fdf2f8', color: '#be185d' },
  'Shëndet': { bg: '#f0fdf4', color: '#16a34a' },
  'Trajnim': { bg: '#f5f3ff', color: '#7c3aed' },
  'Mjedis':  { bg: '#ecfdf5', color: '#059669' },
}

function renderContent(content: string) {
  return content.trim().split('\n\n').map((block, i) => {
    if (block.startsWith('**') && block.endsWith('**') && !block.slice(2).includes('**')) {
      return (
        <h3 key={i} className="text-xl font-black mt-10 mb-3" style={{ color: '#111827' }}>
          {block.slice(2, -2)}
        </h3>
      )
    }
    const parts = block.split(/(\*\*[^*]+\*\*)/)
    return (
      <p key={i} className="leading-relaxed mb-5 text-base" style={{ color: '#4b5563' }}>
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} style={{ color: '#111827', fontWeight: 800 }}>{part.slice(2, -2)}</strong>
            : part
        )}
      </p>
    )
  })
}

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setTimeout(() => setVisible(true), 80)
  }, [id])

  const article = ARTICLES.find(a => a.id === Number(id))
  const catStyle = article ? (CATEGORY_STYLES[article.category] ?? { bg: '#f9fafb', color: '#6b7280' }) : null

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf9f7' }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f9fafb' }}>
            <FileSearch size={28} style={{ color: '#d1d5db' }} />
          </div>
          <p className="font-semibold mb-4" style={{ color: '#374151' }}>Artikulli nuk u gjet.</p>
          <Link to="/edukim" className="font-bold text-sm" style={{ color: '#e02424' }}>← Kthehu te Edukimi</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#faf9f7', minHeight: '100vh' }}>

      {/* HERO */}
      <section className="relative pb-16 px-6 text-center overflow-hidden" style={{ paddingTop: '7rem', backgroundColor: article.accent }}>
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${article.accent}ee 0%, ${article.accent}bb 100%)` }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 text-4xl" style={{ backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
            {article.emoji}
          </div>
          <div className="mb-4">
            <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/90" style={{ color: catStyle!.color }}>
              {article.category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-5 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-5 text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
            <span className="flex items-center gap-1.5"><Clock size={13} /> {article.readTime} lexim</span>
            <span className="flex items-center gap-1.5"><BookOpen size={13} /> Bashkia Tiranë</span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-2xl mx-auto px-6 py-12"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.5s ease' }}>

        <Link to="/edukim"
          className="inline-flex items-center gap-2 text-sm font-semibold mb-8 transition-opacity hover:opacity-60"
          style={{ color: '#374151' }}>
          <ArrowLeft size={15} /> Kthehu te Edukimi
        </Link>

        {/* Excerpt */}
        <div className="rounded-2xl p-6 mb-8" style={{ backgroundColor: article.color, borderLeft: `4px solid ${article.accent}` }}>
          <p className="font-semibold leading-relaxed text-base" style={{ color: '#111827' }}>{article.excerpt}</p>
        </div>

        {/* Body */}
        <div>{renderContent(article.content)}</div>

        <div className="my-10" style={{ borderTop: '1px solid #f3f4f6' }} />

        {/* Related articles */}
        <div>
          <h3 className="text-lg font-black mb-4" style={{ color: '#111827' }}>Artikuj të tjerë</h3>
          <div className="space-y-3">
            {ARTICLES.filter(a => a.id !== article.id).slice(0, 3).map(a => {
              const aStyle = CATEGORY_STYLES[a.category] ?? { bg: '#f9fafb', color: '#6b7280' }
              return (
                <Link key={a.id} to={`/edukim/artikull/${a.id}`}
                  className="flex items-center gap-4 bg-white rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  style={{ border: '1px solid #f3f4f6' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: a.color }}>
                    {a.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold line-clamp-1" style={{ color: '#111827' }}>{a.title}</p>
                    <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: '#9ca3af' }}>
                      <Clock size={10} /> {a.readTime} lexim
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-lg shrink-0" style={{ backgroundColor: aStyle.bg, color: aStyle.color }}>
                    {a.category}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center bg-white rounded-2xl p-10" style={{ border: '1px solid #f3f4f6' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#fef2f2' }}>
            <PawPrint size={24} style={{ color: '#e02424' }} />
          </div>
          <h3 className="font-black text-lg mb-2" style={{ color: '#111827' }}>Gati të adoptoni?</h3>
          <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Gjeni shokun tuaj të ri sot.</p>
          <Link to="/adopto"
            className="inline-flex items-center gap-2 text-white px-7 py-3 rounded-2xl text-sm font-bold transition-all hover:opacity-90"
            style={{ backgroundColor: '#e02424', boxShadow: '0 4px 16px rgba(224,36,36,0.25)' }}>
            <Heart size={14} /> Shiko kafshët
          </Link>
        </div>
      </div>
    </div>
  )
}