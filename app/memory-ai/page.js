'use client'
import { useEffect, useState } from 'react'
import { getMemory, getMemorySuggestions, saveMemory } from '@/lib/memory-ai-data'

export default function MemoryAI() {
  const [form, setForm] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [status, setStatus] = useState('')

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [m, s] = await Promise.all([getMemory(), getMemorySuggestions()])
    setForm(m); setSuggestions(s)
  }

  async function handleSave(e) {
    e.preventDefault()
    setStatus('Menyimpan...')
    try {
      const saved = await saveMemory(form)
      setForm(saved)
      setSuggestions(await getMemorySuggestions())
      setStatus('Tersimpan!')
    } catch (error) {
      setStatus(`Gagal: ${error.message}`)
    }
    setTimeout(() => setStatus(''), 2500)
  }

  if (!form) return <div style={{ color: 'var(--text-dim)' }}>Loading...</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Business Memory AI</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>
          Simpan profil bisnis biar AI ingat konteks kamu di semua fitur.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        <form onSubmit={handleSave} style={{
          display: 'flex', flexDirection: 'column', gap: '1rem',
          padding: '1.5rem', background: 'var(--bg-card)',
          borderRadius: '12px', border: '1px solid var(--border)',
        }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>Profil Bisnis</h3>

          <div>
            <label style={labelStyle}>Nama Brand</label>
            <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Target Audience</label>
            <input value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Tone of Voice</label>
            <input value={form.tone} onChange={e => setForm({ ...form, tone: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Produk Utama</label>
            <textarea
              value={form.products}
              onChange={e => setForm({ ...form, products: e.target.value })}
              rows={2}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>
          <div>
            <label style={labelStyle}>Niche</label>
            <input value={form.niche} onChange={e => setForm({ ...form, niche: e.target.value })} style={inputStyle} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="submit" style={{
              padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none',
              background: 'var(--primary)', color: '#fff', fontWeight: 700, fontSize: '0.9rem',
            }}>💾 Simpan</button>
            {status && <span style={{ fontSize: '0.85rem', color: 'var(--success)' }}>{status}</span>}
          </div>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            padding: '1.5rem', background: 'var(--bg-card)',
            borderRadius: '12px', border: '1px solid var(--border)',
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>AI akan mengingat ini</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {suggestions.map((s, i) => (
                <div key={i} style={{
                  padding: '0.7rem 0.875rem',
                  background: 'var(--bg-hover)',
                  borderLeft: '3px solid var(--primary)',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  color: 'var(--text-dim)',
                }}>{s}</div>
              ))}
            </div>
          </div>

          <div style={{
            padding: '1.5rem', background: 'var(--bg-card)',
            borderRadius: '12px', border: '1px solid var(--border)',
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Preview Konteks</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
              AI akan menghasilkan konten untuk <strong style={{ color: 'var(--primary)' }}>{form.brand}</strong>,
              menyasar <strong>{form.audience || '(audience belum diisi)'}</strong>,
              dengan tone <strong>{form.tone || '(tone belum diisi)'}</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: '0.7rem', color: 'var(--text-dimmer)', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }
const inputStyle = { width: '100%', padding: '0.7rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text)', fontSize: '0.85rem' }