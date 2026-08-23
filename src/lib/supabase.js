import { createClient } from '@supabase/supabase-js'

// El panel de Supabase muestra varias URLs. La que necesita el cliente es la
// BASE del proyecto (https://xxxx.supabase.co), no el endpoint REST. Como es
// un fallo fácil de cometer, limpiamos la barra final y el `/rest/v1` por si
// se ha pegado esa otra.
const limpiarUrl = (valor = '') =>
  valor
    .trim()
    .replace(/\/+$/, '')
    .replace(/\/rest\/v1$/, '')
    .replace(/\/+$/, '')

// Un valor sigue siendo el de ejemplo si está vacío, lleva las equis del
// fichero .env.example o acaba en puntos suspensivos.
const esMarcador = (valor) =>
  !valor || valor.includes('xxxxxxxx') || valor.trim().endsWith('...')

const url = limpiarUrl(import.meta.env.VITE_SUPABASE_URL)
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

// Si no hay credenciales (o siguen siendo las de ejemplo) la app arranca igual
// en "modo local": todo se guarda en el navegador. Así podéis probarla sin
// configurar nada y migrar a Supabase cuando queráis.
export const isSupabaseEnabled = !esMarcador(url) && !esMarcador(anonKey)

export const supabase = isSupabaseEnabled
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null

export const BUCKET = 'recuerdos'
