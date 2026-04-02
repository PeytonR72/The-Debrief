'use client'

import { createClient } from '@/lib/supabase/client'
import { Chrome } from 'lucide-react'

export default function LandingPage() {
  const supabase = createClient()

  async function handleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center px-4">
        <h1 className="text-5xl font-bold tracking-tight text-black">The Debrief</h1>
        <p className="text-lg text-zinc-500">An honest breakdown of every interview.</p>
        <button
          onClick={handleSignIn}
          className="mt-2 flex items-center gap-3 border border-black px-6 py-3 text-sm font-medium text-black hover:bg-black hover:text-white transition-colors"
        >
          <Chrome size={16} />
          Sign in with Google
        </button>
      </div>
    </main>
  )
}
