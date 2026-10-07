import { safeQuery, supabase } from './supabase'

export const imageStyles = [
  { value: 'commercial', label: 'Commercial' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'flat lay', label: 'Flat Lay' },
]

export async function getImageStyles() { return imageStyles }

export async function getRecentPrompts() {
  if (!supabase) return []
  const { data: auth } = await supabase.auth.getUser()
  if (!auth?.user?.id) return []
  return safeQuery(supabase.from('image_prompts').select('*').eq('owner_id', auth.user.id).order('created_at', { ascending: false }).limit(10), [])
}

export async function generatePrompt(product, style) {
  if (!product?.trim()) throw new Error('Nama produk wajib diisi')
  const response = await fetch('/api/ai/image-prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product, style }),
  })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error || 'Gemini request failed')
  const prompt = body.prompt
  if (!prompt) throw new Error('Gemini mengembalikan prompt kosong')
  if (supabase) {
    const { data: auth } = await supabase.auth.getUser()
    if (auth?.user?.id) await supabase.from('image_prompts').insert({ owner_id: auth.user.id, product, style, prompt })
  }
  return prompt
}