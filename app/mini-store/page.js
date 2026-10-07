'use client'
import { useEffect, useState } from 'react'
import {
  getStoreProfile, getStoreLinks, getStoreFeatures, saveStoreProfile,
} from '@/lib/mini-store-data'

const saveButton = { marginTop: '1rem', padding: '0.7rem 1.25rem', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }


function PhonePreview({ profile, links }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '24px',
      border: '1px solid var(--border)',
      padding: '1.25rem',
      maxWidth: '320px',
      margin: '0 auto',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    }}>
      {/* Status bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: '0.65rem', color: 'var(--text-dimmer)',
        marginBottom: '0.75rem', padding: '0 0.25rem',
      }}>
        <span>9:41</span>
        <span>▮▮▮ ⚡</span>
      </div>

      {/* Avatar */}
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #22d3ee, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 0.75rem',
          fontSize: '2rem',
        }}>{profile.avatar}</div>
        <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.25rem' }}>
          {profile.title}
        </div>
        <div style={{
          fontSize: '0.75rem', color: 'var(--text-dim)',
          padding: '0 1rem', lineHeight: 1.4, marginBottom: '0.5rem',
        }}>{profile.bio}</div>
        <div style={{
          display: 'inline-block',
          padding: '0.2rem 0.6rem',
          borderRadius: '999px',
          fontSize: '0.65rem',
          background: 'rgba(16,185,129,0.15)',
          color: 'var(--success)',
          fontWeight: 600,
        }}>{(profile.visitors / 1000).toFixed(1)}rb kunjungan</div>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map(l => (
          <a
            key={l.id}
            href={l.url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.75rem 0.875rem',
              background: 'var(--bg-hover)',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              fontSize: '0.78rem',
              fontWeight: 600,
              position: 'relative',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{l.icon}</span>
            <span style={{ flex: 1, textAlign: 'left' }}>{l.title}</span>
            {l.badge && (
              <span style={{
                padding: '0.1rem 0.4rem',
                borderRadius: '4px',
                fontSize: '0.6rem',
                background: l.badge === 'DISKON' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)',
                color: l.badge === 'DISKON' ? 'var(--danger)' : 'var(--success)',
                fontWeight: 700,
              }}>{l.badge}</span>
            )}
          </a>
        ))}
      </div>

      {/* CTA */}
      <button style={{
        width: '100%', marginTop: '0.75rem',
        padding: '0.75rem', borderRadius: '10px',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        border: 'none', color: '#fff',
        fontWeight: 700, fontSize: '0.85rem',
      }}>🛒 Lihat Semua Produk</button>
    </div>
  )
}

function ProfileForm({ profile, onChange, onSave, saving }) {
  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: '12px',
      border: '1px solid var(--border)', padding: '1.5rem',
    }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem' }}>Pengaturan Halaman</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        <Field label="Slug publik" value={profile.slug} prefix="agi.id/" onChange={v => onChange({ ...profile, slug: v })} />
        <Field label="Nama toko"   value={profile.title} onChange={v => onChange({ ...profile, title: v })} />
        <Field label="Bio"         value={profile.bio} onChange={v => onChange({ ...profile, bio: v })} multiline />
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dimmer)', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tema
          </label>
          <select
            value={profile.theme}
            onChange={e => onChange({ ...profile, theme: e.target.value })}
            style={{
              width: '100%', padding: '0.65rem 0.75rem',
              background: 'var(--bg-hover)', color: 'var(--text)',
              border: '1px solid var(--border)', borderRadius: '8px',
              fontSize: '0.85rem',
            }}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="gradient">Gradient</option>
          </select>
        </div>
      </div>
      <button type="button" onClick={onSave} disabled={saving} style={saveButton}>
        {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
      </button>
    </div>
  )
}

function Field({ label, value, onChange, prefix, multiline }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: '0.75rem', color: 'var(--text-dimmer)',
        fontWeight: 600, marginBottom: '0.4rem',
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {prefix && (
          <span style={{
            padding: '0.65rem 0.5rem',
            background: 'var(--bg)', border: '1px solid var(--border)',
            borderRight: 'none', borderRadius: '8px 0 0 8px',
            color: 'var(--text-dimmer)', fontSize: '0.8rem',
          }}>{prefix}</span>
        )}
        {multiline ? (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={2}
            style={{
              flex: 1, padding: '0.65rem 0.75rem',
              background: 'var(--bg-hover)', color: 'var(--text)',
              border: '1px solid var(--border)', borderRadius: prefix ? '0 8px 8px 0' : '8px',
              fontSize: '0.85rem', resize: 'vertical', fontFamily: 'inherit',
            }}
          />
        ) : (
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            style={{
              flex: 1, padding: '0.65rem 0.75rem',
              background: 'var(--bg-hover)', color: 'var(--text)',
              border: '1px solid var(--border)', borderRadius: prefix ? '0 8px 8px 0' : '8px',
              fontSize: '0.85rem',
            }}
          />
        )}
      </div>
    </div>
  )
}

function FeaturesList({ features }) {
  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: '12px',
      border: '1px solid var(--border)', padding: '1.5rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Mini Store 2.0</h3>
        <span style={{
          padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.65rem',
          background: 'linear-gradient(135deg, #f97316, #ef4444)',
          color: '#fff', fontWeight: 700,
        }}>UPGRADE</span>
      </div>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '1rem' }}>
        Halaman publik <code style={{ color: 'var(--primary)' }}>agi.id/glowskin</code> yang bisa dibuka semua orang, dengan analitik klik per tombol.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {features.map((f, i) => (
          <div key={i} style={{
            padding: '0.65rem 0.875rem',
            background: 'var(--bg-hover)',
            borderLeft: '3px solid var(--primary)',
            borderRadius: '6px',
            fontSize: '0.78rem',
          }}>
            <div style={{ fontWeight: 700, marginBottom: '0.15rem' }}>
              <span style={{ marginRight: '0.4rem' }}>{f.icon}</span>
              {f.title}
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}


export default function MiniStore() {
  const [profile, setProfile] = useState(null)
  const [links, setLinks] = useState([])
  const [features, setFeatures] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [p, l, f] = await Promise.all([
      getStoreProfile(), getStoreLinks(), getStoreFeatures(),
    ])
    setProfile(p); setLinks(l); setFeatures(f)
  }

  async function saveProfile() {
    setSaving(true)
    try {
      setProfile(await saveStoreProfile(profile))
      alert('Pengaturan mini-store tersimpan.')
    } catch (error) {
      alert(`Gagal menyimpan: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (!profile) return <div style={{ color: 'var(--text-dim)' }}>Loading...</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Mini Store 2.0</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>
          Halaman Linktree-style untuk affiliate kamu.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ProfileForm profile={profile} onChange={setProfile} onSave={saveProfile} saving={saving} />
          <FeaturesList features={features} />
        </div>
        <div>
          <div style={{
            fontSize: '0.75rem', color: 'var(--text-dimmer)',
            textAlign: 'center', marginBottom: '0.75rem',
            textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600,
          }}>Preview</div>
          <PhonePreview profile={profile} links={links} />
        </div>
      </div>
    </div>
  )
}