export type Profile = {
  id: string
  email: string
  debrief_count: number
  is_pro: boolean
  created_at: string
}

export type Debrief = {
  id: string
  user_id: string
  job_title: string
  company_name: string
  job_description: string
  interview_notes: string
  interview_type: string
  analysis: string | null
  created_at: string
}

export type Waitlist = {
  id: string
  email: string
  created_at: string
}
