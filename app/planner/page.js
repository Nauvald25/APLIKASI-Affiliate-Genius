'use client'
import { useEffect, useState } from 'react'
import { getPlannerConfig, getPlannerItems, getPlannerStats, addPlannerItem, deletePlannerItem } from '@/lib/planner-data'

function StatCard({ label, value, accent }) {
  return (
    <div style={{
      padding: '1.25rem 1.5rem', background: 'var(--bg-card)',
      borderRadius: '12px', border: '1px solid var(--border)',
    }}>
      <div style={{
        fontSize: '0.7rem', color: 'var(--text-dimmer)',
        textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600,
        marginBottom: '0.4rem',
      }}>{label}</div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: accent || 'var(--text)' }}>{value}</div>
    </div>
  )
}

function PlatformBadge({ platform }) {
  const colors = {
    Instagram: { bg: 'rgba(236,72,153,0.15)', color: '#ec4899' },
    TikTok:    { bg: 'rgba(6,182,212,0.15)',  color: '#06b6d4' },
    Facebook:  { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
  }
  const c = colors[platform] || colors.Instagram
  return (
    <span style={{
      padding: '0.15rem 0.6rem', borderRadius: '6px',
      fontSize: '0.7rem', fontWeight: 700,
      background: c.bg, color: c.color,
    }}>{platform}</span>
  )
}

export default function Planner() {
  const [config, setConfig] = useState(null)
  const [items, setItems] = useState([])
  const [stats, setStats] = useState(null)
  const [form, setForm] = useState({ platform: 'Instagram', content_type: 'video', title: '', scheduled_date: '' })

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [c, i, s] = await Promise.all([getPlannerConfig(), getPlannerItems(), getPlannerStats()])
    setConfig(c); setItems(i); setStats(s)
  }

    async function add(e) {
    e.preventDefault()
    if (!form.title || !form.scheduled_date) return
    try {
      const item = await addPlannerItem({ ...form, status: 'draft' })
      setItems(current => [item, ...current])
      setForm({ ...form, title: '', scheduled_date: '' })
      const next = await getPlannerStats()
      setStats(next)
    } catch (error) {
    const message = error.message === 'SUPABASE_NOT_CONFIGURED'
        ? 'Supabase belum terbaca. Periksa .env dan restart server.'
        : error.message
      alert(`Gagal menyimpan jadwal: ${message}`)
    }
  }

  async function remove(id) {
    try {
      await deletePlannerItem(id)
      setItems(current => current.filter(i => i.id !== id))
      setStats(await getPlannerStats())
    } catch (error) {
      const message = error.message === 'SUPABASE_NOT_CONFIGURED'
        ? 'Supabase belum terbaca. Periksa .env dan restart server.'
        : error.message
      alert(`Gagal menghapus jadwal: ${message}`)
    }
  }

  if (!config || !stats) return <div style={{ color: 'var(--text-dim)' }}>Loading...</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Content Planner</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>Jadwalkan konten Facebook, Instagram, TikTok.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <StatCard label="Dijadwalkan" value={stats.scheduled} accent="var(--primary)" />
        <StatCard label="Draft"       value={stats.draft}     accent="var(--warning)" />
        <StatCard label="Published"   value={stats.published} accent="var(--success)" />
      </div>

      <form onSubmit={add} style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 1fr auto',
        gap: '0.75rem', padding: '1.25rem',
        background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)',
      }}>
        <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} style={inputStyle}>
          {config.platforms.map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={form.content_type} onChange={e => setForm({ ...form, content_type: e.target.value })} style={inputStyle}>
          {config.contentTypes.map(c => <option key={c}>{c}</option>)}
        </select>
        <input placeholder="Judul konten" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} />
        <input type="date" value={form.scheduled_date} onChange={e => setForm({ ...form, scheduled_date: e.target.value })} style={inputStyle} />
        <button type="submit" style={btnStyle}>+ Tambah</button>
      </form>

      <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Jadwal Konten</h3>
        {items.length === 0 ? (
          <p style={{ color: 'var(--text-dimmer)', fontSize: '0.85rem' }}>Belum ada jadwal.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {items.map(it => (
              <div key={it.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.875rem 1rem', background: 'var(--bg-hover)',
                border: '1px solid var(--border)', borderRadius: '8px',
                gap: '0.75rem', flexWrap: 'wrap',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                  <PlatformBadge platform={it.platform} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{it.title}</div>
                    <div style={{ color: 'var(--text-dimmer)', fontSize: '0.72rem' }}>
                      {it.content_type} · {it.scheduled_date}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{
                    padding: '0.15rem 0.55rem', borderRadius: '999px',
                    fontSize: '0.7rem', fontWeight: 600,
                    background: it.status === 'scheduled' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                    color: it.status === 'scheduled' ? 'var(--success)' : 'var(--warning)',
                  }}>{it.status}</span>
                  <button onClick={() => remove(it.id)} style={delBtn}>×</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const inputStyle = { padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text)', fontSize: '0.85rem' }
const btnStyle = { padding: '0.65rem 1rem', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: 600, fontSize: '0.85rem' }
const delBtn = { padding: '0.35rem 0.7rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-dimmer)', cursor: 'pointer', fontSize: '0.9rem' }