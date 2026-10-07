import { NextResponse } from 'next/server'

const fallbackModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']

async function generateWithGemini(apiKey, product, style) {
  const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`, { cache: 'no-store' })
  const listBody = await listResponse.json()
  const available = Array.isArray(listBody.models)
    ? listBody.models
        .filter(model => model.supportedGenerationMethods?.includes('generateContent'))
        .map(model => model.name.replace(/^models\//, ''))
    : []
  const models = [...new Set([...fallbackModels.filter(model => available.includes(model)), ...available])]
  if (!models.length) throw new Error(listBody.error?.message || 'Tidak ada model Gemini yang mendukung generateContent')

  let lastError
  for (const modelName of models) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `Write one detailed English e-commerce product photography prompt. Product: ${product}. Style: ${style}. Return prompt only.` }] }] }),
        cache: 'no-store',
      })
      const body = await response.json()
      if (!response.ok) {
        lastError = new Error(body.error?.message || `Gemini HTTP ${response.status}`)
        continue
      }
      const prompt = body.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim()
      if (prompt) return { prompt, model: modelName }
    } catch (error) {
      lastError = error
    }
  }
  throw lastError || new Error('Semua model Gemini gagal dipanggil')
}

export async function POST(request) {
  const apiKey = process.env.GEMINI_API_KEY?.trim().replace(/^['"]|['"]$/g, '')
  if (!apiKey) return NextResponse.json({ error: 'GEMINI_API_KEY belum dikonfigurasi di server' }, { status: 503 })
  try {
    const body = await request.json()
    const product = String(body.product || '').trim()
    const style = String(body.style || 'commercial').trim()
    if (!product || product.length > 300) return NextResponse.json({ error: 'Nama produk wajib diisi dan maksimal 300 karakter' }, { status: 400 })
    const result = await generateWithGemini(apiKey, product, style)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Gemini API error:', error.message)
    return NextResponse.json({ error: 'Gemini gagal memproses permintaan', detail: process.env.NODE_ENV === 'development' ? error.message : undefined }, { status: 502 })
  }
}
