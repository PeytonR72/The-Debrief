import Image from 'next/image'
import Link from 'next/link'

interface NavbarProps {
  email?: string
  showSignOut?: boolean
  subscriptionStatus?: string
  actionSlot?: React.ReactNode
}

export default function Navbar({ email, showSignOut = true, subscriptionStatus, actionSlot }: NavbarProps) {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(26, 29, 39, 0.72)',
      }}
    >
      {/* Gradient bottom border */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent, var(--color-border) 20%, var(--color-border) 80%, transparent)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 24px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Wordmark */}
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <Image src="/debrief_icon.png" alt="" width={35} height={35} />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '15px',
            letterSpacing: '-0.02em',
            color: 'var(--color-text)',
          }}>
            The Debrief
          </span>
        </Link>

        {/* Right side */}
        {(email || showSignOut) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {email && (
              <span style={{
                fontSize: '12px',
                color: 'var(--color-muted)',
                maxWidth: '200px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {email}
              </span>
            )}
            {/* Pro badge */}
            {subscriptionStatus === 'active' && (
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '11px',
                color: '#fff',
                backgroundColor: 'var(--color-accent)',
                borderRadius: '4px',
                padding: '2px 6px',
                letterSpacing: '0.03em',
                flexShrink: 0,
              }}>
                Pro
              </span>
            )}
            {/* Upgrade / Manage Subscription slot (client component injected from page) */}
            {actionSlot}
            {showSignOut && (
              <form action="/auth/signout" method="POST">
                <button
                  type="submit"
                  className="btn-signout"
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--color-muted)',
                    border: '1px solid var(--color-border)',
                    background: 'transparent',
                    padding: '5px 12px',
                    height: '30px',
                    borderRadius: '4px',
                    transition: 'color 150ms ease, border-color 150ms ease',
                  }}
                >
                  Sign out
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
