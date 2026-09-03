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
    throw new Error(`Supabase load failed: ${error.message}`)
  }

  if (!data?.payload) return null

  try {
    return typeof data.payload === 'string' ? JSON.parse(data.payload) : data.payload
  } catch (error) {
    throw new Error(`Supabase payload parse failed: ${error.message}`)
  }
}

export async function savePlatformToSupabase(platform) {
  if (!supabase) return false

  const saveRequest = platformSaveQueue.then(async () => {
    const { data, error } = await supabase
      .from('platform_data')
      .upsert(
        { id: 'main', payload: platform },
        { onConflict: 'id' },
      )
      .select('id')
      .single()

    if (error) {
      throw new Error(`Supabase save failed: ${error.message}`)
    }
    if (data?.id !== 'main') {
      throw new Error('Supabase save was not confirmed.')
    }

    return true
  })

  platformSaveQueue = saveRequest.catch(() => undefined)
  return saveRequest
}

export async function createPaymentCheckout({ studentCode, planId, paymentMethod, customer }) {
  if (!supabase) {
    throw new Error('Supabase is not configured for online payments.')
  }

  const { data, error } = await supabase.functions.invoke('create-payment', {
    body: {
      code: studentCode,
      plan_slug: planId,
      payment_method: paymentMethod,
      idempotency_key: `${studentCode}:${planId}`,
      customer,
    },
  })

  if (error) throw new Error(`Payment checkout failed: ${error.message}`)
  const checkoutUrl = data?.checkout_url || data?.checkoutUrl
  if (!checkoutUrl) throw new Error('Payment provider did not return a checkout URL.')
  return checkoutUrl
}

export async function authenticateStudentCode(code) {
  if (!supabase) return null
  const { data, error } = await supabase.rpc('authenticate_student_code', {
    input_code: code,
  })
  if (error) throw new Error(`Student authentication failed: ${error.message}`)
  return data?.[0] || null
}
