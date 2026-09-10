# The Debrief

The Debrief is a web app where job seekers paste in a job description and their interview notes, and receive an honest, structured AI analysis of how the interview went and how to improve.

## Features
- **AI-Powered Analysis:** Uses Anthropic's Claude 3.5 Sonnet to analyze interview notes and job descriptions.
- **Actionable Feedback:** Provides a structured breakdown of what went well, what felt off, and exactly what to fix before the next round.
- **Pro Tier:** Freemium model with a Pro tier for unlimited debriefs, powered by Stripe.
- **Beautiful UI:** A dark-themed, meticulously crafted UI with custom animations and aesthetics.

## Tech Stack
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router), TypeScript
- **Styling:** Tailwind CSS + CSS custom properties
- **Auth & Database:** [Supabase](https://supabase.com/) (Google OAuth, Postgres)
- **AI:** Anthropic API (`claude-3-5-sonnet`)
- **Hosting:** Vercel
- **Payments:** Stripe

## Getting Started

### Prerequisites
- Node.js (v20+)
- npm or pnpm
- A Supabase project
- An Anthropic API key
- A Stripe account

### Environment Variables
Create a `.env.local` file in the root directory and add the following keys. **Never hardcode these values.**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd the-debrief
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Local Stripe Testing

To test Stripe webhooks locally:
1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli).
2. Authenticate the CLI with your Stripe account:
   ```bash
   stripe login
   ```
3. Start listening for webhook events and forward them to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Copy the signing secret provided by the CLI (starts with `whsec_`) and set it as `STRIPE_WEBHOOK_SECRET` in your `.env.local`. **Note that this secret changes each CLI session.**
5. Restart your development server.
6. Trigger a test event or use a test card (e.g., `4242 4242 4242 4242`) in the UI to simulate a checkout.

## Project Structure
- `src/app/`: Next.js pages and routes.
- `src/components/`: Reusable React components.
- `src/lib/`: Utility functions and third-party client singletons (e.g., Supabase, Anthropic, Stripe).
- `src/types/`: TypeScript definitions.
