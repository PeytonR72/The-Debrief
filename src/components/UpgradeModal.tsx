'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Zap, CheckCircle } from 'lucide-react'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
}

const features = [
  'Unlimited debriefs',
  'Full AI analysis every time',
  'Cancel anytime',
]

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Focus trap + Escape to close
  useEffect(() => {
    if (!isOpen) return

    const focusable = () =>
      modalRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) ?? []

    // Focus first element on open
    focusable()[0]?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      const els = Array.from(focusable())
      if (els.length === 0) return
      const first = els[0]
      const last  = els[els.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus() }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  async function handleUpgrade() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 10001, padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="card-surface"
        style={{
          width: '100%', maxWidth: '400px',
          borderRadius: '12px',
          padding: '32px',
          animation: 'fadeUp 0.3s ease forwards',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{
            width: '36px', height: '36px',
            backgroundColor: 'rgba(74,158,255,0.1)',
            border: '1px solid rgba(74,158,255,0.2)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-accent)',
          }}>
            <Zap size={16} />
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700, fontSize: '18px',
          color: 'var(--color-text)',
          marginBottom: '8px', letterSpacing: '-0.02em',
        }}>
          You've used your free debrief
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--color-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
          Upgrade to Pro for unlimited debriefs, priority analysis, and more.
        </p>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {features.map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--color-text)' }}>
              <CheckCircle size={14} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
              {f}
            </li>
          ))}
        </ul>

        <p style={{ marginBottom: '20px' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700, fontSize: '1.8rem',
            color: 'var(--color-text)', letterSpacing: '-0.03em',
          }}>
            $5
          </span>
          <span style={{ fontSize: '13px', color: 'var(--color-muted)', marginLeft: '4px' }}>/ month</span>
        </p>

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className={loading ? 'btn-analyzing' : 'btn-shimmer'}
          style={{
            width: '100%', height: '44px',
            fontSize: '14px', fontWeight: 600,
            fontFamily: 'var(--font-display)',
            color: '#fff',
            backgroundColor: 'var(--color-accent)',
            border: 'none', borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 150ms ease',
            marginBottom: '12px',
            display: 'block',
          }}
        >
          {loading ? 'Redirecting…' : 'Upgrade to Pro'}
        </button>

        <button
          onClick={onClose}
          style={{
            width: '100%', background: 'none', border: 'none',
            fontSize: '13px', color: 'var(--color-muted)',
            cursor: 'pointer', transition: 'color 150ms ease',
            padding: '4px 0',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
