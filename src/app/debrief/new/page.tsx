'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { Loader2, ArrowRight } from 'lucide-react'

type Status = 'idle' | 'streaming' | 'done' | 'error'

const INTERVIEW_TYPES = ['Phone Screen', 'Technical', 'Behavioral', 'Final Round']

export default function NewDebriefPage() {
  const router = useRouter()

  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [interviewType, setInterviewType] = useState(INTERVIEW_TYPES[0])
  const [jobDescription, setJobDescription] = useState('')
  const [interviewNotes, setInterviewNotes] = useState('')

  const [status, setStatus] = useState<Status>('idle')
  const [analysis, setAnalysis] = useState('')
  const [debriefId, setDebriefId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const analysisRef = useRef('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('streaming')
    setAnalysis('')
    setDebriefId(null)
    setErrorMessage('')
    analysisRef.current = ''

    try {
      const response = await fetch('/api/debrief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_title: jobTitle,
          company_name: companyName,
          job_description: jobDescription,
          interview_notes: interviewNotes,
          interview_type: interviewType,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error ?? `Request failed (${response.status})`)
      }

      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        analysisRef.current += chunk

        const sentinelIndex = analysisRef.current.indexOf('\n\n__DEBRIEF_ID__:')
        if (sentinelIndex !== -1) {
          const visibleText = analysisRef.current.slice(0, sentinelIndex)
          const idPart = analysisRef.current.slice(sentinelIndex + '\n\n__DEBRIEF_ID__:'.length).trim()
          setAnalysis(visibleText)
          if (idPart) setDebriefId(idPart)
        } else {
          setAnalysis(analysisRef.current)
        }
      }

      setStatus('done')
    } catch (err) {
      console.error(err)
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-black mb-2">New Debrief</h1>
        <p className="text-zinc-500 mb-10">Paste in the job description and your interview notes. We&apos;ll do the rest.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-black" htmlFor="job-title">
                Job Title
              </label>
              <input
                id="job-title"
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Product Manager"
                className="border border-zinc-200 px-3 py-2 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-black" htmlFor="company-name">
                Company Name
              </label>
              <input
                id="company-name"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Anthropic"
                className="border border-zinc-200 px-3 py-2 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-black" htmlFor="interview-type">
              Interview Type
            </label>
            <select
              id="interview-type"
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="border border-zinc-200 px-3 py-2 text-sm text-black bg-white focus:outline-none focus:border-black transition-colors"
            >
              {INTERVIEW_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-black" htmlFor="job-description">
              Job Description
            </label>
            <textarea
              id="job-description"
              required
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={8}
              className="border border-zinc-200 px-3 py-2 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:border-black transition-colors resize-y"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-black" htmlFor="interview-notes">
              What happened?
            </label>
            <p className="text-xs text-zinc-400 -mt-1">
              Describe the questions asked and how you answered them. The more detail, the better.
            </p>
            <textarea
              id="interview-notes"
              required
              value={interviewNotes}
              onChange={(e) => setInterviewNotes(e.target.value)}
              placeholder="Walk through the interview from start to finish..."
              rows={10}
              className="border border-zinc-200 px-3 py-2 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:border-black transition-colors resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'streaming'}
            className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'streaming' ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Analyzing your interview...
              </>
            ) : (
              'Get My Debrief'
            )}
          </button>
        </form>

        {status === 'error' && (
          <div className="mt-8 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {(status === 'streaming' || status === 'done') && analysis && (
          <div className="mt-16">
            <hr className="border-zinc-100 mb-10" />
            <div className="prose prose-zinc prose-sm max-w-none
              prose-headings:font-semibold prose-headings:text-black prose-headings:tracking-tight
              prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3
              prose-p:text-zinc-700 prose-p:leading-relaxed
              prose-li:text-zinc-700
              prose-strong:text-black prose-strong:font-semibold
              prose-em:text-zinc-600">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>

            {status === 'done' && debriefId && (
              <div className="mt-12">
                <button
                  onClick={() => router.push(`/debrief/${debriefId}`)}
                  className="flex items-center gap-2 border border-black px-5 py-2.5 text-sm font-medium text-black hover:bg-black hover:text-white transition-colors"
                >
                  Save &amp; View Full Debrief
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
