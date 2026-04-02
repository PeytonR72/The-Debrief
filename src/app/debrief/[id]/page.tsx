import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Plus } from 'lucide-react'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function DebriefDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const { data: debrief } = await supabase
    .from('debriefs')
    .select('id, user_id, job_title, company_name, interview_type, analysis, created_at')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!debrief) notFound()

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Nav */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} />
            Dashboard
          </Link>
          <Link
            href="/debrief/new"
            className="flex items-center gap-1.5 bg-black text-white px-4 py-2 text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            <Plus size={14} />
            New Debrief
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-black">
            {debrief.job_title}
          </h1>
          <p className="mt-1 text-lg text-zinc-500">{debrief.company_name}</p>
          <p className="mt-3 text-sm text-zinc-400">
            {debrief.interview_type}
            <span className="mx-2">·</span>
            {formatDate(debrief.created_at)}
          </p>
        </div>

        <hr className="border-zinc-100 mb-10" />

        {/* Analysis */}
        <div className="prose prose-zinc prose-sm max-w-none
          prose-headings:font-semibold prose-headings:text-black prose-headings:tracking-tight
          prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3
          prose-p:text-zinc-700 prose-p:leading-relaxed
          prose-li:text-zinc-700
          prose-strong:text-black prose-strong:font-semibold
          prose-em:text-zinc-600
          prose-hr:border-zinc-100">
          <ReactMarkdown>{debrief.analysis ?? ''}</ReactMarkdown>
        </div>

      </div>
    </main>
  )
}
