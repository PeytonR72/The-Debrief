'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard access denied
    }
  }

  return (
    <button
      onClick={handleCopy}
      title={copied ? 'Copied' : 'Copy analysis'}
      className="flex items-center gap-1.5 px-3 min-h-[32px] text-xs font-medium border border-border text-muted hover:text-primary hover:border-muted transition-colors duration-150 rounded-[4px]"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
