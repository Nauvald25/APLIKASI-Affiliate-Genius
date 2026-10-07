import { supabase } from './supabase'

export async function listLinks() {
  if (!supabase) return []
  const { data } = await supabase.from('affiliate_links').select('*').order('created_at', { ascending: false })
  return data || []
}

export async function addLink(url, label) {
  if (!supabase) return null
  const { data } = await supabase.from('affiliate_links').insert({ url, label, clicks: 0, orders: 0 }).select().single()
  return data
}

export async function trackClick(id) {
  if (!supabase) return
  const { data } = await supabase.from('affiliate_links').select('clicks').eq('id', id).single()
  if (data) await supabase.from('affiliate_links').update({ clicks: data.clicks + 1 }).eq('id', id)
}

export async function trackOrder(id) {
  if (!supabase) return
  const { data } = await supabase.from('affiliate_links').select('orders').eq('id', id).single()
  if (data) await supabase.from('affiliate_links').update({ orders: data.orders + 1 }).eq('id', id)
}

export async function deleteLink(id) {
  if (!supabase) return
  await supabase.from('affiliate_links').delete().eq('id', id)
}