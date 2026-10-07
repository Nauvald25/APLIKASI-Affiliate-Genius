'use client'
import { useEffect, useState } from 'react'
import { getAbTests, conversionRate } from '@/lib/ab-testing-data'

function VariantRow({ variant, isWinner }) {
  const rate = parseFloat(conversionRate(variant.visitors, variant.conversions))
  return (
    <div style={{
      padding: '1rem', borderRadius: '8px',
      background: isWinner ? 'rgba(16,185,129,0.08)' : 'var(--bg-hover)',
      border: isWinner ? '1px solid var(--success)' : '1px solid var(--border)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexWrap: 'wrap', gap: '0.75rem',
    }}>
      <div>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Variant {variant.variant} {isWinner && '🏆'}
        </div>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
          👁️ {variant.visitors} visitor · 💰 {variant.conversions} conversion
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: '1.25rem', fontWeight: 800,
            color: rate >= 5 ? 'var(--success)' : rate >= 3 ? 'var(--warning)' : 'var(--danger)',
          }}>{rate}%</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dimmer)', textTransform: 'uppercase' }}>CR</div>
        </div>
      </div>
    </div>
  )
}

export default function ABTesting() {
  const [tests, setTests] = useState([])

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const t = await getAbTests()
    setTests(t)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>A/B Landing Test</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>
          Uji varian landing page — mana konversi terbaik?
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1rem' }}>
        {tests.map(test => {
          const best = test.variants.reduce((a, b) =>
            parseFloat(conversionRate(b.visitors, b.conversions)) >
            parseFloat(conversionRate(a.visitors, a.conversions)) ? b : a
          )
          return (
            <div key={test.name} style={{
              padding: '1.5rem', background: 'var(--bg-card)',
              borderRadius: '12px', border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>🧪 {test.name}</h3>
                <span style={{
                  padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.65rem',
                  background: 'rgba(16,185,129,0.15)', color: 'var(--success)', fontWeight: 700,
                }}>LIVE</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {test.variants.map(v => (
                  <VariantRow
                    key={v.id}
                    variant={v}
                    isWinner={test.variants.length > 1 && v.id === best.id && parseFloat(conversionRate(v.visitors, v.conversions)) > 0}
                  />
                ))}
              </div>
              <div style={{
                marginTop: '1rem', padding: '0.75rem 1rem',
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: '8px',
                fontSize: '0.75rem', color: 'var(--text-dim)',
              }}>
                💡 <strong>Variant {best.variant}</strong> unggul dengan CR{' '}
                <strong style={{ color: 'var(--primary)' }}>
                  {conversionRate(best.visitors, best.conversions)}%
                </strong>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{
        padding: '1rem 1.5rem', background: 'var(--bg-card)',
        borderRadius: '12px', border: '1px solid var(--border)',
        fontSize: '0.8rem', color: 'var(--text-dim)',
      }}>
        💡 <strong>Upgrade nanti:</strong> Setiap visitor & conversion akan dicatat otomatis via API,
        dan varian pemenang bisa dipilih otomatis (auto-pick winner).
      </div>
    </div>
  )
}