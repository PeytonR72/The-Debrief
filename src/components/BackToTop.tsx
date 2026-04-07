'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title="Back to top"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        border: '1px solid var(--color-border)',
        backgroundColor: 'rgba(26,29,39,0.85)',
        backdropFilter: 'blur(8px)',
        color: 'var(--color-muted)',
        borderRadius: '6px',
        transition: 'color 150ms ease, border-color 150ms ease',
        zIndex: 100,
      }}
      className="back-to-top"
    >
      <ArrowUp size={14} />
    </button>
  )
}
