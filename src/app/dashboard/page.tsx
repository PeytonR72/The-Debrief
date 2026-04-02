import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Plus, ArrowRight } from 'lucide-react'
import type { Debrief } from '@/types'

export const dynamic = 'force-dynamic'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const { data: debriefs } = await supabase
    .from('debriefs')
    .select('id, job_title, company_name, interview_type, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-black">The Debrief</h1>
          <div className="flex items-center gap-4 pt-1">
            <span className="text-sm text-zinc-400 hidden sm:block">{user.email}</span>
            <form action="/auth/signout" method="POST">
              <button
                type="submit"
                className="text-sm text-zinc-500 hover:text-black transition-colors"
              >
                Sign out
              </button>
            </form>
            <Link
              href="/debrief/new"
              className="flex items-center gap-1.5 bg-black text-white px-4 py-2 text-sm font-medium hover:bg-zinc-800 transition-colors"
            >
              <Plus size={14} />
              New Debrief
            </Link>
          </div>
        </div>

        {/* Debrief list */}
        {!debriefs || debriefs.length === 0 ? (
          <div className="border border-zinc-100 px-6 py-12 text-center">
            <p className="text-zinc-400 text-sm">No debriefs yet.</p>
            <Link
              href="/debrief/new"
              className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-black underline underline-offset-4 hover:text-zinc-600 transition-colors"
            >
              Get started
              <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-zinc-100 border-t border-b border-zinc-100">
            {(debriefs as Pick<Debrief, 'id' | 'job_title' | 'company_name' | 'interview_type' | 'created_at'>[]).map((debrief) => (
              <li key={debrief.id}>
                <Link
                  href={`/debrief/${debrief.id}`}
                  className="flex items-center justify-between gap-4 py-4 group"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-medium text-black truncate group-hover:underline underline-offset-2">
                      {debrief.job_title}
                    </span>
                    <span className="text-sm text-zinc-400">
                      {debrief.company_name}
                      <span className="mx-1.5">·</span>
                      {debrief.interview_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-zinc-400">{formatDate(debrief.created_at)}</span>
                    <ArrowRight size={14} className="text-zinc-300 group-hover:text-black transition-colors" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
