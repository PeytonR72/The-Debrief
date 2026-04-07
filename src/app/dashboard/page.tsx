import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Plus, ArrowRight, ScrollText } from 'lucide-react'
import Navbar from '@/components/Navbar'
import type { Debrief } from '@/types'

export const dynamic = 'force-dynamic'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

const BADGE: Record<string, { color: string; bg: string }> = {
  'Phone Screen': { color: '#4a9eff', bg: 'rgba(74,158,255,0.1)'  },
  'Technical':    { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  'Behavioral':   { color: '#2dd4bf', bg: 'rgba(45,212,191,0.1)'  },
  'Final Round':  { color: '#fb923c', bg: 'rgba(251,146,60,0.1)'  },
}
const defaultBadge = { color: 'var(--color-muted)', bg: 'rgba(139,144,168,0.1)' }

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: debriefs } = await supabase
    .from('debriefs')
    .select('id, job_title, company_name, interview_type, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-bg page-fade">
      <Navbar email={user.email} />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '22px', letterSpacing: '-0.02em',
            color: 'var(--color-text)',
          }}>
            Your Debriefs
          </h1>
          <Link
            href="/debrief/new"
            className="btn-shimmer"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '0 16px', height: '40px',
              fontSize: '13px', fontWeight: 600,
              color: '#fff',
              backgroundColor: 'var(--color-accent)',
              borderRadius: '6px',
              textDecoration: 'none',
            }}
          >
            <Plus size={14} />
            New Debrief
          </Link>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(to right, var(--color-border), transparent)', marginBottom: '32px' }} />

        {/* Empty state */}
        {!debriefs || debriefs.length === 0 ? (
          <div className="card-surface" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center', borderRadius: '6px' }}>
            <ScrollText size={28} style={{ color: 'var(--color-muted)', opacity: 0.4, marginBottom: '16px' }} />
            <p style={{ fontSize: '14px', color: 'var(--color-muted)', marginBottom: '24px' }}>
              No debriefs yet. Run your first one.
            </p>
            <Link
              href="/debrief/new"
              className="btn-shimmer"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '0 20px', height: '44px',
                fontSize: '13px', fontWeight: 600,
                color: '#fff',
                backgroundColor: 'var(--color-accent)',
                borderRadius: '6px',
                textDecoration: 'none',
              }}
            >
              <Plus size={14} />
              Get started
            </Link>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(debriefs as Pick<Debrief, 'id' | 'job_title' | 'company_name' | 'interview_type' | 'created_at'>[]).map((d) => {
              const badge = BADGE[d.interview_type] ?? defaultBadge
              return (
                <li key={d.id}>
                  <Link
                    href={`/debrief/${d.id}`}
                    className="card-surface card-hover card-scan"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      gap: '16px', padding: '20px 24px',
                      borderRadius: '6px', textDecoration: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
                      {/* Job title */}
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 600,
                        fontSize: '17px',
                        letterSpacing: '-0.01em',
                        color: 'var(--color-text)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {d.job_title}
                      </span>
                      {/* Company name — separate line */}
                      <span style={{ fontSize: '13px', color: 'var(--color-muted)' }}>
                        {d.company_name}
                      </span>
                      {/* Badge */}
                      <span style={{
                        display: 'inline-block', alignSelf: 'flex-start',
                        fontSize: '10px', fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        color: badge.color,
                        backgroundColor: badge.bg,
                        letterSpacing: '0.04em',
                      }}>
                        {d.interview_type}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                      <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>{formatDate(d.created_at)}</span>
                      <ArrowRight size={14} className="card-arrow" />
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
