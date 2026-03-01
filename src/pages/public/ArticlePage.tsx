import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, BookOpen, Heart } from 'lucide-react'
import { ARTICLES } from './EducationPage'

const CATEGORY_COLORS: Record<string, string> = {
  'Adoptim': 'bg-red-100 text-red-700',
  'Kujdes':  'bg-pink-100 text-pink-700',
  'Shëndet': 'bg-green-100 text-green-700',
  'Trajnim': 'bg-purple-100 text-purple-700',
  'Mjedis':  'bg-emerald-100 text-emerald-700',
}

function renderContent(content: string) {
  return content.trim().split('\n\n').map((block, i) => {
    if (block.startsWith('**') && block.endsWith('**') && !block.slice(2).includes('**')) {
      return <h3 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-2">{block.slice(2, -2)}</h3>
    }

    // Inline bold parsing
    const parts = block.split(/(\*\*[^*]+\*\*)/)
    return (
      <p key={i} className="text-gray-600 leading-relaxed mb-3">
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} className="text-gray-900 font-semibold">{part.slice(2, -2)}</strong>
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
    setTimeout(() => setVisible(true), 50)
  }, [id])

  const article = ARTICLES.find(a => a.id === Number(id))

  if (!article) {
    return (
      <div style={{ backgroundColor: '#fdf6f0' }} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📄</div>
          <p className="text-gray-500 font-medium mb-4">Artikulli nuk u gjet.</p>
          <Link to="/edukim" className="text-red-600 hover:text-red-700 font-semibold text-sm">← Kthehu te Edukimi</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#fdf6f0' }} className="min-h-screen">

      {/* HERO */}
      <section className="py-16 md:py-20 text-center relative overflow-hidden"
        style={{ backgroundColor: article.accent }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(0,0,0,0.2) 0%, transparent 60%)' }} />

        <div className="relative z-10 px-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 text-4xl shadow-xl">
            {article.emoji}
          </div>
          <div className="mb-3">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full bg-white/90 ${CATEGORY_COLORS[article.category]}`}>
              {article.category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-1.5"><Clock size={14} /> {article.readTime} lexim</span>
            <span className="flex items-center gap-1.5"><BookOpen size={14} /> Bashkia Tiranë</span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-2xl mx-auto px-4 py-12"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.5s ease' }}>

        {/* Back link */}
        <Link to="/edukim"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-red-600 text-sm font-medium mb-8 transition-colors">
          <ArrowLeft size={16} /> Kthehu te Edukimi
        </Link>

        {/* Excerpt */}
        <div className="rounded-2xl p-5 mb-8 border-l-4" style={{ backgroundColor: article.color, borderColor: article.accent }}>
          <p className="text-gray-700 font-medium leading-relaxed">{article.excerpt}</p>
        </div>

        {/* Article body */}
        <div className="prose-content">
          {renderContent(article.content)}
        </div>

        {/* Divider */}
        <div className="border-t border-orange-100 my-10" />

        {/* Other articles */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Artikuj të tjerë</h3>
          <div className="space-y-3">
            {ARTICLES.filter(a => a.id !== article.id).slice(0, 3).map(a => (
              <Link key={a.id} to={`/edukim/artikull/${a.id}`}
                className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-orange-50 hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: a.color }}>
                  {a.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">{a.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Clock size={10} /> {a.readTime} lexim</p>
                </div>
                <ArrowLeft size={14} className="text-gray-300 rotate-180 shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center bg-white rounded-2xl p-8 border border-orange-50 shadow-sm">
          <div className="text-3xl mb-3">🐾</div>
          <h3 className="font-bold text-gray-900 mb-2">Gati të adoptoni?</h3>
          <p className="text-gray-400 text-sm mb-4">Gjeni shokun tuaj të ri sot.</p>
          <Link to="/adopto"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md shadow-red-200">
            <Heart size={14} /> Shiko kafshët
          </Link>
        </div>
      </div>
    </div>
  )
}