// ---------------------------------------------------------------------------
// Capa de datos. Expone la MISMA API tanto si hay Supabase configurado
// (modo nube, sincronizado entre los dos móviles) como si no (modo local,
// guardado en este navegador). Los componentes no saben cuál está activo.
// ---------------------------------------------------------------------------

import { supabase, isSupabaseEnabled, BUCKET } from './supabase'
import { putBlob, getBlob, delBlob } from './idb'
import { compressImage } from './images'

export const MODE = isSupabaseEnabled ? 'nube' : 'local'

const LS_PLANS = 'ruleta:plans'
const LS_MEMORIES = 'ruleta:memories'

const uid = () =>
  crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random())

const read = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value))

// --- conversión catálogo -> fila de la tabla `plans` -----------------------
function planRowFromIdea(idea) {
  return {
    idea_id: idea.id,
    title: idea.title,
    category: idea.category,
    emoji: idea.emoji,
    description: idea.description,
    tips: idea.tips ?? [],
    budget: idea.budget,
    drive_time: idea.driveTime ?? null,
    gluten_free: idea.glutenFree ?? null,
    status: 'pendiente',
  }
}

// ===========================================================================
//  PLANES
// ===========================================================================

export async function listPlans() {
  if (!isSupabaseEnabled) {
    return read(LS_PLANS).sort(
      (a, b) => new Date(b.accepted_at) - new Date(a.accepted_at)
    )
  }
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .order('accepted_at', { ascending: false })
  if (error) throw error
  return data
}

export async function acceptPlan(idea) {
  const row = planRowFromIdea(idea)

  if (!isSupabaseEnabled) {
    const plan = { ...row, id: uid(), accepted_at: new Date().toISOString(), completed_at: null }
    write(LS_PLANS, [plan, ...read(LS_PLANS)])
    return plan
  }

  const { data: userData } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('plans')
    .insert({ ...row, created_by: userData?.user?.id ?? null })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePlan(planId) {
  if (!isSupabaseEnabled) {
    const memories = read(LS_MEMORIES).filter((m) => m.plan_id === planId)
    await Promise.all(memories.flatMap((m) => m.photos.map((p) => delBlob(p).catch(() => {}))))
    write(LS_MEMORIES, read(LS_MEMORIES).filter((m) => m.plan_id !== planId))
    write(LS_PLANS, read(LS_PLANS).filter((p) => p.id !== planId))
    return
  }

  // Borramos primero las fotos del Storage; las filas caen por ON DELETE CASCADE.
  const { data: memories } = await supabase
    .from('memories')
    .select('photos')
    .eq('plan_id', planId)
  const paths = (memories ?? []).flatMap((m) => m.photos ?? [])
  if (paths.length) await supabase.storage.from(BUCKET).remove(paths)

  const { error } = await supabase.from('plans').delete().eq('id', planId)
  if (error) throw error
}

// ===========================================================================
//  RECUERDOS (completar plan + fotos)
// ===========================================================================

/**
 * Marca el plan como completado y crea su recuerdo.
 * @param {string} planId
 * @param {{happenedOn: string, note: string, files: File[], onProgress?: (n:number,total:number)=>void}} payload
 */
export async function completePlan(planId, { happenedOn, note, files = [], onProgress }) {
  const total = files.length
  const photos = []

  if (!isSupabaseEnabled) {
    for (let i = 0; i < files.length; i++) {
      const blob = await compressImage(files[i])
      const key = `local/${planId}/${uid()}.jpg`
      await putBlob(key, blob)
      photos.push(key)
      onProgress?.(i + 1, total)
    }

    const memory = {
      id: uid(),
      plan_id: planId,
      happened_on: happenedOn,
      note,
      photos,
      created_at: new Date().toISOString(),
    }
    write(LS_MEMORIES, [memory, ...read(LS_MEMORIES)])
    write(
      LS_PLANS,
      read(LS_PLANS).map((p) =>
        p.id === planId
          ? { ...p, status: 'completado', completed_at: new Date().toISOString() }
          : p
      )
    )
    return memory
  }

  const { data: userData } = await supabase.auth.getUser()
  const userId = userData?.user?.id ?? 'anon'

  for (let i = 0; i < files.length; i++) {
    const blob = await compressImage(files[i])
    const ext = (blob.type === 'image/jpeg' ? 'jpg' : files[i].name.split('.').pop()) || 'jpg'
    const path = `${userId}/${planId}/${uid()}.${ext}`
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { contentType: blob.type || 'image/jpeg', upsert: false })
    if (upErr) throw upErr
    photos.push(path)
    onProgress?.(i + 1, total)
  }

  const { data: memory, error } = await supabase
    .from('memories')
    .insert({
      plan_id: planId,
      happened_on: happenedOn,
      note,
      photos,
      created_by: userData?.user?.id ?? null,
    })
    .select()
    .single()
  if (error) throw error

  const { error: updErr } = await supabase
    .from('plans')
    .update({ status: 'completado', completed_at: new Date().toISOString() })
    .eq('id', planId)
  if (updErr) throw updErr

  return memory
}

export async function listMemories() {
  if (!isSupabaseEnabled) {
    const plans = Object.fromEntries(read(LS_PLANS).map((p) => [p.id, p]))
    return read(LS_MEMORIES)
      .map((m) => ({ ...m, plan: plans[m.plan_id] ?? null }))
      .sort((a, b) => (a.happened_on < b.happened_on ? 1 : -1))
  }

  const { data, error } = await supabase
    .from('memories')
    .select('*, plan:plans(*)')
    .order('happened_on', { ascending: false })
  if (error) throw error
  return data
}

export async function deleteMemory(memory) {
  if (!isSupabaseEnabled) {
    await Promise.all((memory.photos ?? []).map((p) => delBlob(p).catch(() => {})))
    write(LS_MEMORIES, read(LS_MEMORIES).filter((m) => m.id !== memory.id))
    const quedan = read(LS_MEMORIES).some((m) => m.plan_id === memory.plan_id)
    if (!quedan) {
      write(
        LS_PLANS,
        read(LS_PLANS).map((p) =>
          p.id === memory.plan_id ? { ...p, status: 'pendiente', completed_at: null } : p
        )
      )
    }
    return
  }

  if (memory.photos?.length) await supabase.storage.from(BUCKET).remove(memory.photos)
  const { error } = await supabase.from('memories').delete().eq('id', memory.id)
  if (error) throw error
  // El trigger de la base de datos devuelve el plan a "pendiente".
}

// ===========================================================================
//  FOTOS -> URLs mostrables
// ===========================================================================

const urlCache = new Map()

export async function resolvePhotoUrls(paths = []) {
  if (!paths.length) return []

  if (!isSupabaseEnabled) {
    return Promise.all(
      paths.map(async (p) => {
        if (urlCache.has(p)) return urlCache.get(p)
        const blob = await getBlob(p)
        const url = blob ? URL.createObjectURL(blob) : null
        if (url) urlCache.set(p, url)
        return url
      })
    ).then((list) => list.filter(Boolean))
  }

  const pendientes = paths.filter((p) => !urlCache.has(p))
  if (pendientes.length) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrls(pendientes, 60 * 60) // 1 hora
    if (error) throw error
    data.forEach((d) => d.signedUrl && urlCache.set(d.path, d.signedUrl))
  }
  return paths.map((p) => urlCache.get(p)).filter(Boolean)
}
