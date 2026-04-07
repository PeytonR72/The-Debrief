import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import DebriefForm from './DebriefForm'

export default async function NewDebriefPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  return (
    <div className="min-h-screen bg-bg page-fade">
      <Navbar email={user.email} />
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px' }}>

        <div style={{ marginBottom: '36px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '26px', letterSpacing: '-0.025em',
            color: 'var(--color-text)', marginBottom: '8px',
          }}>
            New Debrief
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-muted)', lineHeight: 1.6 }}>
            Fill in the details below. The more specific, the sharper the analysis.
          </p>
        </div>

        {/* Form container with accent top border */}
        <div
          className="card-surface"
          style={{
            borderRadius: '6px',
            borderTop: '2px solid var(--color-accent)',
            padding: '32px 28px',
          }}
        >
          <DebriefForm />
        </div>
      </div>
    </div>
  )
}
