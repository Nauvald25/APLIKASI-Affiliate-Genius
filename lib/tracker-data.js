
import { safeQuery, supabase } from './supabase'

export async function getLinkProducts() {
  if (!supabase) return []
  const { data: auth } = await supabase.auth.getUser()
  if (!auth?.user?.id) return []
  const rows = await safeQuery(supabase.from('affiliate_links').select('*').eq('owner_id', auth.user.id).order('created_at', { ascending: false }), [])
  return rows.map(link => ({
    ...link,
    product: link.product || link.url,
    conversions: link.orders || 0,
    cr: link.clicks ? Number(((link.orders || 0) / link.clicks * 100).toFixed(1)) : 0,
  }))
}

export async function getTrackerStats() {
  const links = await getLinkProducts()
  const clicks = links.reduce((sum, link) => sum + Number(link.clicks || 0), 0)
  const commission = links.reduce((sum, link) => sum + Number(link.commission || 0), 0)
  return {
    komisiBulanIni: commission,
    epc: clicks ? Math.round(commission / clicks) : 0,
    linkAktif: links.filter(link => link.active !== false).length,
    linkMati: links.filter(link => link.active === false).length,
  }
}

export async function getNewFeatures() { return [] }
export async function getComparison() {
  return {
    now: { title: 'Data live', text: 'Data dibaca langsung dari Supabase.' },
    next: { title: 'Tracking otomatis', text: 'Klik dan konversi dicatat melalui API.' },
  }
}