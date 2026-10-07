'use client'
import { useEffect, useState } from 'react'
import { getOfflineStatus, getQueueItems } from '@/lib/offline-data'

function StatusCard({ online }) {
  return (
    <div style={{
      padding: '1.25rem 1.5rem', background: 'var(--bg-card)',
      borderRadius: '12px', border: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', gap: '0.4rem',
    }}>
      <div style={{
        fontSize: '0.7rem', color: 'var(--text-dimmer)',
        textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600,
      }}>Status Koneksi</div>
      <div style={{
        fontSize: '1.5rem', fontWeight: 800, lineHeight: 1,
        display: 'flex', alignItems: 'center', gap: '0.5rem',
      }}>
        {online ? 'Online' : 'Offline'}
        <span style={{
          width: '10px', height: '10px', borderRadius: '50%',
          background: online ? 'var(--success)' : 'var(--warning)',
          boxShadow: `0 0 12px ${online ? 'var(--success)' : 'var(--warning)'}`,
        }} />
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-dimmer)' }}>
        {online ? 'Semua perubahan langsung dikirim ke Supabase.' : 'Perubahan disimpan lokal, disinkron saat online.'}
      </div>
    </div>
  )
}

function QueueStatCard({ count }) {
  return (
    <div style={{
      padding: '1.25rem 1.5rem', background: 'var(--bg-card)',
      borderRadius: '12px', border: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', gap: '0.4rem',
    }}>
      <div style={{
        fontSize: '0.7rem', color: 'var(--text-dimmer)',
        textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600,
      }}>Antrean Sinkronisasi</div>
      <div style={{
        fontSize: '1.5rem', fontWeight: 800, lineHeight: 1,
        color: count > 0 ? 'var(--warning)' : 'var(--text)',
      }}>{count}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-dimmer)' }}>
        {count > 0 ? 'Item menunggu untuk diunggah.' : 'Semua data sudah tersinkron.'}
      </div>
    </div>
  )
}

function ActionCard({ onAdd, onClear, queueCount }) {
  return (
    <div style={{
      padding: '1.25rem 1.5rem', background: 'var(--bg-card)',
      borderRadius: '12px', border: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', gap: '0.75rem',
    }}>
      <div style={{
        fontSize: '0.7rem', color: 'var(--text-dimmer)',
        textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600,
      }}>Aksi Simulasi</div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button onClick={onAdd} style={{
          padding: '0.6rem 1rem', borderRadius: '8px', border: 'none',
          background: 'var(--primary)', color: '#fff',
          fontWeight: 600, fontSize: '0.8rem',
        }}>+ Tambah ke Antrean</button>
        <button onClick={onClear} disabled={queueCount === 0} style={{
          padding: '0.6rem 1rem', borderRadius: '8px',
          border: '1px solid var(--border)', background: 'transparent',
          color: queueCount === 0 ? 'var(--text-dimmer)' : 'var(--text)',
          fontWeight: 600, fontSize: '0.8rem',
          cursor: queueCount === 0 ? 'not-allowed' : 'pointer',
        }}>Kosongkan</button>
      </div>
    </div>
  )
}

function QueueList({ items }) {
  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: '12px',
      border: '1px solid var(--border)', padding: '1.5rem',
    }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Isi Antrean</h3>
      {items.length === 0 ? (
        <p style={{ color: 'var(--text-dimmer)', fontSize: '0.85rem' }}>
          Antrean kosong. Semua data sudah tersinkron.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {items.map(item => (
            <div key={item.id} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 0.875rem',
              background: 'var(--bg-hover)',
              border: '1px solid var(--border)',
              borderRadius: '8px', fontSize: '0.82rem',
            }}>
              <span style={{
                padding: '0.15rem 0.5rem', borderRadius: '4px',
                fontSize: '0.65rem', fontWeight: 700,
                background: item.action === 'create' ? 'rgba(16,185,129,0.15)' :
                            item.action === 'update' ? 'rgba(245,158,11,0.15)' :
                            'rgba(239,68,68,0.15)',
                color: item.action === 'create' ? 'var(--success)' :
                       item.action === 'update' ? 'var(--warning)' : 'var(--danger)',
                textTransform: 'uppercase',
              }}>{item.action}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{item.label}</div>
                <div style={{ color: 'var(--text-dimmer)', fontSize: '0.72rem' }}>
                  {item.table} · {new Date(item.created).toLocaleTimeString('id-ID')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Offline() {
  const [status, setStatus] = useState(null)
  const [queue, setQueue] = useState([])

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [s, q] = await Promise.all([getOfflineStatus(), getQueueItems()])
    setStatus(s); setQueue(q)
  }

  function addToQueue() {
    const newItem = {
      id: Date.now(),
      action: ['create', 'update', 'delete'][Math.floor(Math.random() * 3)],
      table: ['affiliate_links', 'content_plans', 'store_links'][Math.floor(Math.random() * 3)],
      label: 'Perubahan baru ' + new Date().toLocaleTimeString('id-ID'),
      created: new Date().toISOString(),
    }
    setQueue([...queue, newItem])
  }

  function clearQueue() { setQueue([]) }

  if (!status) return <div style={{ color: 'var(--text-dim)' }}>Loading...</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Offline Mode</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>
            Penyimpanan lokal + antrean sinkronisasi ke cloud.
          </p>
        </div>
        <span style={{
          padding: '0.35rem 0.75rem', borderRadius: '999px',
          fontSize: '0.75rem', fontWeight: 600,
          background: status.online ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
          color: status.online ? 'var(--success)' : 'var(--warning)',
          border: `1px solid ${status.online ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
          display: 'flex', alignItems: 'center', gap: '0.4rem',
        }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: status.online ? 'var(--success)' : 'var(--warning)',
          }} />
          {status.online ? 'Online' : 'Offline'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <StatusCard online={status.online} />
        <QueueStatCard count={queue.length} />
        <ActionCard onAdd={addToQueue} onClear={clearQueue} queueCount={queue.length} />
      </div>

      <QueueList items={queue} />
    </div>
  )
}