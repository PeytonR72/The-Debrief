'use client'

import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Menu, X, FileText, Cpu, TrendingUp, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

/* ── Static data ─────────────────────────────────────────── */

const steps = [
  {
    icon: FileText,
    num: '01',
    title: 'Paste the details',
    desc: 'Drop in the job description and walk through what happened in the interview. Questions asked, how you answered, what felt off.',
  },
  {
    icon: Cpu,
    num: '02',
    title: 'AI reads between the lines',
    desc: "Claude analyzes what the company was actually screening for, where your answers landed, and where you lost ground.",
  },
  {
    icon: TrendingUp,
    num: '03',
    title: 'Walk away knowing what to fix',
    desc: "Specific, honest feedback. Stronger versions of your weak answers. Exactly what to prep if there's a next round.",
  },
]

const freeFeatures = [
  '1 debrief per month',
  'Full AI analysis every time',
  'Saved debrief history',
  'No credit card required',
]

const proFeatures = [
  'Unlimited debriefs',
  'Priority analysis',
  'Export to PDF (coming soon)',
  'Email summaries (coming soon)',
]

/* ── Component ───────────────────────────────────────────── */

export default function LandingPage() {
  const supabase = createClient()

  const [menuOpen, setMenuOpen] = useState(false)
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const [proLoading, setProLoading] = useState(false)

  async function handleProClick() {
    setProLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { handleSignIn(); return }
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setProLoading(false)
    }
  }
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false)
  const [waitlistLoading, setWaitlistLoading] = useState(false)

  async function handleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault()
    setWaitlistLoading(true)
    try {
      await supabase.from('waitlist').insert({ email: waitlistEmail })
      setWaitlistSubmitted(true)
    } finally {
      setWaitlistLoading(false)
    }
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  // Intersection Observer — scroll-triggered section reveals
  useEffect(() => {
    const els = document.querySelectorAll('.section-reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Close mobile menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    const close = () => setMenuOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [menuOpen])

  return (
    <div className="min-h-screen bg-bg page-fade">

      {/* ══════════════════════════════════════════════════════
          PUBLIC NAVBAR
      ══════════════════════════════════════════════════════ */}
      <nav
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: '60px',
          zIndex: 100,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(26,29,39,0.88)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
        }}
      >
        {/* Gradient bottom border */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.08) 75%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Left — logo + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <Image src="/debrief_icon.png" alt="The Debrief" width={32} height={32} />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '15px',
              color: 'var(--color-text)',
              letterSpacing: '-0.01em',
            }}
          >
            The Debrief
          </span>
        </div>

        {/* Center — desktop nav links */}
        <div
          className="nav-links-desktop"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            gap: '32px',
          }}
        >
          {[
            { label: 'How It Works', action: () => scrollTo('how-it-works') },
            { label: 'Pricing',      action: () => scrollTo('pricing') },
            { label: 'Sign In',      action: handleSignIn },
          ].map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--color-muted)',
                cursor: 'pointer',
                padding: '4px 0',
                transition: 'color 150ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right — CTA + hamburger */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleSignIn}
            className="btn-shimmer nav-cta-desktop"
            style={{
              padding: '0 18px',
              height: '36px',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
              color: '#fff',
              backgroundColor: 'var(--color-accent)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 150ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}
          >
            Get Started Free
          </button>

          <button
            className="nav-hamburger"
            aria-label="Toggle menu"
            onClick={e => { e.stopPropagation(); setMenuOpen(v => !v) }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-muted)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%', left: 0, right: 0,
              backgroundColor: 'rgba(26,29,39,0.97)',
              borderBottom: '1px solid var(--color-border)',
              padding: '12px 24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {[
              { label: 'How It Works', action: () => scrollTo('how-it-works') },
              { label: 'Pricing',      action: () => scrollTo('pricing') },
              { label: 'Sign In',      action: handleSignIn },
            ].map(({ label, action }) => (
              <button
                key={label}
                onClick={action}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid rgba(42,45,58,0.6)',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--color-muted)',
                  cursor: 'pointer',
                  padding: '13px 0',
                  transition: 'color 150ms ease',
                }}
              >
                {label}
              </button>
            ))}
            <button
              onClick={handleSignIn}
              style={{
                marginTop: '12px',
                height: '44px',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'var(--font-display)',
                color: '#fff',
                backgroundColor: 'var(--color-accent)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Get Started Free
            </button>
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          paddingTop: '120px',
          paddingBottom: '0px',
          paddingLeft: '24px',
          paddingRight: '24px',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Atmospheric blobs */}
        <div aria-hidden style={{
          position: 'absolute', top: '-15%', left: '-15%',
          width: '800px', height: '800px',
          background: 'radial-gradient(circle, rgba(74,158,255,0.07), transparent 65%)',
          filter: 'blur(70px)',
          pointerEvents: 'none', zIndex: 0,
          animation: 'blobPulse 14s ease-in-out infinite',
        }} />
        <div aria-hidden style={{
          position: 'absolute', bottom: '5%', right: '-12%',
          width: '700px', height: '700px',
          background: 'radial-gradient(circle, rgba(50,80,200,0.06), transparent 65%)',
          filter: 'blur(80px)',
          pointerEvents: 'none', zIndex: 0,
          animation: 'blobPulse 18s ease-in-out infinite reverse',
        }} />
        <div aria-hidden style={{
          position: 'absolute', top: '35%', right: '12%',
          width: '450px', height: '450px',
          background: 'radial-gradient(circle, rgba(74,158,255,0.04), transparent 65%)',
          filter: 'blur(50px)',
          pointerEvents: 'none', zIndex: 0,
        }} />
        <div aria-hidden style={{
          position: 'absolute', top: '15%', left: '18%',
          width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(80,120,220,0.05), transparent 65%)',
          filter: 'blur(45px)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Content */}
        <div
          style={{
            position: 'relative', zIndex: 1,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', maxWidth: '920px',
          }}
        >
          {/* 1 — Icon */}
          <div className="lp-anim-1" style={{ position: 'relative', marginBottom: '24px' }}>
            {/* Ambient glow behind icon */}
            <div aria-hidden style={{
              position: 'absolute',
              inset: '-24px',
              background: 'radial-gradient(circle, rgba(74,158,255,0.18) 0%, transparent 70%)',
              pointerEvents: 'none',
              borderRadius: '50%',
            }} />
            <div className="icon-pulse">
              <Image src="/debrief_icon.png" alt="The Debrief" width={120} height={120} priority />
            </div>
          </div>

          {/* 2 — Headline */}
          <h1
            className="lp-anim-2"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(3rem, 7.5vw, 5rem)',
              lineHeight: 1.03,
              letterSpacing: '-0.04em',
              color: 'var(--color-text)',
              marginBottom: '20px',
            }}
          >
            Your interview,<br />
            debriefed<span style={{ color: 'var(--color-accent)' }}>.</span>
          </h1>

          {/* 3 — Pill badge (moved below headline) */}
          <div className="lp-anim-3" style={{ marginBottom: '20px' }}>
            <span className="status-pill">
              <span className="status-dot-success" />
              AI-Powered Interview Analysis
            </span>
          </div>

          {/* 4 — Subheadline */}
          <p
            className="lp-anim-4"
            style={{
              maxWidth: '500px',
              lineHeight: 1.7,
              fontSize: 'clamp(0.95rem, 1.6vw, 1.05rem)',
              color: 'var(--color-muted)',
              marginBottom: '36px',
            }}
          >
            Paste in what happened. Get an honest, structured breakdown of where
            you stood and exactly what to fix before the next round.
          </p>

          {/* 5 — CTAs */}
          <div
            className="lp-anim-5"
            style={{
              display: 'flex', flexWrap: 'wrap', gap: '12px',
              justifyContent: 'center', marginBottom: '18px',
            }}
          >
            <button
              onClick={handleSignIn}
              className="btn-shimmer"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '0 26px',
                height: '48px',
                fontSize: '14px', fontWeight: 600,
                fontFamily: 'var(--font-display)',
                color: '#fff',
                backgroundColor: 'var(--color-accent)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background-color 150ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}
            >
              <GoogleIcon />
              Get Started Free
            </button>

            <button
              onClick={() => scrollTo('how-it-works')}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '0 22px',
                height: '48px',
                fontSize: '14px', fontWeight: 500,
                color: 'var(--color-muted)',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'color 150ms ease, border-color 150ms ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--color-text)'
                e.currentTarget.style.borderColor = 'var(--color-muted)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--color-muted)'
                e.currentTarget.style.borderColor = 'var(--color-border)'
              }}
            >
              See How It Works ↓
            </button>
          </div>

          {/* 6 — Trust line */}
          <p
            className="lp-anim-6"
            style={{
              fontSize: '13px',
              color: 'var(--color-muted)',
              marginBottom: '72px',
              opacity: 0.65,
            }}
          >
            1 free debrief. No credit card. No fluff.
          </p>

          {/* 7 — Product mockup */}
          <div className="lp-anim-7" style={{ width: '100%', maxWidth: '765px', paddingBottom: '40px' }}>
            <div className="mockup-float">
              <div
                className="card-surface"
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 120px rgba(74,158,255,0.08)',
                  margin: '0 auto',
                }}
              >
                {/* Browser chrome */}
                <div
                  style={{
                    height: '40px',
                    backgroundColor: 'rgba(12,14,20,0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px',
                    borderBottom: '1px solid var(--color-border)',
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  {/* Traffic lights */}
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff5f57' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#febc2e' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#28c840' }} />
                  </div>
                  {/* URL bar */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%', transform: 'translateX(-50%)',
                      width: '260px', height: '24px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '4px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: '11px', color: 'var(--color-muted)', letterSpacing: '0.01em' }}>
                      thedebrief.app/debrief/analysis
                    </span>
                  </div>
                </div>

                {/* Screenshot */}
                <Image
                  src="/app-screenshot.png"
                  alt="The Debrief — analysis view"
                  width={900}
                  height={600}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade to next section */}
        <div
          aria-hidden
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '80px',
            background: 'linear-gradient(to bottom, transparent, var(--color-bg))',
            pointerEvents: 'none', zIndex: 1,
          }}
        />
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: '4px 24px 40px' }}>
        <div style={{ maxWidth: '1020px', margin: '0 auto' }}>

          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
                letterSpacing: '-0.03em',
                color: 'var(--color-text)',
                marginBottom: '12px',
              }}
            >
              How it works
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-muted)' }}>
              Three steps. No guesswork.
            </p>
          </div>

          {/* Step cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
              gap: '16px',
            }}
          >
            {steps.map(({ icon: Icon, num, title, desc }, i) => (
              <div
                key={title}
                className="card-surface card-hover section-reveal"
                style={{
                  padding: '28px',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  transitionDelay: `${i * 110}ms`,
                }}
              >
                <span
                  style={{
                    fontSize: '11px', fontWeight: 600,
                    color: 'var(--color-muted)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Step {num}
                </span>

                <div
                  style={{
                    width: '40px', height: '40px',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-accent)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                  }}
                >
                  <Icon size={18} />
                </div>

                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '15px',
                      color: 'var(--color-text)',
                      marginBottom: '8px',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {title}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--color-muted)', lineHeight: 1.7 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SOCIAL PROOF
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '28px 24px 28px', textAlign: 'center' }}>
        <div
          className="section-reveal"
          style={{ maxWidth: '640px', margin: '0 auto' }}
        >
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)',
              color: 'var(--color-text)',
              lineHeight: 1.5,
              letterSpacing: '-0.02em',
              marginBottom: '28px',
            }}
          >
            &ldquo;Built for anyone who rehearses the call before they make it.&rdquo;
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            {['Engineers', 'Designers', 'Product Managers'].map(tag => (
              <span
                key={tag}
                style={{
                  padding: '6px 16px',
                  borderRadius: '999px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--color-muted)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PRICING
      ══════════════════════════════════════════════════════ */}
      <section id="pricing" style={{ padding: '10px 24px 120px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>

          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
                letterSpacing: '-0.03em',
                color: 'var(--color-text)',
              }}
            >
              Pricing
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {/* Free card */}
            <div
              className="card-surface section-reveal"
              style={{ padding: '32px', borderRadius: '12px' }}
            >
              <div style={{ marginBottom: '24px' }}>
                <p
                  style={{
                    fontSize: '11px', fontWeight: 600,
                    color: 'var(--color-muted)',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    marginBottom: '10px',
                  }}
                >
                  Free
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '2.2rem',
                    color: 'var(--color-text)',
                    letterSpacing: '-0.03em',
                  }}
                >
                  $0{' '}
                  <span
                    style={{
                      fontSize: '14px', fontWeight: 400,
                      color: 'var(--color-muted)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    / month
                  </span>
                </p>
              </div>

              <ul
                style={{
                  listStyle: 'none', padding: 0, margin: '0 0 28px',
                  display: 'flex', flexDirection: 'column', gap: '12px',
                }}
              >
                {freeFeatures.map(f => (
                  <li
                    key={f}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      fontSize: '14px', color: 'var(--color-text)',
                    }}
                  >
                    <CheckCircle size={15} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={handleSignIn}
                className="btn-shimmer"
                style={{
                  width: '100%', height: '44px',
                  fontSize: '14px', fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  color: '#fff',
                  backgroundColor: 'var(--color-accent)',
                  border: 'none', borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}
              >
                Get Started Free
              </button>
            </div>

            {/* Pro card */}
            <div
              className="section-reveal"
              style={{
                padding: '32px',
                borderRadius: '12px',
                border: '1px solid rgba(74,158,255,0.4)',
                borderTop: '2px solid var(--color-accent)',
                backgroundColor: 'var(--color-surface)',
                boxShadow: '0 0 40px rgba(74,158,255,0.06), inset 0 1px 0 rgba(255,255,255,0.05)',
                transitionDelay: '110ms',
              }}
            >
              <div style={{ marginBottom: '24px' }}>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    marginBottom: '10px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '11px', fontWeight: 600,
                      color: 'var(--color-muted)',
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      margin: 0,
                    }}
                  >
                    Pro
                  </p>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '2.2rem',
                    color: 'var(--color-text)',
                    letterSpacing: '-0.03em',
                  }}
                >
                  $5{' '}
                  <span
                    style={{
                      fontSize: '14px', fontWeight: 400,
                      color: 'var(--color-muted)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    / month
                  </span>
                </p>
              </div>

              <ul
                style={{
                  listStyle: 'none', padding: 0, margin: '0 0 28px',
                  display: 'flex', flexDirection: 'column', gap: '12px',
                }}
              >
                {proFeatures.map(f => (
                  <li
                    key={f}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      fontSize: '14px', color: 'var(--color-text)',
                    }}
                  >
                    <CheckCircle size={15} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={handleProClick}
                disabled={proLoading}
                className={proLoading ? 'btn-analyzing' : 'btn-shimmer'}
                style={{
                  width: '100%', height: '44px',
                  fontSize: '14px', fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  color: '#fff',
                  backgroundColor: 'var(--color-accent)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: proLoading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 150ms ease',
                }}
                onMouseEnter={e => { if (!proLoading) e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--color-accent)' }}
              >
                {proLoading ? 'Redirecting…' : 'Get Started'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer style={{ position: 'relative' }}>
        {/* Full-width gradient top border */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 5%, var(--color-border) 30%, var(--color-border) 70%, transparent 95%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            padding: '32px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          {/* Left — icon + wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image src="/debrief_icon.png" alt="" width={24} height={24} />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '14px',
                color: 'var(--color-muted)',
                letterSpacing: '-0.01em',
              }}
            >
              The Debrief
            </span>
          </div>

          {/* Right — sign in */}
          <button
            onClick={handleSignIn}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--color-muted)',
              cursor: 'pointer',
              transition: 'color 150ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
          >
            Sign In
          </button>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════
          WAITLIST MODAL
      ══════════════════════════════════════════════════════ */}
      {waitlistOpen && (
        <div
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.72)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10001, padding: '24px',
          }}
          onClick={() => setWaitlistOpen(false)}
        >
          <div
            className="card-surface"
            style={{
              width: '100%', maxWidth: '420px',
              borderRadius: '12px',
              padding: '32px',
              animation: 'fadeUp 0.3s ease forwards',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: '24px',
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '18px',
                    color: 'var(--color-text)',
                    marginBottom: '6px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Join the Pro waitlist
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--color-muted)' }}>
                  We&apos;ll let you know when Pro launches.
                </p>
              </div>
              <button
                onClick={() => setWaitlistOpen(false)}
                style={{
                  background: 'none', border: 'none',
                  color: 'var(--color-muted)',
                  cursor: 'pointer', padding: '4px', flexShrink: 0,
                }}
              >
                <X size={18} />
              </button>
            </div>

            {waitlistSubmitted ? (
              <div
                style={{
                  textAlign: 'center', padding: '24px 0',
                  color: 'var(--color-success)',
                  fontSize: '14px', fontWeight: 500,
                }}
              >
                You&apos;re on the list. We&apos;ll be in touch.
              </div>
            ) : (
              <form
                onSubmit={handleWaitlist}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={waitlistEmail}
                  onChange={e => setWaitlistEmail(e.target.value)}
                  className="input-field"
                  style={{
                    width: '100%', height: '44px',
                    padding: '0 14px',
                    fontSize: '14px',
                    color: 'var(--color-text)',
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-body)',
                  }}
                />
                <button
                  type="submit"
                  disabled={waitlistLoading}
                  className={waitlistLoading ? 'btn-analyzing' : 'btn-shimmer'}
                  style={{
                    height: '44px',
                    fontSize: '14px', fontWeight: 600,
                    fontFamily: 'var(--font-display)',
                    color: '#fff',
                    backgroundColor: 'var(--color-accent)',
                    border: 'none', borderRadius: '6px',
                    cursor: waitlistLoading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 150ms ease',
                  }}
                >
                  {waitlistLoading ? 'Submitting…' : 'Notify Me'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Google icon ─────────────────────────────────────────── */

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
