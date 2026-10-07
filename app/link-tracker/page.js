'use client'
import { useEffect, useState } from 'react'
import {
  getTrackerStats, getLinkProducts, getNewFeatures, getComparison,
} from '@/lib/tracker-data'

function formatRp(n) {
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(1)} jt`
  if (n >= 1000) return `Rp ${(n / 1000).toFixed(0)} rb`
  return `Rp ${n}`
}
function formatNum(n) { return (n || 0).toLocaleString('id-ID') }


function StatCard({ label, value, sub, danger }) {
  return (
    <div style={{
      padding: '1.25rem 1.5rem', background: 'var(--bg-card)',
      borderRadius: '12px', border: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', gap: '0.4rem',
    }}>
      <div style={{
        fontSize: '0.7rem', color: 'var(--text-dimmer)',
        textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600,
      }}>{label}</div>
      <div style={{
        fontSize: '1.75rem', fontWeight: 800, lineHeight: 1,
        color: danger ? 'var(--danger)' : 'var(--text)',
      }}>{value}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-dimmer)' }}>{sub}</div>}
    </div>
  )
}

function LinkTable({ products }) {
  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: '12px',
      border: '1px solid var(--border)', padding: '1.5rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Manajemen Link</h3>
        <span style={{
          padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.65rem',
          background: 'linear-gradient(135deg, #f97316, #ef4444)',
          color: '#fff', fontWeight: 700,
        }}>UPGRADE</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Produk', 'Klik', 'CR', 'Komisi'].map(h => (
                <th key={h} style={{
                  textAlign: 'left', padding: '0.75rem 0.5rem',
                  color: 'var(--text-dimmer)', fontSize: '0.7rem',
                  fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const cr = p.cr
              const crBg = cr >= 5 ? 'rgba(16,185,129,0.15)' : cr >= 3.5 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)'
              const crColor = cr >= 5 ? 'var(--success)' : cr >= 3.5 ? 'var(--warning)' : 'var(--danger)'
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600 }}>{p.product}</td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>{formatNum(p.clicks)}</td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700,
                      background: crBg, color: crColor,
                    }}>{cr}%</span>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem', fontWeight: 700 }}>{formatRp(p.commission)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function NewFeaturesCard({ features }) {
  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: '12px',
      border: '1px solid var(--border)', padding: '1.5rem',
    }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem' }}>Fitur Baru Usulan</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {features.map((f, i) => (
          <div key={i} style={{
            padding: '0.75rem 0.875rem',
            background: 'var(--bg-hover)',
            borderLeft: '3px solid var(--primary)',
            borderRadius: '6px',
            fontSize: '0.8rem',
          }}>
            <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{f.title}</div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ComparisonCard({ comparison }) {
  return (
    <div>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.875rem' }}>
        Ilustrasi: dari tracking manual ke tracking otomatis
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{
          padding: '1.25rem', background: 'var(--bg-card)',
          border: '1px solid var(--border)', borderRadius: '12px',
        }}>
          <div style={{ color: 'var(--warning)', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            {comparison.now.title}
          </div>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
            {comparison.now.text}
          </p>
        </div>
        <div style={{
          padding: '1.25rem', background: 'var(--bg-card)',
          border: '1px solid var(--border)', borderRadius: '12px',
        }}>
          <div style={{ color: 'var(--success)', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            {comparison.next.title}
          </div>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
            {comparison.next.text}
          </p>
        </div>
      </div>
    </div>
  )
}


export default function LinkTracker() {
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [features, setFeatures] = useState([])
  const [comparison, setComparison] = useState(null)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [s, p, f, c] = await Promise.all([
      getTrackerStats(), getLinkProducts(), getNewFeatures(), getComparison(),
    ])
    setStats(s); setProducts(p); setFeatures(f); setComparison(c)
  }

  if (!stats) return <div style={{ color: 'var(--text-dim)' }}>Loading...</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Tracker + Analytics</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>Pantau performa semua link affiliate dalam satu tempat.</p>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <StatCard label="Komisi Bulan Ini" value={formatRp(stats.komisiBulanIni)} sub="vs bulan lalu" />
        <StatCard label="EPC Rata-rata"    value={formatRp(stats.epc)}            sub="earnings per click" />
        <StatCard label="Link Aktif"       value={formatNum(stats.linkAktif)}    sub="berjalan normal" />
        <StatCard label="Link Mati"        value={formatNum(stats.linkMati)}     sub="perlu dicek" danger />
      </div>

      {/* TABLE + NEW FEATURES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
        <LinkTable products={products} />
        <NewFeaturesCard features={features} />
      </div>

      {/* COMPARISON */}
      <ComparisonCard comparison={comparison} />
    </div>
  )
}