
import { safeQuery, supabase } from './supabase'

export const plannerConfig = {
  platforms: ['Facebook', 'Instagram', 'TikTok'],
  contentTypes: ['video', 'image', 'story', 'carousel'],
  bestTimes: {
    Facebook: ['09:00', '13:00', '19:00'],
    Instagram: ['11:00', '14:00', '20:00'],
    TikTok: ['06:00', '12:00', '21:00'],
  },
}

export async function addPlannerItem(item) {
  if (!supabase) throw new Error('SUPABASE_NOT_CONFIGURED')
  const { data: auth } = await supabase.auth.getUser()
  const owner_id = auth?.user?.id
  if (!owner_id) throw new Error('LOGIN_REQUIRED')
    const payload = {
    owner_id,
    platform: item.platform,
    content_type: item.content_type,
    title: item.title,
    scheduled_date: item.scheduled_date,
    status: item.status || 'draft',
  }
  const { data, error } = await supabase.from('content_plans').insert(payload).select().single()
  if (error?.code === '42703' && error.message.includes('owner_id')) {
    throw new Error('Database belum dimigrasikan. Jalankan database/multitenant.sql di Supabase SQL Editor.')
  }
  if (error) throw error
  return data
}

export async function deletePlannerItem(id) {
  if (!supabase) throw new Error('SUPABASE_NOT_CONFIGURED')
  const { data: auth } = await supabase.auth.getUser()
  const owner_id = auth?.user?.id
  if (!owner_id) throw new Error('LOGIN_REQUIRED')
  const { error } = await supabase.from('content_plans').delete().eq('id', id).eq('owner_id', owner_id)
  if (error) throw error
  return true
}

export async function getPlannerConfig() { return plannerConfig }

export async function getPlannerItems() {
  if (!supabase) return []
  const { data: auth } = await supabase.auth.getUser()
  const owner_id = auth?.user?.id
  if (!owner_id) return []
  return safeQuery(supabase.from('content_plans').select('*').eq('owner_id', owner_id).order('scheduled_date', { ascending: true }), [])
}

export async function getPlannerStats() {
  const items = await getPlannerItems()
  return {
    scheduled: items.filter(item => item.status === 'scheduled').length,
    draft: items.filter(item => item.status === 'draft').length,
    published: items.filter(item => item.status === 'published').length,
  }
}