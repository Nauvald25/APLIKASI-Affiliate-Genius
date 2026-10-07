'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthGate({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function checkSession() {
      if (pathname === '/login' || !supabase) {
        if (!cancelled) setReady(true)
        return
      }
      const { data, error } = await supabase.auth.getUser()
      if (cancelled) return
      if (error || !data?.user) {
        router.replace('/login')
        return
      }
      setReady(true)
    }

    setReady(false)
    checkSession()
    return () => { cancelled = true }
  }, [pathname, router])

  if (!ready) return <div style={{ padding: '2rem' }}>Memeriksa sesi...</div>
  return <>{children}</>
}
