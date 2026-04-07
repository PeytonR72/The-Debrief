'use client'

import { useEffect, useState } from 'react'

export default function PageProgressBar() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    // Next tick so the transition fires
    const t = requestAnimationFrame(() => setWidth(100))
    return () => cancelAnimationFrame(t)
  }, [])

  return <div className="progress-bar" style={{ width: `${width}%` }} aria-hidden />
}
