import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'


export async function POST(request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Server Supabase belum dikonfigurasi' }, { status: 503 })
  try {
    const body = await request.json()
    const { link_id, order_id = null, amount = 0, commission = 0 } = body
    if (!Number.isInteger(Number(link_id)) || Number(link_id) <= 0) return NextResponse.json({ error: 'link_id tidak valid' }, { status: 400 })
    if (!Number.isFinite(Number(amount)) || Number(amount) < 0 || !Number.isFinite(Number(commission)) || Number(commission) < 0) return NextResponse.json({ error: 'amount dan commission harus angka positif' }, { status: 400 })
    if (order_id !== null && String(order_id).length > 200) return NextResponse.json({ error: 'order_id terlalu panjang' }, { status: 400 })

    const { data: link } = await supabaseAdmin.from('affiliate_links').select('owner_id').eq('id', link_id).maybeSingle()
    if (!link) return NextResponse.json({ error: 'Link tidak ditemukan' }, { status: 404 })
    const { error: insertError } = await supabaseAdmin.from('conversions').insert({ owner_id: link.owner_id, link_id, order_id, amount: Number(amount), commission: Number(commission) })
    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 400 })

    const counter = await supabaseAdmin.rpc('increment_affiliate_order', { target_link_id: link_id })
    if (counter.error) console.error('Order counter error:', counter.error.message)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Body JSON tidak valid' }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Gunakan POST untuk mencatat konversi' }, { status: 405 })
}
