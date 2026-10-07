import { safeQuery, supabase } from './supabase'

export async function getAbTests() {
    if (!supabase) return []
    const { data: auth } = await supabase.auth.getUser()
    if (!auth?.user?.id) return []
    const rows = await safeQuery(supabase.from('landing_tests').select('*').eq('owner_id', auth.user.id).order('test_name'), [])
    return Object.values(rows.reduce((groups, row) => {
      const name = row.test_name || 'Untitled test'
      groups[name] ||= { name, variants: [] }
      groups[name].variants.push({ id: row.id, variant: row.variant, visitors: row.visitors || 0, conversions: row.conversions || 0 })
      return groups
    }, {}))
  }
  
  export function conversionRate(v, c) {
    if (!v) return 0
    return ((c / v) * 100).toFixed(2)
  }