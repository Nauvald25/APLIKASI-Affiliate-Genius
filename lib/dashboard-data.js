import { safeQuery, supabase } from './supabase'

async function ownerQuery(table, columns = '*') {
  if (!supabase) return null
  const { data: auth } = await supabase.auth.getUser()
  const ownerId = auth?.user?.id
  return ownerId ? supabase.from(table).select(columns).eq('owner_id', ownerId) : null
}




   
  export async function getLinks() {
        const query = await ownerQuery('affiliate_links')
    const rows = await safeQuery(query?.order('created_at', { ascending: false }), [])
    return rows.map(l => ({ ...l, product: l.product || l.url, conversions: l.orders || 0 }))
  }

  export async function getStats() {
    const links = await getLinks()
    const klik = links.reduce((sum, l) => sum + Number(l.clicks || 0), 0)
    const konversi = links.reduce((sum, l) => sum + Number(l.conversions || 0), 0)
    const komisi = links.reduce((sum, l) => sum + Number(l.commission || 0), 0)
    return { komisi, klik, konversi, cr: klik ? ((konversi / klik) * 100).toFixed(2) : 0, konten: 0, komisiChange: 0, klikChange: 0, crChange: 0 }
  }

  export async function getChartData() {
    const query = await ownerQuery('link_clicks', 'created_at')
    const rows = await safeQuery(query?.order('created_at', { ascending: true }), [])
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
    return days.map(day => ({ day, klik: rows.filter(r => days[new Date(r.created_at).getDay()] === day).length, order: 0 }))
  }

  export async function getFunnelData() {
    const stats = await getStats()
    return [{ label: 'Klik', value: stats.klik, color: '#6366f1' }, { label: 'Kunjungan Produk', value: stats.klik, color: '#06b6d4' }, { label: 'Checkout', value: stats.konversi, color: '#10b981' }, { label: 'Order Sukses', value: stats.konversi, color: '#f59e0b' }]
  }

  export async function getSuggestions() { return [] }
  export async function getHealth() { return [{ label: 'Supabase tersambung', ok: Boolean(supabase) }, { label: 'Gemini aktif', ok: Boolean(process.env.GEMINI_API_KEY) }] }
  export async function getTasks() { return [] }