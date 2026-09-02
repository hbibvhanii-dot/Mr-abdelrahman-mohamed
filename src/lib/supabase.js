import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

let platformSaveQueue = Promise.resolve()

export function canUseSupabase() {
  return Boolean(supabase)
}

export async function loadPlatformFromSupabase() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('platform_data')
    .select('payload')
    .eq('id', 'main')
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    console.error('Supabase load failed:', error)
    return null
  }

  if (!data?.payload) return null

  try {
    return typeof data.payload === 'string' ? JSON.parse(data.payload) : data.payload
  } catch (error) {
    console.error('Supabase payload parse failed:', error)
    return null
  }
}

export async function savePlatformToSupabase(platform) {
  if (!supabase) return false

  const saveRequest = platformSaveQueue.then(async () => {
    const { error } = await supabase
      .from('platform_data')
      .upsert(
        { id: 'main', payload: platform },
        { onConflict: 'id' },
      )

    if (error) {
      console.error('Supabase save failed:', error)
      return false
    }

    return true
  })

  platformSaveQueue = saveRequest.catch(() => undefined)
  return saveRequest
}
