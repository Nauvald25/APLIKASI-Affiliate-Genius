'use client'
import { useEffect, useState } from 'react'
import {
  getStats, getChartData, getFunnelData,
    getSuggestions, getHealth, getTasks, getLinks,
} from '@/lib/dashboard-data'
import { useRealtimeTable } from '@/lib/useRealtime'

function formatRp(n) {
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(1)} jt`
  if (n >= 1000) return `Rp ${(n / 1000).toFixed(0)} rb`
  return `Rp ${n}`
}
function formatNum(n) { return (n || 0).toLocaleString('id-ID') }


function StatCard({ label, value, sub, change, accent, loading }) {
  return (
    <div style={{
      padding: '1.25rem 1.5rem', background: 'var(--bg-card)',
      borderRadius: '12px', border: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', gap: '0.5rem',
    }}>
      <div style={{
        fontSize: '0.75rem', color: 'var(--text-dimmer)',
        textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600,
      }}>{label}</div>
      <div style={{
        fontSize: '1.75rem', fontWeight: 800, lineHeight: 1,
        color: accent || 'var(--text)', opacity: loading ? 0.4 : 1, transition: 'opacity 0.3s',
      }}>{loading ? '...' : value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
        {change !== undefined && (
          <span style={{ color: change >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
            {change >= 0 ? '▲' : '▼'} {Math.abs(change)}%
          </span>
        )}
        <span style={{ color: 'var(--text-dimmer)' }}>{sub}</span>
      </div>
    </div>
  )
}

function BarChart({ data }) {
  const maxKlik = Math.max(...data.map(d => d.klik), 1)
  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: '12px',
      border: '1px solid var(--border)', padding: '1.5rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Performa 7 Hari</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{
            padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem',
            background: 'rgba(99,102,241,0.15)', color: 'var(--primary)', fontWeight: 600,
          }}>Klik</span>
          <span style={{
            padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem',
            background: 'rgba(6,182,212,0.15)', color: 'var(--cyan)', fontWeight: 600,
          }}>Order</span>
        </div>
      </div>
      <div style={{
        display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', gap: '0.75rem', height: '180px',
      }}>
        {data.map((d, i) => {
          const h = (d.klik / maxKlik) * 100
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '100%', height: `${h}%`,
                background: 'linear-gradient(180deg, #22d3ee 0%, #6366f1 100%)',
                borderRadius: '6px 6px 0 0', minHeight: '20px', transition: 'all 0.3s',
              }} />
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dimmer)' }}>{d.day}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AICopilot({ suggestions }) {
  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: '12px',
      border: '1px solid var(--border)', padding: '1.5rem',
      display: 'flex', flexDirection: 'column', height: '100%',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>AI Growth Copilot</h3>
        <span style={{
          padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.65rem',
          background: 'linear-gradient(135deg, #f97316, #ef4444)',
          color: '#fff', fontWeight: 700,
        }}>BARU</span>
      </div>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '1rem' }}>
        Asisten yang membaca data tracker Anda lalu memberi tindakan konkret.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        {suggestions.map((s, i) => (
          <div key={i} style={{
            padding: '0.75rem 1rem', background: 'var(--bg-hover)',
            borderRadius: '8px', border: '1px solid var(--border)',
            fontSize: '0.8rem', lineHeight: 1.5, display: 'flex', gap: '0.75rem',
          }}>
            <span style={{ fontSize: '1rem', flexShrink: 0 }}>{s.icon}</span>
            <span style={{ color: 'var(--text-dim)' }}>{s.text}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button style={{
          flex: 1, padding: '0.6rem', borderRadius: '8px', border: 'none',
          background: 'var(--primary)', color: '#fff', fontWeight: 600, fontSize: '0.8rem',
        }}>Terapkan saran</button>
        <button style={{
          padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border)',
          background: 'transparent', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.8rem',
        }}>Lihat detail</button>
      </div>
    </div>
  )
}

function Funnel({ data }) {
  const max = data[0]?.value || 1
  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: '12px',
      border: '1px solid var(--border)', padding: '1.5rem',
    }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem' }}>Funnel Konversi</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {data.map((d, i) => {
          const pct = (d.value / max) * 100
          return (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{d.label}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{formatNum(d.value)}</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-hover)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${pct}%`,
                  background: d.color, borderRadius: '999px', transition: 'width 0.5s',
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HealthCard({ items }) {
  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: '12px',
      border: '1px solid var(--border)', padding: '1.5rem',
    }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Kesehatan Akun</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {items.map((it, i) => (
          <span key={i} style={{
            padding: '0.35rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
            background: it.ok ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
            color: it.ok ? 'var(--success)' : 'var(--warning)',
            border: `1px solid ${it.ok ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
          }}>{it.label}</span>
        ))}
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.5, marginBottom: '1rem' }}>
        Pemeriksaan otomatis: link mati, klam komisi belum tercatat, dan konten kedaluwarsa akan diberi notifikasi.
      </p>
      <div style={{
        padding: '0.75rem 1rem', background: 'rgba(99,102,241,0.1)',
        border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px',
        fontSize: '0.75rem', color: 'var(--text-dim)',
      }}>
        💡 Fitur usulan: <strong style={{ color: 'var(--primary)' }}>Link Health Monitor</strong> — cek 404/redirect tiap link tiap 24 jam.
      </div>
    </div>
  )
}

function TasksCard({ tasks, onToggle }) {
  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: '12px',
      border: '1px solid var(--border)', padding: '1.5rem',
    }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Tugas Hari Ini</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {tasks.map(t => (
          <button
            key={t.id}
            onClick={() => onToggle(t.id)}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.75rem 0.875rem', background: 'transparent',
              border: '1px solid var(--border)', borderRadius: '8px',
              color: 'var(--text)', fontSize: '0.85rem', textAlign: 'left', width: '100%',
            }}
          >
            <span style={{
              textDecoration: t.status === 'done' ? 'line-through' : 'none',
              color: t.status === 'done' ? 'var(--text-dimmer)' : 'var(--text)',
            }}>{t.title}</span>
            <span style={{
              padding: '0.15rem 0.55rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600,
              background: t.status === 'done' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
              color: t.status === 'done' ? 'var(--success)' : 'var(--warning)',
            }}>{t.status === 'done' ? 'Selesai' : 'Belum'}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function LinkTable({ links }) {
  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: '12px',
      border: '1px solid var(--border)', padding: '1.5rem', overflowX: 'auto',
    }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Manajemen Link</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['Produk', 'Klik', 'Konversi', 'CR', 'Komisi'].map(h => (
              <th key={h} style={{
                textAlign: 'left', padding: '0.75rem 0.5rem', color: 'var(--text-dimmer)',
                fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {links.map(l => {
            const cr = l.clicks ? ((l.conversions / l.clicks) * 100).toFixed(1) : '0.0'
            const crNum = parseFloat(cr)
            return (
              <tr key={l.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600 }}>{l.product}</td>
                <td style={{ padding: '0.875rem 0.5rem' }}>{formatNum(l.clicks)}</td>
                <td style={{ padding: '0.875rem 0.5rem' }}>{formatNum(l.conversions)}</td>
                <td style={{ padding: '0.875rem 0.5rem' }}>
                  <span style={{
                    padding: '0.15rem 0.55rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                    background: crNum >= 5 ? 'rgba(16,185,129,0.15)' : crNum >= 3 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                    color: crNum >= 5 ? 'var(--success)' : crNum >= 3 ? 'var(--warning)' : 'var(--danger)',
                  }}>{cr}%</span>
                </td>
                <td style={{ padding: '0.875rem 0.5rem', fontWeight: 700 }}>{formatRp(l.commission || 0)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [chart, setChart] = useState([])
  const [funnel, setFunnel] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [health, setHealth] = useState([])
  const [tasks, setTasks] = useState([])
  const [links, setLinks] = useState([])
  const realtimeLinks = useRealtimeTable('affiliate_links', getLinks)

  useEffect(() => { loadAll() }, [])

  useEffect(() => {
    setLinks(realtimeLinks)
    if (realtimeLinks.length > 0) {
      getStats().then(setStats)
      getFunnelData().then(setFunnel)
    }
  }, [realtimeLinks])

  async function loadAll() {
    setLoading(true)
    const [s, c, f, sg, h, t, l] = await Promise.all([
      getStats(), getChartData(), getFunnelData(),
      getSuggestions(), getHealth(), getTasks(), getLinks(),
    ])
    setStats(s); setChart(c); setFunnel(f)
    setSuggestions(sg); setHealth(h); setTasks(t); setLinks(l)
    setLoading(false)
  }

  function toggleTask(id) {
    setTasks(tasks.map(t => t.id === id
      ? { ...t, status: t.status === 'done' ? 'todo' : 'done' }
      : t))
  }

  if (!stats) return <div style={{ color: 'var(--text-dim)' }}>Loading...</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>Ringkasan performa affiliate kamu hari ini.</p>
        </div>
        <button
          onClick={loadAll}
          style={{
            padding: '0.6rem 1rem', borderRadius: '8px',
            border: '1px solid var(--border)', background: 'var(--bg-card)',
            color: 'var(--text)', fontSize: '0.85rem', fontWeight: 600,
          }}>🔄 Refresh</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatCard label="Pendapatan Komisi" value={formatRp(stats.komisi)} change={stats.komisiChange} sub="vs bulan lalu" loading={loading} />
        <StatCard label="Klik Unik" value={formatNum(stats.klik)} change={stats.klikChange} sub="bulan ini" loading={loading} />
        <StatCard label="Conversion Rate" value={`${stats.cr}%`} change={stats.crChange} sub={`dari ${formatNum(stats.klik)} klik`} accent="var(--cyan)" loading={loading} />
        <StatCard label="Konten Live" value={formatNum(stats.konten)} sub="37 dijadwalkan 7 hari" accent="var(--warning)" loading={loading} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <BarChart data={chart} />
        <AICopilot suggestions={suggestions} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <Funnel data={funnel} />
        <HealthCard items={health} />
        <TasksCard tasks={tasks} onToggle={toggleTask} />
      </div>

      <LinkTable links={links} />
    </div>
  )
}