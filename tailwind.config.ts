import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:      'var(--color-bg)',
        surface: 'var(--color-surface)',
        border:  'var(--color-border)',
        primary: 'var(--color-text)',
        muted:   'var(--color-muted)',
        accent:  'var(--color-accent)',
        danger:  'var(--color-danger)',
        win:     'var(--color-success)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)',    'sans-serif'],
        syne:    ['var(--font-syne)',    'sans-serif'],
      },
      typography: {
        debrief: {
          css: {
            '--tw-prose-body':        'var(--color-text)',
            '--tw-prose-headings':    'var(--color-accent)',
            '--tw-prose-bold':        'var(--color-text)',
            '--tw-prose-links':       'var(--color-accent)',
            '--tw-prose-bullets':     'var(--color-muted)',
            '--tw-prose-counters':    'var(--color-muted)',
            '--tw-prose-hr':          'var(--color-border)',
            '--tw-prose-quotes':      'var(--color-muted)',
            '--tw-prose-code':        'var(--color-text)',
            '--tw-prose-pre-bg':      'var(--color-surface)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
