import { safeQuery, supabase } from './supabase'

export async function getOfflineStatus() {
  return {
    online: typeof navigator === 'undefined' ? true : navigator.onLine,
    lastSync: null,
    queueCount: 0,
  }
}

export async function getQueueItems() { return [] }