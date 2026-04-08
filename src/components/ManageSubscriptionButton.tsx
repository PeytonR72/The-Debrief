'use client'

import { useState } from 'react'

export default function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false)

  async function handleManage() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleManage}
      disabled={loading}
      className="btn-signout"
      style={{
        fontSize: '12px', fontWeight: 500,
        color: 'var(--color-muted)',
        border: '1px solid var(--color-border)',
        background: 'transparent',
        padding: '5px 12px',
        height: '30px',
        borderRadius: '4px',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'color 150ms ease, border-color 150ms ease',
        whiteSpace: 'nowrap',
      }}
    >
      {loading ? 'Loading…' : 'Manage Subscription'}
    </button>
  )
}
