import { safeQuery, supabase } from './supabase'

export async function saveStoreProfile(profile) {
    if (!supabase) return profile
    const { data: user } = await supabase.auth.getUser()
    const owner_id = user?.user?.id
    if (!owner_id) throw new Error('LOGIN_REQUIRED')
    const payload = { owner_id, slug: profile.slug || '', title: profile.title || '', bio: profile.bio || '', avatar: profile.avatar || '', theme: profile.theme || 'dark', visitors: Number(profile.visitors || 0) }
        const query = profile.id
      ? supabase.from('store_profiles').update(payload).eq('id', profile.id).eq('owner_id', owner_id).select().single()
      : supabase.from('store_profiles').insert(payload).select().single()
    const { data, error } = await query
    if (error) throw error
    return data
  }

    export async function getStoreProfile() {
    if (!supabase) return { slug: '', title: '', bio: '', avatar: '', theme: 'dark', visitors: 0 }
    const { data: user } = await supabase.auth.getUser()
    const owner_id = user?.user?.id
    if (!owner_id) return { slug: '', title: '', bio: '', avatar: '', theme: 'dark', visitors: 0 }
    const rows = await safeQuery(supabase.from('store_profiles').select('*').eq('owner_id', owner_id).order('created_at', { ascending: false }).limit(1), [])
    return rows[0] || { slug: '', title: '', bio: '', avatar: '', theme: 'dark', visitors: 0 }
  }
  export async function getStoreLinks() {
    const profile = await getStoreProfile()
    if (!profile.id) return []
    return safeQuery(supabase.from('store_links').select('*').eq('store_id', profile.id).eq('owner_id', profile.owner_id).order('created_at'), [])
  }
  export async function getStoreFeatures() { return [] }