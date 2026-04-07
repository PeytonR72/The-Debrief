'use client'

import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

const components: Components = {
  h2: ({ children }) => (
    <h2 style={{
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: '0.95rem',
      letterSpacing: '-0.01em',
      color: 'var(--color-accent)',
      borderLeft: '3px solid var(--color-accent)',
      boxShadow: '-2px 0 10px rgba(74,158,255,0.25)',
      paddingLeft: '14px',
      marginTop: '40px',
      marginBottom: '16px',
    }}>
      {children}
    </h2>
  ),
  hr: () => (
    <hr style={{ borderColor: 'var(--color-border)', margin: '2.5rem 0', opacity: 0.6 }} />
  ),
  strong: ({ children }) => (
    <strong style={{ color: 'var(--color-text)', fontWeight: 600 }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>{children}</em>
  ),
  p: ({ children }) => (
    <p style={{ color: 'var(--color-text)', lineHeight: 1.78, marginBottom: '0.9rem', fontSize: '0.9rem' }}>
      {children}
    </p>
  ),
  li: ({ children }) => (
    <li style={{ color: 'var(--color-text)', lineHeight: 1.72, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
      {children}
    </li>
  ),
  ul: ({ children }) => (
    <ul style={{ paddingLeft: '1.2rem', marginBottom: '0.9rem' }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{ paddingLeft: '1.2rem', marginBottom: '0.9rem' }}>{children}</ol>
  ),
}

export default function AnalysisContent({ content }: { content: string }) {
  return (
    <div style={{ maxWidth: '65ch' }}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  )
}
