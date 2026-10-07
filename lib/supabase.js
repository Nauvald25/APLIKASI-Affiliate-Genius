import { createClient } from '@supabase/supabase-js'

// Client aman: saat env belum diisi, supabase bernilai null dan getter
// pada file data akan mengembalikan nilai kosong tanpa membuat aplikasi crash.
const first = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/^['"]|['"]$/g, '')
const second = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim().replace(/^['"]|['"]$/g, '')
const rawUrl = first?.startsWith('http') ? first : second?.startsWith('http') ? second : ''
const key = first?.startsWith('http') ? second : second?.startsWith('http') ? first : second
const url = rawUrl && /^https?:\/\/[^\s]+$/i.test(rawUrl) ? rawUrl : null

export const supabase = url && key
  ? createClient(url, key, { auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true } })
  : null

export const isSupabaseReady = () => Boolean(supabase)

// Helper query agar error Supabase tidak bocor ke UI.
export async function getCurrentUser() {
  if (!supabase) return null
  const { data } = await supabase.auth.getUser()
  return data?.user || null
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) throw new Error('LOGIN_REQUIRED')
  return user
}

  export async function safeQuery(query, fallback) {
  if (!supabase) return fallback
  try {
    const { data, error } = await query
    if (error) {
      console.error('Supabase query error:', error.message)
      return fallback
    }
    return data ?? fallback
  } catch (error) {
    console.error('Supabase connection error:', error.message)
    return fallback
  }
}