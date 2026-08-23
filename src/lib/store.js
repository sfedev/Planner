// ---------------------------------------------------------------------------
// Capa de datos. Todo vive en Supabase: base de datos para los planes y los
// recuerdos, y Storage (bucket privado) para las fotos.
//
// La app no tiene modo sin conexión ni almacenamiento en el navegador: si
// faltan las credenciales, App.jsx muestra la pantalla de configuración en
// lugar de arrancar a medias.
// ---------------------------------------------------------------------------

import { supabase, BUCKET } from './supabase'
import { compressImage } from './images'

const uid = () =>
  crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random())

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
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .order('accepted_at', { ascending: false })
  if (error) throw error
  return data
}

export async function acceptPlan(idea) {
  const { data: userData } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('plans')
    .insert({ ...planRowFromIdea(idea), created_by: userData?.user?.id ?? null })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePlan(planId) {
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
//  IDEAS — planes añadidos por vosotros desde la app
// ===========================================================================

// Etiqueta corta para el quesito de la ruleta: cortamos por la última
// palabra que quepa en 14 caracteres.
export function etiquetaCorta(titulo = '') {
  const limpio = titulo.trim()
  if (limpio.length <= 14) return limpio
  const corte = limpio.slice(0, 14)
  const espacio = corte.lastIndexOf(' ')
  return (espacio > 5 ? corte.slice(0, espacio) : corte).trim()
}

// Convierte una fila de `ideas` a la misma forma que los planes del catálogo,
// para que la ruleta no tenga que distinguirlos.
export function ideaDesdeFila(fila) {
  return {
    id: `custom:${fila.id}`,
    short: fila.short,
    title: fila.title,
    category: fila.category,
    emoji: fila.emoji,
    budget: fila.budget,
    driveTime: null,
    description: fila.description || 'Plan añadido por vosotros.',
    tips: [],
    glutenFree: null,
    propio: true,
    filaId: fila.id,
  }
}

export async function listIdeas() {
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(ideaDesdeFila)
}

export async function addIdea({ title, category, emoji, budget, description }) {
  const { data: userData } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('ideas')
    .insert({
      title: title.trim(),
      short: etiquetaCorta(title),
      category,
      emoji,
      budget,
      description: description?.trim() || null,
      created_by: userData?.user?.id ?? null,
    })
    .select()
    .single()
  if (error) throw error
  return ideaDesdeFila(data)
}

export async function deleteIdea(filaId) {
  const { error } = await supabase.from('ideas').delete().eq('id', filaId)
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
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData?.user?.id ?? 'anon'
  const total = files.length
  const photos = []

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
  const { data, error } = await supabase
    .from('memories')
    .select('*, plan:plans(*)')
    .order('happened_on', { ascending: false })
  if (error) throw error
  return data
}

export async function deleteMemory(memory) {
  if (memory.photos?.length) await supabase.storage.from(BUCKET).remove(memory.photos)
  const { error } = await supabase.from('memories').delete().eq('id', memory.id)
  if (error) throw error
  // El trigger de la base de datos devuelve el plan a "pendiente".
}

// ===========================================================================
//  FOTOS -> URLs mostrables (enlaces firmados, el bucket es privado)
// ===========================================================================

const urlCache = new Map()

export async function resolvePhotoUrls(paths = []) {
  if (!paths.length) return []

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
