'use client'
import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export function useRealtimeTable(table, loader) {
  const [data, setData] = useState([])

  useEffect(() => {
    let active = true
    const refresh = async () => {
      try {
        const next = await loader()
        if (active) setData(next || [])
      } catch (error) {
        console.error(`Realtime loader ${table}:`, error.message)
      }
    }
    refresh()
    if (!supabase) return () => { active = false }

    const channel = supabase
      .channel(`${table}-changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, refresh)
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [table, loader])

  return data
}