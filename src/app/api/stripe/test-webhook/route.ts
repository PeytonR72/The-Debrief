// TEMPORARY — delete after testing
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get('customer_id')
  const email      = searchParams.get('email')

  if (!customerId && !email) {
    return NextResponse.json(
      { error: 'Provide customer_id or email as a query param' },
      { status: 400 }
    )
  }

  const supabase = getServiceClient()

  const query = supabase
    .from('profiles')
    .update({ subscription_status: 'active' })
    .select()

  if (customerId) {
    query.eq('stripe_customer_id', customerId)
  } else {
    query.eq('email', email)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'No matching profile found' }, { status: 404 })
  }

  return NextResponse.json({ updated: data })
}
