import { useCallback, useEffect, useState } from 'react'
import RouletteView from './components/RouletteView'
import SavedPlans from './components/SavedPlans'
import Gallery from './components/Gallery'
import Auth from './components/Auth'
import HowItWorks from './components/HowItWorks'
import ConfigMissing from './components/ConfigMissing'
import { supabase, isSupabaseEnabled } from './lib/supabase'
import { mensajeDeError } from './lib/errors'
import {
  listPlans,
  listMemories,
  acceptPlan,
  completePlan,
  deletePlan,
  deleteMemory,
} from './lib/store'

const TABS = [
  { id: 'ruleta', label: 'Ruleta', emoji: '🎡' },
  { id: 'planes', label: 'Planes', emoji: '📌' },
  { id: 'recuerdos', label: 'Recuerdos', emoji: '📷' },
]

function Toast({ toast }) {
  if (!toast) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 sm:bottom-8">
      <div className="animate-pop rounded-full bg-ink px-5 py-3 text-sm text-cream shadow-soft">
        {toast}
      </div>
    </div>
  )
}

export default function App() {
  const [session, setSession] = useState(undefined)
  const [tab, setTab] = useState('ruleta')
  const [plans, setPlans] = useState([])
  const [memories, setMemories] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  const avisar = useCallback((texto) => {
    setToast(texto)
    setTimeout(() => setToast(null), 2600)
  }, [])

  // --- sesión --------------------------------------------------------------
  useEffect(() => {
    if (!isSupabaseEnabled) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s ?? null))
    return () => sub.subscription.unsubscribe()
  }, [])

  // --- datos ---------------------------------------------------------------
  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const [p, m] = await Promise.all([listPlans(), listMemories()])
      setPlans(p)
      setMemories(m)
      setError(null)
    } catch (err) {
      setError(mensajeDeError(err))
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseEnabled) return
    if (!session) {
      setCargando(false)
      return
    }
    cargar()
  }, [session, cargar])

  // --- acciones ------------------------------------------------------------
  async function handleAccept(idea) {
    try {
      await acceptPlan(idea)
      await cargar()
      avisar('¡Plan guardado! Lo tenéis en «Planes».')
    } catch (err) {
      setError(mensajeDeError(err))
      avisar('No se ha podido guardar el plan.')
    }
  }

  async function handleComplete(planId, payload) {
    await completePlan(planId, payload)
    await cargar()
    setTab('recuerdos')
    avisar('Recuerdo guardado en el álbum 💛')
  }

  async function handleDeletePlan(plan) {
    try {
      await deletePlan(plan.id)
      await cargar()
      avisar('Plan eliminado.')
    } catch (err) {
      setError(mensajeDeError(err))
      avisar('No se ha podido eliminar el plan.')
    }
  }

  async function handleDeleteMemory(memory) {
    try {
      await deleteMemory(memory)
      await cargar()
      avisar('Recuerdo eliminado.')
    } catch (err) {
      setError(mensajeDeError(err))
      avisar('No se ha podido eliminar el recuerdo.')
    }
  }

  // --- render --------------------------------------------------------------
  // Sin credenciales no se arranca: antes caía en "modo local" y era fácil
  // creer que estaba guardando cuando no lo hacía.
  if (!isSupabaseEnabled) return <ConfigMissing />

  if (session === undefined) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <p className="animate-pulse text-sm text-muted">Cargando…</p>
      </div>
    )
  }

  if (!session) return <Auth />

  const pendientes = plans.filter((p) => p.status === 'pendiente').length

  return (
    <div className="min-h-[100dvh] pb-24 sm:pb-10">
      {/* Cabecera */}
      <header className="sticky top-0 z-30 border-b border-ink/5 bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <button
            onClick={() => setTab('ruleta')}
            className="flex items-center gap-2 text-left"
          >
            <span className="text-xl">🎡</span>
            <span className="font-display text-base font-semibold">Nuestra ruleta</span>
          </button>

          {/* Navegación de escritorio */}
          <nav className="hidden gap-1 sm:flex">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${
                  tab === t.id ? 'bg-ink text-cream' : 'text-muted hover:bg-sand hover:text-ink'
                }`}
              >
                {t.label}
                {t.id === 'planes' && pendientes > 0 && (
                  <span
                    className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                      tab === t.id ? 'bg-cream/20' : 'bg-terracota/15 text-terracota'
                    }`}
                  >
                    {pendientes}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('ayuda')}
              aria-label="Cómo funciona la aplicación"
              title="¿Cómo funciona?"
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition ${
                tab === 'ayuda'
                  ? 'bg-ink text-cream'
                  : 'bg-sand/70 text-muted hover:bg-sand hover:text-ink'
              }`}
            >
              ?
            </button>

            <button
              onClick={() => supabase.auth.signOut()}
              className="text-xs text-muted underline underline-offset-4 hover:text-ink"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        {error && (
          <div className="card mb-6 border-terracota/20 bg-terracota/5 p-4 text-sm text-terracota">
            {error}
            <button onClick={cargar} className="ml-2 underline underline-offset-2">
              Reintentar
            </button>
          </div>
        )}

        {cargando ? (
          <p className="py-20 text-center text-sm text-muted">Cargando…</p>
        ) : (
          <>
            {tab === 'ruleta' && (
              <RouletteView
                plans={plans}
                onAccept={handleAccept}
                onGoToPlans={() => setTab('planes')}
              />
            )}
            {tab === 'planes' && (
              <SavedPlans
                plans={plans}
                onCompletePlan={handleComplete}
                onDeletePlan={handleDeletePlan}
                onGoToWheel={() => setTab('ruleta')}
              />
            )}
            {tab === 'recuerdos' && (
              <Gallery
                memories={memories}
                onDeleteMemory={handleDeleteMemory}
                onGoToWheel={() => setTab('ruleta')}
              />
            )}
            {tab === 'ayuda' && <HowItWorks onGoToWheel={() => setTab('ruleta')} />}
          </>
        )}
      </main>

      {/* Navegación móvil */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/5 bg-cream/95 backdrop-blur-md sm:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative flex flex-1 flex-col items-center gap-0.5 py-3 text-[11px] font-medium transition ${
                tab === t.id ? 'text-terracota' : 'text-muted'
              }`}
            >
              <span className="text-lg leading-none">{t.emoji}</span>
              {t.label}
              {t.id === 'planes' && pendientes > 0 && (
                <span className="absolute right-[22%] top-1.5 h-2 w-2 rounded-full bg-terracota" />
              )}
            </button>
          ))}
        </div>
      </nav>

      <Toast toast={toast} />
    </div>
  )
}
