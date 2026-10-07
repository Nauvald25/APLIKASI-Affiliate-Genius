import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(request, { params }) {
  const { code } = await params
  if (!supabaseAdmin) return NextResponse.json({ error: 'Server Supabase belum dikonfigurasi' }, { status: 503 })

  const { data: link, error } = await supabaseAdmin
    .from('affiliate_links')
    .select('id, url, clicks, active, owner_id')
    .eq('code', code)
    .eq('active', true)
    .maybeSingle()

  if (error || !link || link.active === false) {
    return NextResponse.json({ error: 'Link tidak ditemukan' }, { status: 404 })
  }

  const referrer = request.headers.get('referer') || ''
  const userAgent = request.headers.get('user-agent') || ''
  const tracking = await supabaseAdmin.from('link_clicks').insert({ link_id: link.id, owner_id: link.owner_id, referrer, user_agent: userAgent })
  const counter = await supabaseAdmin.rpc('increment_affiliate_click', { target_link_id: link.id })
  if (tracking.error) console.error('Click log error:', tracking.error.message)
  if (counter.error) console.error('Click counter error:', counter.error.message)

  return NextResponse.redirect(link.url, 302)
}
