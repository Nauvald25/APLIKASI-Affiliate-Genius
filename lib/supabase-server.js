import { createClient } from '@supabase/supabase-js'


const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/^['"]|['"]$/g, '')
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim().replace(/^['"]|['"]$/g, '')
const url = rawUrl && /^https?:\/\/[^\s]+$/i.test(rawUrl) ? rawUrl : null

export const supabaseAdmin = url && serviceKey
  ? createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null
