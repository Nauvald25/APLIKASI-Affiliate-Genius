import AuthGate from './components/AuthGate'
import './globals.css'
import Sidebar from './components/Sidebar'

export const metadata = {
  title: 'Affiliate Genius AI v21',
  description: 'Ultimate Free Affiliate Toolkit',
}

export default function RootLayout({ children }) {
  return (
        <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthGate>
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <main style={{ flex: 1, padding: '2rem 2.5rem', overflow: 'auto', minWidth: 0 }}>
              {children}
            </main>
          </div>
        </AuthGate>
      </body>
    </html>
  )
}