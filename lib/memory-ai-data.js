import { safeQuery, supabase } from './supabase'

export async function saveMemory(memory) {
    if (!supabase) return memory
    const current = await getMemory()
    const { data: user } = await supabase.auth.getUser()
    const owner_id = user?.user?.id
    if (!owner_id) throw new Error('LOGIN_REQUIRED')
    const payload = { owner_id, brand: memory.brand || '', audience: memory.audience || '', tone: memory.tone || '', products: memory.products || '', niche: memory.niche || '', updated_at: new Date().toISOString() }
        const query = current.id
      ? supabase.from('business_memory').update(payload).eq('id', current.id).eq('owner_id', owner_id).select().single()
      : supabase.from('business_memory').insert(payload).select().single()
    const { data, error } = await query
    if (error) throw error
    return data
  }

    export async function getMemory() {
    if (!supabase) return { brand: '', audience: '', tone: '', products: '', niche: '' }
    const { data: user } = await supabase.auth.getUser()
    const owner_id = user?.user?.id
    if (!owner_id) return { brand: '', audience: '', tone: '', products: '', niche: '' }
    const rows = await safeQuery(supabase.from('business_memory').select('*').eq('owner_id', owner_id).order('updated_at', { ascending: false }).limit(1), [])
    return rows[0] || { brand: '', audience: '', tone: '', products: '', niche: '' }
  }
  export async function getMemorySuggestions() {
    const memory = await getMemory()
    return memory.brand ? [`Selalu sebut nama brand "${memory.brand}" di awal caption`, `Gunakan tone ${memory.tone || 'yang konsisten'}`, `Sasar audience: ${memory.audience || 'belum diisi'}`] : []
  }