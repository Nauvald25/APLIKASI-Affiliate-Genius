'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [register, setRegister] = useState(false)
  const [message, setMessage] = useState('')
  async function submit(e) {
    e.preventDefault()
    if (!supabase) return setMessage('Isi environment Supabase terlebih dahulu.')
    const result = register
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })
    if (result.error) return setMessage(result.error.message)
    if (register && !result.data.session) return setMessage('Cek email untuk verifikasi akun.')
    router.replace('/dashboard')
  }
  return <main style={{ maxWidth: 420, margin: '5rem auto', padding: '2rem', background: 'var(--bg-card)', borderRadius: 12 }}>
    <h1>{register ? 'Buat akun' : 'Login'}</h1>
    <p style={{ color: 'var(--text-dim)' }}>Satu akun = satu workspace. Data customer terisolasi.</p>
    <form onSubmit={submit} style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
      <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input required minLength={6} type="password" placeholder="Password minimal 6 karakter" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">{register ? 'Daftar' : 'Masuk'}</button>
    </form>
    {message && <p>{message}</p>}
    <button type="button" onClick={() => setRegister(!register)} style={{ marginTop: '1rem' }}>{register ? 'Sudah punya akun? Login' : 'Buat akun baru'}</button>
  </main>
}
