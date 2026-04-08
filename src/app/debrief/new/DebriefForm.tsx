'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ChevronRight } from 'lucide-react'
import AnalysisContent from '@/components/AnalysisContent'
import UpgradeModal from '@/components/UpgradeModal'

type Status = 'idle' | 'streaming' | 'done' | 'error'

const INTERVIEW_TYPES = ['Phone Screen', 'Technical', 'Behavioral', 'Final Round']

const LOADING_MESSAGES = [
  'Reading the job description',
  'Analyzing your responses...',
  'Identifying what they were screening for',
  'Writing your debrief',
]

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-display)',
  fontWeight: 600,
  fontSize: '11px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--color-muted)',
  marginBottom: '8px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  fontSize: '14px',
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text)',
  borderRadius: '4px',
}

export default function DebriefForm() {
  const router = useRouter()

  const [jobTitle,       setJobTitle]       = useState('')
  const [companyName,    setCompanyName]    = useState('')
  const [interviewType,  setInterviewType]  = useState(INTERVIEW_TYPES[0])
  const [jobDescription, setJobDescription] = useState('')
  const [interviewNotes, setInterviewNotes] = useState('')

  const [status,           setStatus]           = useState<Status>('idle')
  const [analysis,         setAnalysis]         = useState('')
  const [debriefId,        setDebriefId]        = useState<string | null>(null)
  const [errorMessage,     setErrorMessage]     = useState('')
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const [loadingMsg,       setLoadingMsg]       = useState(LOADING_MESSAGES[0])
  const [msgKey,           setMsgKey]           = useState(0)

  const analysisRef  = useRef('')
  const msgIndexRef  = useRef(0)

  useEffect(() => {
    if (status !== 'streaming') return
    const interval = setInterval(() => {
      msgIndexRef.current = (msgIndexRef.current + 1) % LOADING_MESSAGES.length
      setLoadingMsg(LOADING_MESSAGES[msgIndexRef.current])
      setMsgKey(k => k + 1)
    }, 2800)
    return () => clearInterval(interval)
  }, [status])

  async function runDebrief() {
    setStatus('streaming')
    setAnalysis('')
    setDebriefId(null)
    setErrorMessage('')
    analysisRef.current = ''
    msgIndexRef.current = 0
    setLoadingMsg(LOADING_MESSAGES[0])
    setMsgKey(0)

    try {
      const response = await fetch('/api/debrief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_title:       jobTitle,
          company_name:    companyName,
          job_description: jobDescription,
          interview_notes: interviewNotes,
          interview_type:  interviewType,
        }),
      })

      if (response.status === 402) {
        setUpgradeModalOpen(true)
        setStatus('idle')
        return
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error ?? `Request failed (${response.status})`)
      }
      if (!response.body) throw new Error('No response body')

      const reader  = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        analysisRef.current += decoder.decode(value, { stream: true })
      }

      const sentinelIndex = analysisRef.current.indexOf('\n\n__DEBRIEF_ID__:')
      if (sentinelIndex !== -1) {
        setAnalysis(analysisRef.current.slice(0, sentinelIndex))
        const id = analysisRef.current.slice(sentinelIndex + '\n\n__DEBRIEF_ID__:'.length).trim()
        if (id) setDebriefId(id)
      } else {
        setAnalysis(analysisRef.current)
      }

      setStatus('done')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    runDebrief()
  }

  const noteLen = interviewNotes.length

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* Job title + company */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle} htmlFor="job-title">Job Title</label>
            <input
              id="job-title" type="text" required
              value={jobTitle} onChange={e => setJobTitle(e.target.value)}
              placeholder="Associate Software Engineer"
              className="input-field placeholder:text-muted"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle} htmlFor="company-name">Company</label>
            <input
              id="company-name" type="text" required
              value={companyName} onChange={e => setCompanyName(e.target.value)}
              placeholder="Apple"
              className="input-field placeholder:text-muted"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Interview type */}
        <div>
          <label style={labelStyle} htmlFor="interview-type">Interview Type</label>
          <select
            id="interview-type"
            value={interviewType} onChange={e => setInterviewType(e.target.value)}
            className="input-field"
            style={{ ...inputStyle, appearance: 'none', cursor: 'crosshair' } as React.CSSProperties}
          >
            {INTERVIEW_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Job description */}
        <div>
          <label style={labelStyle} htmlFor="job-description">Job Description</label>
          <textarea
            id="job-description" required
            value={jobDescription} onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            className="input-field placeholder:text-muted"
            style={{ ...inputStyle, minHeight: '150px', resize: 'vertical' }}
          />
        </div>

        {/* Interview notes */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ ...labelStyle, marginBottom: 0 }} htmlFor="interview-notes">What happened?</label>
            <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
              {noteLen.toLocaleString()} characters
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--color-muted)', marginBottom: '8px', lineHeight: 1.5 }}>
            Describe the questions asked and how you answered. The more detail, the sharper the analysis.
            {noteLen > 0 && noteLen < 200 && (
              <span style={{ color: 'var(--color-accent)', marginLeft: '4px' }}>
                More detail = sharper analysis.
              </span>
            )}
          </p>
          <textarea
            id="interview-notes" required
            value={interviewNotes} onChange={e => setInterviewNotes(e.target.value)}
            placeholder="Walk through the interview from start to finish, or provide a transcript if available."
            className="input-field placeholder:text-muted"
            style={{ ...inputStyle, minHeight: '200px', resize: 'vertical' }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'streaming'}
          className={`btn-shimmer ${status === 'streaming' ? 'btn-analyzing' : ''}`}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', height: '44px',
            fontSize: '14px', fontWeight: 600, color: '#fff',
            backgroundColor: 'var(--color-accent)',
            borderRadius: '6px', border: 'none',
            cursor: status === 'streaming' ? 'not-allowed' : 'crosshair',
          }}
        >
          {status !== 'streaming' && (
            <>Get My Debrief <ChevronRight size={15} /></>
          )}
        </button>

        {/* Cycling loading status */}
        {status === 'streaming' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '-12px' }}>
            <span style={{
              display: 'inline-block', width: '6px', height: '6px',
              borderRadius: '50%', backgroundColor: 'var(--color-accent)',
              animation: 'dotPulse 1.5s ease-in-out infinite',
            }} />
            <span key={msgKey} className="loading-msg" style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
              {loadingMsg}<span className="loading-dots"><span>.</span><span>.</span><span>.</span></span>
            </span>
          </div>
        )}
      </form>

      {/* Error */}
      {status === 'error' && (
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            padding: '12px 16px', fontSize: '13px',
            color: 'var(--color-danger)',
            border: '1px solid rgba(255,107,107,0.3)',
            backgroundColor: 'rgba(255,107,107,0.06)',
            borderRadius: '4px',
          }}>
            {errorMessage}
          </div>
          <button
            onClick={runDebrief}
            className="btn-shimmer"
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', height: '44px',
              fontSize: '14px', fontWeight: 600, color: '#fff',
              backgroundColor: 'var(--color-accent)',
              borderRadius: '6px', border: 'none',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Streaming results */}
      {status === 'done' && analysis && (
        <div style={{ marginTop: '56px' }}>
          <div className="card-surface" style={{ borderRadius: '6px', padding: '32px 28px' }}>
            <AnalysisContent content={analysis} />
          </div>

          {status === 'done' && debriefId && (
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => router.push(`/debrief/${debriefId}`)}
                className="btn-shimmer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '0 20px', height: '44px',
                  fontSize: '13px', fontWeight: 600, color: '#fff',
                  backgroundColor: 'var(--color-accent)',
                  borderRadius: '6px', border: 'none', 
                }}
              >
                View Full Debrief
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}
      <UpgradeModal isOpen={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} />
    </>
  )
}
