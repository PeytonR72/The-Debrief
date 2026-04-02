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