# The Debrief — Claude Code Context

## What This Is
A web app where job seekers paste in a job description and their interview notes and receive an honest, structured AI analysis of how the interview went and how to improve. Built with Next.js, Supabase, and the Anthropic API.

## Tech Stack
- **Framework**: Next.js 14, App Router, TypeScript
- **Styling**: Tailwind CSS
- **Auth + DB**: Supabase (Google OAuth, Postgres)
- **AI**: Anthropic API (claude-sonnet-4-6), streaming responses
- **Icons**: lucide-react
- **Markdown rendering**: react-markdown
- **Hosting**: Vercel

## Project Structure
- /src/app — Next.js App Router pages and API routes
- /src/app/api/debrief/route.ts — core API route, calls Anthropic and saves to Supabase
- /src/lib/supabase/ — browser client, server client, middleware helper
- /src/lib/anthropic.ts — Anthropic client setup
- /src/types/index.ts — shared TypeScript types

## Database Tables
- profiles (id, email, debrief_count, is_pro, created_at)
- debriefs (id, user_id, job_title, company_name, job_description, interview_notes, interview_type, analysis, created_at)
- waitlist (id, email, created_at)

## Environment Variables
All keys are in .env.local. Never hardcode them. Variables are:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- ANTHROPIC_API_KEY

## Auth Flow
- Google OAuth via Supabase
- Callback handled at /auth/callback/route.ts
- New users get a row inserted into profiles on first login
- Unauthenticated users are redirected to / by middleware

## Freemium Model (not yet implemented)
- 3 free debriefs per month (tracked via profiles.debrief_count)
- is_pro flag on profiles for future Stripe integration
- Do not implement payment gating yet — just make sure debrief_count increments on each submission

## Design Guidelines
- Minimal, clean, black and white color scheme
- No heavy UI frameworks — just Tailwind
- Typography-first — the analysis output is the product
- Mobile-friendly but desktop-primary

## Current Build Status
Track what's been completed as we go.
- [ ] Project scaffold
- [ ] Supabase wiring
- [ ] Anthropic wiring
- [ ] Auth flow
- [ ] Intake form
- [ ] Dashboard
- [ ] Debrief detail page

## Design & Styling Guidelines

### Aesthetic Direction
The Debrief is sharp, analytical, and slightly cold — like a trusted mentor who doesn't sugarcoat things. The visual language should reflect that: dark, typographically confident, minimal but not sterile.

- **Theme**: Dark. Deep charcoal/near-black backgrounds, not pure #000000
- **Accent color**: Cold steel blue or desaturated teal — used sparingly and intentionally
- **Typography**: Choose a distinctive, confident display font for headings (NOT Inter, Roboto, Arial, or Space Grotesk). Pair with a clean readable body font. Import from Google Fonts.
- **Layout**: Generous negative space, strong typographic hierarchy, grid-aligned but not rigid
- **Motion**: Subtle and purposeful only — a staggered page load reveal, smooth transitions. Nothing bouncy or playful.
- **Logo**: `/public/debrief_icon.png` — use in navbar and favicon

### Never Do
- Purple gradients on white backgrounds
- Rounded bubbly UI (this is not a consumer fun app)
- Generic card shadows everywhere
- Cookie-cutter SaaS layouts
- Bright or warm accent colors

### Voice in UI copy
Match the system prompt tone — direct, no fluff. Button labels like "Get My Debrief" not "Submit." Error messages that sound like a person wrote them.

### Frontend Design Skill
Implement working code (HTML/CSS/JS, React, Vue, etc.) that is:

Production-grade and functional
Visually striking and memorable
Cohesive with a clear aesthetic point-of-view
Meticulously refined in every detail
Frontend Aesthetics Guidelines
Focus on:

Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
Spatial Composition: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
Backgrounds & Visual Details: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.
NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

IMPORTANT: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.