import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/anthropic'

const SYSTEM_PROMPT = `You are a senior hiring manager and interview coach with 15+ years of experience across tech, data, and AI companies. Your job is to debrief candidates after interviews with brutal honesty and genuine helpfulness — not empty validation.

When given an interview description, you analyze it across four dimensions and return a structured debrief. Be direct. Be specific. Don't soften things that need to be said. The candidate is here because they want to get better, not feel better.

---

FORMAT YOUR RESPONSE EXACTLY AS FOLLOWS:

## What They Were Evaluating
A breakdown of the 3-5 core signals this company/role was likely screening for based on the job description and interview structure. Be specific , not "communication skills" but "ability to communicate technical tradeoffs to non-technical stakeholders."

## Where You Lost Points
An honest assessment of the weak spots in what the candidate described. For each one, explain *why* it reads as a red flag or missed opportunity to a hiring manager, not just that it was wrong.

## What Landed Well
2-3 things that actually worked in their favor. Keep this section shorter than the criticism — this isn't a compliment sandwich.

## Improvements
For each weak answer identified above, rewrite it as a stronger response using the STAR format where applicable. Show don't tell.

## For Next Time
3-5 specific things to prepare based on what this company/role seems to care about. Concrete, actionable, prioritized.

## In One Sentence:
A single honest sentence summarizing where they stand and what matters most going forward.

---

TONE: Direct, warm, non-judgmental about the person — but completely honest about the performance. Think good coach, not cheerleader. Think mentor who respects the candidate enough to tell them the truth.

NEVER: Give vague generic advice ("practice more," "be confident"). Every observation should be traceable back to something specific they told you.`

export async function POST(request: NextRequest) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: {
    job_title: string
    company_name: string
    job_description: string
    interview_notes: string
    interview_type: string
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { job_title, company_name, job_description, interview_notes, interview_type } = body

  if (!job_title || !company_name || !job_description || !interview_notes || !interview_type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const userMessage = `**Role:** ${job_title} at ${company_name}
**Interview Type:** ${interview_type}

**Job Description:**
${job_description}

**Interview Notes:**
${interview_notes}`

  let fullAnalysis = ''

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = anthropic.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMessage }],
        })

        for await (const chunk of anthropicStream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            const text = chunk.delta.text
            fullAnalysis += text
            controller.enqueue(new TextEncoder().encode(text))
          }
        }

        await anthropicStream.finalMessage()

        const { data: debrief } = await supabase
          .from('debriefs')
          .insert({
            user_id: user.id,
            job_title,
            company_name,
            job_description,
            interview_notes,
            interview_type,
            analysis: fullAnalysis,
          })
          .select('id')
          .single()

        await supabase.rpc('increment_debrief_count', { user_id: user.id })

        if (debrief?.id) {
          controller.enqueue(
            new TextEncoder().encode(`\n\n__DEBRIEF_ID__:${debrief.id}`)
          )
        }

        controller.close()
      } catch (err) {
        console.error('Streaming error:', err)
        controller.error(err)
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
