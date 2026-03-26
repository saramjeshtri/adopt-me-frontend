import { useRef, useEffect, useState } from 'react'
import { Heart, Shield, PawPrint, Phone, CheckCircle, QrCode } from 'lucide-react'
import { Link } from 'react-router-dom'

// QR code image — spaces in filename handled via ?url import
import qrCode from '../../assets/images/Donacion për K-qrcode.png'

// Tell TypeScript that PayPal SDK exists on window
declare global {
  interface Window { paypal?: any }
}

// ── FadeUp animation wrapper ─────────────────────────────────
function FadeUp({
  children, delay = 0, className = '',
}: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.05 }
    )
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

// ── PayPal hosted button ─────────────────────────────────────
// Renders the official PayPal stacked button — user picks amount on PayPal side
function PayPalButton() {
  const rendered = useRef(false)

  useEffect(() => {
    if (rendered.current) return

    const tryRender = () => {
      if (window.paypal) {
        rendered.current = true
        window.paypal.HostedButtons({
          hostedButtonId: '66RTHQP9VC63G',
        }).render('#paypal-container-66RTHQP9VC63G')
      } else {
        setTimeout(tryRender, 300)
      }
    }

    tryRender()
  }, [])

  return (
    <div
      id="paypal-container-66RTHQP9VC63G"
      style={{
        minWidth: '300px',
        width: '100%',
        overflow: 'hidden',
      }}
    />
  )
}

// ── Main page ────────────────────────────────────────────────
export default function DonatePage() {
  const success = new URLSearchParams(window.location.search).get('success') === '1'

  return (
    <div style={{ backgroundColor: '#faf9f7', minHeight: '100vh' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        className="relative pt-36 pb-20 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #dc2626 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, transparent 60%, #faf9f7 100%)',
        }} />
        <FadeUp className="relative z-10 px-6 max-w-3xl mx-auto">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            <Heart size={28} className="text-white" fill="white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
            Ndihmo kafshët<br />me një donacion.
          </h1>
          <p className="max-w-lg mx-auto text-base leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.8)' }}>
            Çdo kontribut ndihmon në ushqimin, kujdesin mjekësor dhe strehimin
            e kafshëve të braktisuara në Tiranë.
          </p>
        </FadeUp>
      </section>

      {/* ── SUCCESS BANNER ───────────────────────────────── */}
      {success && (
        <div className="max-w-xl mx-auto px-6 mt-8">
          <div className="bg-white rounded-2xl p-6 flex items-center gap-4" style={{
            border: '1px solid #dcfce7',
            boxShadow: '0 4px 20px rgba(22,163,74,0.1)',
          }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#f0fdf4' }}>
              <CheckCircle size={24} style={{ color: '#16a34a' }} />
            </div>
            <div>
              <p className="font-black" style={{ color: '#111827' }}>
                Faleminderit për donacionin!
              </p>
              <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
                Kontributi juaj do të ndihmojë kafshët në nevojë.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN GRID ────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-2 gap-14">

        {/* LEFT — Why donate + impact tiers + QR */}
        <FadeUp>
          <div className="space-y-6">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
                style={{ color: '#7c3aed' }}>
                Pse të dhuroni?
              </p>
              <h2 className="text-2xl md:text-3xl font-black mb-4" style={{ color: '#111827' }}>
                Çdo para e dhuruar bën ndryshimin.
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>
                Strehimorja e Bashkisë së Tiranës kujdeset çdo ditë për dhjetëra kafshë
                të braktisuara. Donacionet tona mbulojnë ushqimin, vaksinat, kujdesin
                veterinar dhe pajisjet e nevojshme.
              </p>
            </div>

            {/* Impact tiers */}
            <div className="space-y-3">
              {[
                { icon: <PawPrint size={18} />, title: '500 ALL',   desc: 'Ushqim për një kafshë për një javë', color: '#fef2f2', iconColor: '#dc2626' },
                { icon: <Shield size={18} />,   title: '1,000 ALL', desc: 'Vaksinim bazë i një kafshe',         color: '#f5f3ff', iconColor: '#7c3aed' },
                { icon: <Heart size={18} />,    title: '2,000 ALL', desc: 'Kujdes veterinar për një muaj',      color: '#f0fdf4', iconColor: '#16a34a' },
                { icon: <Heart size={18} />,    title: '5,000 ALL', desc: 'Sterilizim i një kafshe',            color: '#eff6ff', iconColor: '#2563eb' },
              ].map(({ icon, title, desc, color, iconColor }) => (
                <div key={title} className="flex items-center gap-4 bg-white rounded-2xl p-4"
                  style={{ border: '1px solid #f3f4f6' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: color, color: iconColor }}>
                    {icon}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#111827' }}>{title}</p>
                    <p className="text-xs" style={{ color: '#9ca3af' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* QR Code card */}
            <div className="bg-white rounded-2xl p-5 flex items-center gap-5"
              style={{ border: '1px solid #f3f4f6', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <img
                src={qrCode}
                alt="QR Code për donacion"
                className="w-24 h-24 rounded-xl object-contain shrink-0"
                style={{ border: '1px solid #f3f4f6' }}
              />
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <QrCode size={14} style={{ color: '#7c3aed' }} />
                  <p className="text-xs font-bold uppercase tracking-wide"
                    style={{ color: '#7c3aed' }}>
                    Skano për të dhuruar
                  </p>
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: '#111827' }}>
                  Donacion për Kafshët
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#9ca3af' }}>
                  Skanoni kodin QR me celularin tuaj për të dhuruar shpejt pa hapur faqen.
                </p>
              </div>
            </div>

            {/* Security note */}
            <div className="rounded-2xl p-5"
              style={{ backgroundColor: '#faf9f7', border: '1px solid #f3f4f6' }}>
              <p className="text-xs leading-relaxed" style={{ color: '#9ca3af' }}>
                🔒 Pagesat processohen nga{' '}
                <strong style={{ color: '#6b7280' }}>PayPal</strong> — platforma më e sigurt
                e pagesave online. Të dhënat tuaja bankare nuk ruhen asnjëherë nga ne.
              </p>
            </div>
          </div>
        </FadeUp>

        {/* RIGHT — PayPal hosted button */}
        <FadeUp delay={120}>
          <div className="bg-white rounded-3xl overflow-hidden" style={{
            border: '1px solid #f3f4f6',
            boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          }}>
            <div className="p-7">
              <h3 className="font-black text-lg mb-1" style={{ color: '#111827' }}>
                Bëni një donacion
              </h3>
              <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>
                Klikoni butonin — PayPal do t'ju lejojë të zgjidhni shumën vetë.
              </p>

              {/* PayPal renders here */}
              <PayPalButton />

              <p className="text-center text-xs mt-5" style={{ color: '#d1d5db' }}>
                Do të ridrejtoheni te PayPal për të kompletuar pagesën
              </p>
            </div>
          </div>
        </FadeUp>
      </div>

      {/* ── BOTTOM CTA ───────────────────────────────────── */}
      <FadeUp>
        <section
          className="mx-4 md:mx-8 mb-16 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2020 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />
          <div className="relative z-10">
            <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Preferoni të ndihmoni ndryshe?
            </p>
            <h3 className="text-xl font-black mb-6" style={{ color: '#ffffff' }}>
              Ka mënyra të tjera për të kontribuar
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/adopto"
                className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
                style={{ backgroundColor: '#dc2626', boxShadow: '0 4px 14px rgba(220,38,38,0.4)' }}>
                <PawPrint size={14} /> Adopto një kafshë
              </Link>
              <Link to="/raporto"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-80 transition-all"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}>
                <Shield size={14} /> Raporto një rast
              </Link>
              <Link to="/kontakt"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-80 transition-all"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}>
                <Phone size={14} /> Na kontaktoni
              </Link>
            </div>
          </div>
        </section>
      </FadeUp>

    </div>
  )
}