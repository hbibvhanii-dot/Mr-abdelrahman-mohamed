import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

let platformSaveQueue = Promise.resolve()
let platformDataUpdatedAt = null

export function canUseSupabase() {
  return Boolean(supabase)
}

export async function loadActivePlans() {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('plans')
    .select('id, slug, name, amount_cents, currency, duration_days, active')
    .eq('active', true)
    .order('amount_cents')

  if (error) throw new Error(`Plans load failed: ${error.message}`)

  return (data || []).map((plan) => ({
    id: plan.id,
    slug: plan.slug,
    name: plan.name,
    description: '',
    price: Number(plan.amount_cents) / 100,
    amountCents: plan.amount_cents,
    currency: plan.currency,
    durationDays: plan.duration_days,
    features: [],
    isPaid: true,
  }))
}

export async function loadPlatformFromSupabase() {
  if (!supabase) return null

  const { error: migrationError } = await supabase.rpc('migrate_platform_data', { input_payload: null })
  if (migrationError) throw new Error(`Platform data migration failed: ${migrationError.message}`)

  const { data, error } = await supabase.rpc('load_platform_payload')
  if (error) throw new Error(`Supabase load failed: ${error.message}`)

  const { data: normalizedData, error: normalizedError } = await supabase.rpc('list_platform_students')
  if (normalizedError) throw new Error(`Shared student data load failed: ${normalizedError.message}`)
  platformDataUpdatedAt = data?.updated_at || null

  const payload = data?.payload && typeof data.payload === 'object' ? data.payload : {}
  const codes = normalizedData?.codes || []
  const students = (normalizedData?.students || []).map((student) => ({
    ...student.metadata,
    ...student,
    id: student.id,
    code: codes.find((code) => code.studentId === student.id)?.code || '',
    metadata: undefined,
  }))
  return {
    ...payload,
    students,
    codes,
  }
}

function sharedPayload(platform) {
  const { students, codes, subscriptionPlans, subscriptionRequests, _platformDataUpdatedAt, ...payload } = platform
  return payload
}

export async function savePlatformToSupabase(platform) {
  if (!supabase) return false

  const saveRequest = platformSaveQueue.then(async () => {
    const { data, error } = await supabase.rpc('save_platform_payload', {
      expected_updated_at: platformDataUpdatedAt,
      next_payload: sharedPayload(platform),
    })

    if (error) {
      throw new Error(`Supabase save failed: ${error.message}`)
    }
    if (!data?.id) throw new Error('Supabase save conflict: the shared data changed on another device. Refresh and try again.')
    platformDataUpdatedAt = data.updated_at

    return true
  })

  platformSaveQueue = saveRequest.catch(() => undefined)
  return saveRequest
}

async function callManagementRpc(name, args) {
  if (!supabase) return null
  const { data, error } = await supabase.rpc(name, args)
  if (error) throw new Error(`${name} failed: ${error.message}`)
  return data
}

export async function createStudentInSupabase(student) {
  return callManagementRpc('create_platform_student', { input_data: student })
}

export async function updateStudentInSupabase(studentId, student) {
  return callManagementRpc('update_platform_student', {
    student_uuid: studentId,
    input_data: student,
  })
}

export async function deleteStudentInSupabase(studentId) {
  return callManagementRpc('delete_platform_student', { student_uuid: studentId })
}

export async function createCodeInSupabase(code, studentId = null) {
  return callManagementRpc('create_platform_code', { code_value: code, student_uuid: studentId })
}

export async function assignCodeInSupabase(codeId, studentId) {
  return callManagementRpc('assign_platform_code', { code_uuid: codeId, student_uuid: studentId })
}

export async function toggleCodeInSupabase(codeId) {
  return callManagementRpc('toggle_platform_code', { code_uuid: codeId })
}

export async function deleteCodeInSupabase(codeId) {
  return callManagementRpc('delete_platform_code', { code_uuid: codeId })
}

export async function createPaymentCheckout({ studentCode, planId, paymentMethod, customer }) {
  if (!supabase) {
    throw new Error('Supabase is not configured for online payments.')
  }

  const { data, error } = await supabase.functions.invoke('create-payment', {
    body: {
      student_code: studentCode,
      plan_id: planId,
      payment_method: paymentMethod,
      idempotency_key: `${studentCode}:${planId}:${crypto.randomUUID()}`,
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
