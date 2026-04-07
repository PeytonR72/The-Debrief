import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Plus } from 'lucide-react'
import Navbar from '@/components/Navbar'
import AnalysisContent from '@/components/AnalysisContent'
import CopyButton from '@/components/CopyButton'
import PageProgressBar from '@/components/PageProgressBar'
import BackToTop from '@/components/BackToTop'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default async function DebriefDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: debrief } = await supabase
    .from('debriefs')
    .select('id, user_id, job_title, company_name, interview_type, analysis, created_at')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!debrief) notFound()

  return (
    <div className="min-h-screen bg-bg page-fade">
      <PageProgressBar />
      <Navbar email={user.email} />

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 96px' }}>

        {/* Sub-nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px' }}>
          <Link
            href="/dashboard"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '12px', fontWeight: 500,
              color: 'var(--color-muted)',
              textDecoration: 'none',
              transition: 'color 150ms ease',
            }}
            onMouseEnter={undefined}
          >
            <ArrowLeft size={13} />
            Dashboard
          </Link>
          <Link
            href="/debrief/new"
            className="btn-shimmer"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '0 16px', height: '40px',
              fontSize: '13px', fontWeight: 600, color: '#fff',
              backgroundColor: 'var(--color-accent)',
              borderRadius: '6px', textDecoration: 'none',
            }}
          >
            <Plus size={14} />
            New Debrief
          </Link>
        </div>

        {/* Heading */}
        <div style={{ maxWidth: '680px', marginBottom: '36px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            lineHeight: 1.06, letterSpacing: '-0.03em',
            color: 'var(--color-text)',
            marginBottom: '10px',
          }}>
            {debrief.job_title}
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--color-muted)', marginBottom: '14px' }}>
            {debrief.company_name}
          </p>
          {/* Small caps metadata */}
          <p style={{
            fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.13em', textTransform: 'uppercase',
            color: 'var(--color-muted)', opacity: 0.75,
          }}>
            {debrief.interview_type}
            <span style={{ margin: '0 8px', opacity: 0.4 }}>·</span>
            {formatDate(debrief.created_at)}
          </p>
        </div>

        {/* Gradient divider */}
        <div style={{ height: '1px', background: 'linear-gradient(to right, var(--color-border), transparent)', marginBottom: '36px', maxWidth: '680px' }} />

        {/* Analysis card */}
        <div className="card-surface" style={{ borderRadius: '6px', maxWidth: '680px' }}>
          {/* Card header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 24px',
            borderBottom: '1px solid var(--color-border)',
          }}>
            <span style={{
              fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--color-muted)',
            }}>
              Analysis
            </span>
            <CopyButton text={debrief.analysis ?? ''} />
          </div>

          <div style={{ padding: '32px 28px' }}>
            <AnalysisContent content={debrief.analysis ?? ''} />
          </div>
        </div>

      </div>

      <BackToTop />
    </div>
  )
}
