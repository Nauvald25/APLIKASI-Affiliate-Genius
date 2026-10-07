'use client'
import { useEffect, useState } from 'react'
import { getImageStyles, getRecentPrompts, generatePrompt } from '@/lib/image-generator-data'

export default function ImageGenerator() {
  const [styles, setStyles] = useState([])
  const [recent, setRecent] = useState([])
  const [product, setProduct] = useState('')
  const [style, setStyle] = useState('commercial')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [s, r] = await Promise.all([getImageStyles(), getRecentPrompts()])
    setStyles(s); setRecent(r); setStyle(s[0]?.value || 'commercial')
  }

  async function generate(e) {
    e.preventDefault()
    if (!product) return
    setLoading(true)
    setError('')
    try {
      const prompt = await generatePrompt(product, style)
      const localId = `local-${Date.now()}`
      setResult(prompt)
      setRecent(current => [
        { id: localId, product, style, prompt, created: new Date().toISOString().split('T')[0] },
        ...current.slice(0, 4),
      ])
    } catch (error) {
      setError(error.message || 'Gemini gagal dipanggil')
    } finally {
      setLoading(false)
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(result)
    alert('Copied!')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>AI Image Generator</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>Buat prompt foto produk e-commerce dengan bantuan AI.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <form onSubmit={generate} style={{
          display: 'flex', flexDirection: 'column', gap: '1rem',
          padding: '1.5rem', background: 'var(--bg-card)',
          borderRadius: '12px', border: '1px solid var(--border)',
        }}>
          <div>
            <label style={labelStyle}>Nama Produk</label>
            <input
              placeholder="Contoh: sepatu lari"
              value={product}
              onChange={e => setProduct(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Style</label>
            <select value={style} onChange={e => setStyle(e.target.value)} style={inputStyle}>
              {styles.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          {error && <p style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{
            padding: '0.75rem', borderRadius: '8px', border: 'none',
            background: loading ? 'var(--border)' : 'var(--primary)',
            color: '#fff', fontWeight: 700, fontSize: '0.9rem',
            cursor: loading ? 'wait' : 'pointer',
          }}>
            {loading ? '⏳ Generating...' : '✨ Generate Prompt'}
          </button>
        </form>

        <div style={{
          padding: '1.5rem', background: 'var(--bg-card)',
          borderRadius: '12px', border: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Hasil Prompt</h3>
            {result && (
              <button onClick={copy} style={{
                padding: '0.35rem 0.75rem', borderRadius: '6px',
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text)', fontSize: '0.75rem', fontWeight: 600,
              }}>📋 Copy</button>
            )}
          </div>
          {result ? (
            <p style={{
              padding: '1rem', background: 'var(--bg-hover)',
              borderRadius: '8px', fontSize: '0.85rem',
              lineHeight: 1.6, color: 'var(--text-dim)',
              fontFamily: 'monospace',
            }}>{result}</p>
          ) : (
            <p style={{ color: 'var(--text-dimmer)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>
              Prompt akan muncul di sini.
            </p>
          )}
        </div>
      </div>

      <div style={{
        background: 'var(--bg-card)', borderRadius: '12px',
        border: '1px solid var(--border)', padding: '1.5rem',
      }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Riwayat Prompt</h3>
        {recent.length === 0 ? (
          <p style={{ color: 'var(--text-dimmer)', fontSize: '0.85rem' }}>Belum ada riwayat.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recent.map(r => (
              <div key={r.id} style={{
                padding: '0.875rem 1rem', background: 'var(--bg-hover)',
                border: '1px solid var(--border)', borderRadius: '8px',
              }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '0.85rem' }}>{r.product}</strong>
                  <span style={{
                    padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem',
                    background: 'rgba(99,102,241,0.15)', color: 'var(--primary)', fontWeight: 600,
                  }}>{r.style}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dimmer)', marginLeft: 'auto' }}>{r.created}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.5, fontFamily: 'monospace' }}>
                  {r.prompt}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: '0.7rem', color: 'var(--text-dimmer)', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }
const inputStyle = { width: '100%', padding: '0.7rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text)', fontSize: '0.85rem' }