

Write-Host "🚀 Memulai setup Affiliate Genius AI v21..." -ForegroundColor Cyan


Write-Host "`n📁 Membuat folder..." -ForegroundColor Yellow
$folders = @(
  "app\dashboard",
  "app\components",
  "app\lib",
  "app\api\ai\generate",
  "app\api\track"
)
foreach ($f in $folders) {
  if (!(Test-Path $f)) {
    New-Item -ItemType Directory -Path $f -Force | Out-Null
    Write-Host "  ✓ $f"
  }
}

Write-Host "`n📝 Membuat globals.css..." -ForegroundColor Yellow

$globalsCss = @'
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0a0f1e;
  --bg-card: #111827;
  --bg-hover: #1a2332;
  --border: #1e293b;
  --border-hover: #334155;
  --text: #f1f5f9;
  --text-dim: #94a3b8;
  --text-dimmer: #64748b;
  --primary: #6366f1;
  --primary-hover: #4f46e5;
  --success: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
  --cyan: #06b6d4;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none; }
button { font-family: inherit; cursor: pointer; }
input, select, textarea { font-family: inherit; }

::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border-hover); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-dimmer); }
'@
Set-Content -Path "app\globals.css" -Value $globalsCss -Encoding UTF8
Write-Host "  ✓ app\globals.css"


Write-Host "`n📝 Membuat layout.js..." -ForegroundColor Yellow

$layoutJs = @'
import './globals.css'
import Sidebar from './components/Sidebar'

export const metadata = {
  title: 'Affiliate Genius AI v21',
  description: 'Ultimate Free Affiliate Toolkit',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main style={{ flex: 1, padding: '2rem 2.5rem', overflow: 'auto', minWidth: 0 }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
'@
Set-Content -Path "app\layout.js" -Value $layoutJs -Encoding UTF8
Write-Host "  ✓ app\layout.js"


Write-Host "`n📝 Membuat Sidebar.js..." -ForegroundColor Yellow

$sidebarJs = @'
'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const menu = [
  { section: 'OVERVIEW', items: [
    { label: 'Dashboard', icon: '▦', path: '/dashboard' },
  ]},
  { section: 'KONTEN', items: [
    { label: 'Content Planner', icon: '▤', path: '/planner' },
    { label: 'Image Generator', icon: '▣', path: '/image-generator' },
    { label: 'Memory AI', icon: '◐', path: '/memory-ai' },
  ]},
  { section: 'KONVERSI', items: [
    { label: 'Link Tracker', icon: '∞', path: '/link-tracker' },
    { label: 'Mini Store', icon: '▥', path: '/mini-store' },
    { label: 'A/B Testing', icon: '⚗', path: '/ab-testing' },
  ]},
  { section: 'SISTEM', items: [
    { label: 'Offline Mode', icon: '✈', path: '/offline' },
  ]},
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      width: '240px',
      background: '#060a14',
      borderRight: '1px solid var(--border)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
      flexShrink: 0,
    }}>
      <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.25rem 0.5rem' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem', fontWeight: 800, color: '#fff'
        }}>⚡</div>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>
          Affiliate<br />Genius AI
        </div>
      </Link>

      {menu.map(section => (
        <div key={section.section}>
          <div style={{
            fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-dimmer)',
            letterSpacing: '0.1em', padding: '0 0.75rem', marginBottom: '0.5rem'
          }}>{section.section}</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {section.items.map(item => {
              const active = pathname === item.path
              return (
                <Link key={item.path} href={item.path} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: active ? 600 : 500,
                  color: active ? '#fff' : 'var(--text-dim)',
                  background: active ? 'var(--bg-hover)' : 'transparent',
                  borderLeft: active ? '2px solid var(--primary)' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}>
                  <span style={{ fontSize: '1rem', width: '18px' }}>{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      ))}

      <div style={{ marginTop: 'auto', padding: '0.75rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dimmer)', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>EDITION</div>
        <div style={{
          display: 'inline-block', padding: '0.25rem 0.6rem', borderRadius: '999px',
          background: 'rgba(16,185,129,0.15)', color: 'var(--success)',
          fontSize: '0.7rem', fontWeight: 600
        }}>Free · no billing</div>
      </div>
    </aside>
  )
}
'@
Set-Content -Path "app\components\Sidebar.js" -Value $sidebarJs -Encoding UTF8
Write-Host "  ✓ app\components\Sidebar.js"

Write-Host "`n✅ SETUP TAHAP 1 SELESAI!" -ForegroundColor Green
Write-Host "`n📌 Langkah selanjutnya:" -ForegroundColor Cyan
Write-Host "  1. Jalankan: npm run dev"
Write-Host "  2. Buka: http://localhost:3000/link-tracker"
Write-Host "  3. Harus muncul SIDEBAR di kiri layar"
Write-Host "`n🚀 Setelah berhasil, minta TAHAP 2 (Dashboard v21)" -ForegroundColor Green