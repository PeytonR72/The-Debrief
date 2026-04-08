# The Debrief — Claude Code Context

## What This Is
A web app where job seekers paste in a job description and their interview notes and receive an honest, structured AI analysis of how the interview went and how to improve. Built with Next.js 14, Supabase, and the Anthropic API. The app is fully built and working as of this context window.

## Tech Stack
- **Framework**: Next.js 14, App Router, TypeScript
- **Styling**: Tailwind CSS + CSS custom properties (all colors are CSS variables)
- **Auth + DB**: Supabase (Google OAuth, Postgres)
- **AI**: Anthropic API (`claude-sonnet-4-6`), streaming responses buffered client-side
- **Icons**: lucide-react
- **Markdown rendering**: react-markdown with fully custom component renderers (see AnalysisContent.tsx)
- **Fonts**: Manrope (display, weights 600/700/800) + DM Sans (body) via `next/font/google`
- **Hosting**: Vercel

## Project Structure
```
src/
  app/
    page.tsx                    # Landing page (client component)
    layout.tsx                  # Root layout — font injection, favicon, metadata
    globals.css                 # All CSS variables, animations, utility classes
    dashboard/page.tsx          # Server component — debrief list
    debrief/
      new/
        page.tsx                # Server wrapper — auth check, Navbar, renders DebriefForm
        DebriefForm.tsx         # Client component — form state, fetch, buffered streaming
      [id]/
        page.tsx                # Server component — debrief detail view
    api/
      debrief/route.ts          # POST — auth, stream Anthropic, save to Supabase, sentinel ID
    auth/
      callback/route.ts         # OAuth exchange, profile insert on first login
      signout/route.ts          # POST — sign out, redirect to /
  lib/
    supabase/
      client.ts                 # Browser client (createBrowserClient)
      server.ts                 # Server client (createServerClient + cookie handling)
      middleware.ts             # Session refresh + auth guard for /dashboard and /debrief
    anthropic.ts                # Anthropic client singleton
  middleware.ts                 # Next.js middleware entry point
  types/index.ts                # Profile, Debrief, Waitlist types
  components/
    Navbar.tsx                  # Server component — frosted glass, gradient border, logo
    AnalysisContent.tsx         # Client component — ReactMarkdown with custom h2/p/li etc.
    CopyButton.tsx              # Client component — clipboard copy with Check feedback
    PageProgressBar.tsx         # Client component — animated 0→100% bar on page load
    BackToTop.tsx               # Client component — appears after 400px scroll
```

## Database Tables
- `profiles` (id, email, debrief_count, is_pro, stripe_customer_id, subscription_status, created_at)
- `debriefs` (id, user_id, job_title, company_name, job_description, interview_notes, interview_type, analysis, created_at)
- `waitlist` (id, email, created_at)

Supabase RLS is enabled on both tables. The `increment_debrief_count` Postgres function exists and is called via `supabase.rpc()` after each debrief is saved.

## Environment Variables
All keys are in `.env.local`. Never hardcode them.
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`

## Auth Flow
- Google OAuth via Supabase
- Callback at `/auth/callback` exchanges code, inserts `profiles` row for new users
- Middleware guards `/dashboard` and `/debrief` — unauthenticated users redirect to `/`
- Sign out via POST to `/auth/signout`

## Streaming Architecture
The API route (`/api/debrief`) streams Anthropic chunks as plain text. At the end of the stream it appends a sentinel: `\n\n__DEBRIEF_ID__:<uuid>`. The client reads the full stream into a ref, then on completion: strips the sentinel, extracts the ID, sets state once. The UI does **not** show partial output — it buffers everything and reveals the full analysis when done. This is intentional UX — it should not feel like watching a model generate text.

## Design System

### Color tokens (defined in globals.css as CSS variables)
```
--color-bg:           #0f1117   (main background)
--color-surface:      #1a1d27   (cards, inputs, nav)
--color-border:       #2a2d3a   (borders)
--color-text:         #f0f2f8   (primary text)
--color-muted:        #8b90a8   (secondary text, labels)
--color-accent:       #4a9eff   (steel blue — used sparingly)
--color-accent-hover: #6ab0ff
--color-danger:       #ff6b6b
--color-success:      #4affb0
```
Extended in `tailwind.config.ts` as `bg-bg`, `text-muted`, `text-accent`, `border-border`, etc.

### Typography
- Display font: **Manrope** (weights 600, 700, 800) → `--font-display` → `font-display` Tailwind class
- Body font: **DM Sans** (weights 300, 400, 500, 600) → `--font-body` → `font-body` Tailwind class
- Never use Inter, Roboto, Arial, Space Grotesk, or system fonts

### Reusable CSS classes (defined in globals.css)
- `.card-surface` — gradient border treatment (padding-box/border-box + inset highlight)
- `.card-hover` — translateY(-2px) + shadow lift on hover
- `.card-scan` — scan line pseudo-element that sweeps top→bottom on hover
- `.card-arrow` — invisible arrow that fades + slides in on `.card-scan:hover`
- `.input-field` — accent border + glow on focus
- `.btn-shimmer` — light sweep ::after on hover
- `.btn-analyzing` — pulse animation for loading state
- `.icon-float` — 3s float animation for the landing page icon
- `.status-pill` / `.status-dot` — pill badge with pulsing dot
- `.loading-msg` — fade-in/out keyframe for cycling status messages
- `.loading-dots` — animated three-dot wave (spans with staggered dotWave keyframe)
- `.page-fade` — 250ms opacity fade-in on every page
- `.progress-bar` — fixed top 2px accent line, transitions width 0→100% on mount
- `.btn-signout` — hover handled via CSS (border→accent, text→primary) — no JS handlers
- `.back-to-top` — hover handled via CSS — no JS handlers
- Animations: `fadeUp`, `fadeIn`, `float`, `scanLine`, `dotWave`, `dotPulse`, `heroGlow`, `blobPulse`, `pulse-subtle`, `msgFade`

### Aesthetic rules
- Dark background with radial gradient lit from 50% -10% (`#1e2540` → transparent)
- Grain texture: SVG noise via `body::before` at 4% opacity, `position: fixed`, `z-index: 9999`
- Cards use gradient border (slightly lighter at top edge = lit from above)
- All buttons: `min-height: 44px`, `border-radius: 6px`, `transition 150ms ease`
- `button:active { transform: scale(0.97) }`
- Scrollbar thumb is accent color
- No purple anywhere. No bouncy animations. Nothing playful.
- Navbar is a **server component** — no JS event handlers. Hover effects via CSS classes only.

### Navbar specifics
- `position: sticky`, height `56px`, `backdrop-filter: blur(12px)`, semi-transparent surface bg
- Gradient bottom border via absolute `div` (more reliable than `border-image` with backdrop-filter)
- Logo: `/public/debrief_icon.png` at 35×35px (white icon, no opacity reduction)
- Email truncated at 200px with ellipsis

### Landing page hero order (top to bottom)
1. Floating icon (83×83px, ambient radial glow, `icon-float` animation)
2. Headline — "Your interview," / "debriefed." (period in accent color)
3. Pill badge ("AI-Powered Interview Analysis")
4. Subheadline (max-width 480px)
5. Two CTA buttons (Sign in with Google, See how it works ↓)

Three background blobs: absolute divs with radial gradients + `filter: blur()`, max opacity 0.08.

### Dashboard badge colors by interview type
- Phone Screen: `#4a9eff` (blue)
- Technical: `#a78bfa` (purple)
- Behavioral: `#2dd4bf` (teal)
- Final Round: `#fb923c` (amber)

### Analysis rendering
`AnalysisContent.tsx` is a shared client component used in both `DebriefForm.tsx` (post-completion) and `debrief/[id]/page.tsx`. It uses `react-markdown` with custom `components` prop — h2 gets a 3px solid accent left border with box-shadow glow, 40px top margin. h2 is also Manrope 700.

## Current Build Status
- [x] Project scaffold
- [x] Supabase wiring (browser + server clients, middleware, RLS, increment_debrief_count RPC)
- [x] Anthropic wiring (streaming API route with sentinel-based ID return)
- [x] Auth flow (Google OAuth, callback, profile insert, signout)
- [x] Intake form (buffered streaming, cycling loading messages with animated dots)
- [x] Dashboard (server component, force-dynamic, debrief cards with scan line hover)
- [x] Debrief detail page (server component, AnalysisContent, CopyButton, PageProgressBar, BackToTop)
- [x] Full dark theme UI polish (landing, dashboard, form, detail page)
- [x] Stripe integration (checkout, portal, webhook, freemium gate, UpgradeModal, UpgradeButton, ManageSubscriptionButton)
- [ ] Freemium gating enforced (debrief_count tracked, gate exists at limit=1 but intentionally not enforced yet)
- [ ] Waitlist page (table exists, no UI)

## Things Not To Change Without Being Asked
- The streaming buffer behavior — analysis is intentionally hidden until complete, not streamed to screen
- The system prompt in `/api/debrief/route.ts` — do not modify without explicit instruction
- The color palette — locked. No purple.
- Font choices — Manrope + DM Sans. Do not switch.
- The `debrief_count` increment logic — it runs but is not enforced as a gate

## Stripe Architecture

### Components
- `UpgradeButton.tsx` — client component, POSTs to `/api/stripe/checkout`, redirects to Stripe Checkout. Injected into Navbar via `actionSlot` prop for free users.
- `ManageSubscriptionButton.tsx` — client component, POSTs to `/api/stripe/portal`, redirects to Stripe Customer Portal. Injected into Navbar via `actionSlot` for pro users.
- `UpgradeModal.tsx` — client component shown when the debrief API returns 402. Focus-trapped modal with feature list and upgrade CTA.

### API Routes
- `POST /api/stripe/checkout` — creates Stripe customer if needed, stores `stripe_customer_id` in profiles, creates Checkout session. **Must use service role client for all DB operations** — the cookie-based server client is blocked by RLS from writing `stripe_customer_id`. Uses `createServerClient` only for `auth.getUser()`, then switches to service role for reads/writes.
- `POST /api/stripe/portal` — creates Stripe Customer Portal session for managing/canceling subscriptions.
- `POST /api/stripe/webhook` — verifies Stripe signature, handles `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`. Uses service role client. Matches profiles by `stripe_customer_id`.

### Freemium Gate
In `/api/debrief/route.ts`: after auth, fetch `debrief_count` + `subscription_status`. If `subscription_status !== 'active'` and `debrief_count >= 1`, return 402. Client intercepts 402 and opens UpgradeModal.

### Navbar Upgrade/Manage Pattern
Navbar is a server component — no JS handlers allowed. Interactive Stripe buttons are client components injected via the `actionSlot?: React.ReactNode` prop. Dashboard passes `<UpgradeButton />` for free users and `<ManageSubscriptionButton />` for active subscribers.

### Critical: RLS and stripe_customer_id
RLS on the profiles table blocks the cookie-based Supabase client from writing `stripe_customer_id`. If the checkout route ever uses the regular server client for profile updates, the customer ID silently fails to save — the webhook then matches 0 rows and `subscription_status` never updates (returns 200, no error, just silent no-op). Always use the service role client for any profile write in Stripe-related routes.

## Voice in UI Copy
Direct, no fluff. "Get My Debrief" not "Submit." "What happened?" not "Interview Notes." Error messages that sound like a person wrote them, not a system.

## Stripe Testing
To test webhooks locally:
1. Install Stripe CLI from stripe.com/docs/stripe-cli
2. Run: `stripe login` — must authenticate to the account matching the `sk_test_51TJi2E...` keys. Run `stripe whoami` to confirm the account ID contains `TJi2E`.
3. Run: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
4. Copy the signing secret printed by `stripe listen` (starts with `whsec_`) into `STRIPE_WEBHOOK_SECRET` in `.env.local` — this secret changes each CLI session.
5. In a separate terminal: `npm run dev`
6. Use Stripe test card: 4242 4242 4242 4242, any future date, any CVC
7. Check Supabase profiles table to confirm `stripe_customer_id` is populated and `subscription_status` updated to `active`

**Common failure modes:**
- `stripe listen` shows nothing after checkout → CLI is logged into wrong Stripe account. Run `stripe login` and re-authenticate to the correct account.
- Webhook returns 200 but profile not updated → `stripe_customer_id` is null in the profile (checkout route failed to write it due to RLS). Confirm checkout route uses service role client for DB ops.
- Webhook returns 400 "Invalid signature" → signing secret in `.env.local` doesn't match current `stripe listen` session. Copy the new secret and restart dev server.

## Important Supabase Pattern
Any server-side route that writes to the database must use the 
service role client (/lib/supabase/server-admin.ts or equivalent),
NOT the cookie-based client. The cookie client respects RLS and 
will silently block writes in API routes. This caused a bug in the 
Stripe checkout flow where stripe_customer_id was never saved.