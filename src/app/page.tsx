'use client'

import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Target, Search, MessageSquare } from 'lucide-react'

const features = [
  {
    icon: Target,
    title: 'What They Actually Wanted',
    desc: 'Decode the real signals behind every question they asked.',
  },
  {
    icon: Search,
    title: 'Where You Lost Points',
    desc: 'Honest, specific feedback on the answers that hurt you.',
  },
  {
    icon: MessageSquare,
    title: 'Stronger Versions',
    desc: 'See exactly how a better answer would have landed.',
  },
]

export default function LandingPage() {
  const supabase = createClient()

  async function handleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <main className="min-h-screen bg-bg page-fade">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">

        {/* Background blobs */}
        <div aria-hidden style={{
          position: 'absolute', top: '-5%', left: '-8%',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(74,158,255,0.07), transparent 65%)',
          filter: 'blur(50px)',
          pointerEvents: 'none', zIndex: 0,
          animation: 'blobPulse 12s ease-in-out infinite',
        }} />
        <div aria-hidden style={{
          position: 'absolute', bottom: '8%', right: '-6%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(60,100,220,0.06), transparent 65%)',
          filter: 'blur(60px)',
          pointerEvents: 'none', zIndex: 0,
          animation: 'blobPulse 15s ease-in-out infinite reverse',
        }} />
        <div aria-hidden style={{
          position: 'absolute', top: '30%', right: '10%',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(74,158,255,0.04), transparent 65%)',
          filter: 'blur(40px)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Content — above blobs */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>

          {/* 1. Floating icon */}
          <div className="anim-1" style={{ position: 'relative', marginBottom: '28px' }}>
            {/* Ambient glow */}
            <div aria-hidden style={{
              position: 'absolute',
              inset: '-28px',
              background: 'radial-gradient(circle, rgba(74,158,255,0.2) 0%, transparent 70%)',
              pointerEvents: 'none',
              borderRadius: '50%',
            }} />
            <div className="icon-float">
              <Image src="/debrief_icon.png" alt="The Debrief" width={83} height={83} priority />
            </div>
          </div>

          {/* 2. Headline */}
          <h1
            className="anim-2 font-display font-extrabold text-primary"
            style={{
              fontSize: 'clamp(2.6rem, 6.5vw, 4.5rem)',
              lineHeight: 1.06,
              letterSpacing: '-0.03em',
              marginBottom: '20px',
            }}
          >
            Your interview,<br />
            debriefed<span style={{ color: 'var(--color-accent)' }}>.</span>
          </h1>

          {/* 3. Pill badge */}
          <div className="anim-3" style={{ marginBottom: '20px' }}>
            <span className="status-pill">
              <span className="status-dot" />
              AI-Powered Interview Analysis
            </span>
          </div>

          {/* 4. Subheadline */}
          <p
            className="anim-4 text-muted"
            style={{
              maxWidth: '480px',
              lineHeight: 1.7,
              fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
              marginBottom: '32px',
            }}
          >
            Paste in what happened. Get an honest breakdown of where you stood and what to fix.
          </p>

          {/* 5. CTAs */}
          <div className="anim-5" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={handleSignIn}
              className="btn-shimmer"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '0 24px',
                height: '44px',
                fontSize: '14px', fontWeight: 600,
                color: '#fff',
                backgroundColor: 'var(--color-accent)',
                borderRadius: '6px',
                border: 'none',
                transition: 'background-color 150ms ease',
                
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}
            >
              <GoogleIcon />
              Sign in with Google
            </button>

            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '0 20px',
                height: '44px',
                fontSize: '14px', fontWeight: 500,
                color: 'var(--color-muted)',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                transition: 'color 150ms ease, border-color 150ms ease',
                
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.color = 'var(--color-text)'
                el.style.borderColor = 'var(--color-muted)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.color = 'var(--color-muted)'
                el.style.borderColor = 'var(--color-border)'
              }}
            >
              See how it works ↓
            </button>
          </div>
        </div>

        {/* Bottom fade to features */}
        <div aria-hidden style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
          background: 'linear-gradient(to bottom, transparent, var(--color-bg))',
          pointerEvents: 'none', zIndex: 1,
        }} />
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features" style={{ padding: '0 24px 112px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="card-surface card-hover"
                style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', borderRadius: '6px' }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '36px', height: '36px',
                  backgroundColor: 'rgba(74,158,255,0.1)',
                  borderRadius: '6px',
                  color: 'var(--color-accent)',
                  transition: 'background-color 150ms ease',
                }}
                  className="feature-icon"
                >
                  <Icon size={17} />
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--color-text)', marginBottom: '6px' }}>
                    {title}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--color-muted)', lineHeight: 1.65 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p style={{
            textAlign: 'center', fontSize: '12px', color: 'var(--color-muted)',
            marginTop: '48px', lineHeight: 1.65, letterSpacing: '0.01em',
          }}>
            Built for engineers, designers, and everyone who rehearses the call before they make it.
          </p>
        </div>
      </section>

    </main>
  )
}

function GoogleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden style={{ flexShrink: 0 }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}
