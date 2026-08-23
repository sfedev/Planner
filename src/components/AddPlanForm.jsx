import { useEffect, useState } from 'react'
import { CATEGORIES } from '../data/plans'
import { etiquetaCorta } from '../lib/store'

const EMOJIS = ['💡', '🎬', '🍽️', '🎨', '🌳', '🏖️', '🎵', '🚗', '🏰', '🎮', '☕', '🐶']

export default function AddPlanForm({ ideas, onClose, onSubmit, onDelete }) {
  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState('casa')
  const [emoji, setEmoji] = useState('💡')
  const [presupuesto, setPresupuesto] = useState('€')
  const [descripcion, setDescripcion] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !guardando && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, guardando])

  async function enviar(e) {
    e.preventDefault()
    if (!titulo.trim()) return
    setGuardando(true)
    setError(null)
    try {
      await onSubmit({
        title: titulo,
        category: categoria,
        emoji,
        budget: presupuesto,
        description: descripcion,
      })
      setTitulo('')
      setDescripcion('')
      setEmoji('💡')
    } catch (err) {
      setError(err.message ?? 'No se ha podido guardar el plan.')
    } finally {
      setGuardando(false)
    }
  }

  const etiqueta = etiquetaCorta(titulo)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 animate-fade bg-ink/40 backdrop-blur-sm"
        onClick={() => !guardando && onClose()}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Añadir un plan"
        className="relative z-10 flex max-h-[92vh] w-full max-w-lg animate-pop flex-col
                   overflow-hidden rounded-t-3xl bg-cream shadow-soft sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink/5 px-6 pb-4 pt-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Vuestros planes
            </p>
            <h2 className="mt-1 text-xl font-semibold leading-tight">Añadir un plan</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                       bg-white/70 text-muted transition hover:bg-white hover:text-ink"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto">
          <form onSubmit={enviar} className="space-y-5 px-6 py-5">
            <div>
              <label className="label" htmlFor="titulo">
                ¿Qué plan se os ha ocurrido?
              </label>
              <input
                id="titulo"
                type="text"
                className="field"
                maxLength={70}
                placeholder="Ruta de tapas por Lavapiés"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                autoFocus
              />
              {etiqueta && (
                <p className="mt-1.5 text-xs text-muted">
                  En la ruleta aparecerá como <strong className="text-ink">{etiqueta}</strong>
                </p>
              )}
            </div>

            <div>
              <span className="label">Categoría</span>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(CATEGORIES).map((c) => {
                  const activo = categoria === c.id
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategoria(c.id)}
                      className={`rounded-xl border px-2 py-3 text-center transition ${
                        activo
                          ? 'border-transparent text-white shadow-soft'
                          : 'border-ink/10 bg-white/70 text-ink/70 hover:bg-white'
                      }`}
                      style={activo ? { backgroundColor: c.color } : undefined}
                      aria-pressed={activo}
                    >
                      <span className="block text-lg leading-none">{c.emoji}</span>
                      <span className="mt-1 block text-[11px] font-medium leading-tight">
                        {c.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-4">
              <div>
                <span className="label">Icono</span>
                <div className="flex flex-wrap gap-1.5">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEmoji(e)}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition ${
                        emoji === e
                          ? 'bg-ink/10 ring-2 ring-terracota'
                          : 'bg-white/70 hover:bg-white'
                      }`}
                      aria-label={`Icono ${e}`}
                      aria-pressed={emoji === e}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="label">Precio</span>
                <div className="flex gap-1.5">
                  {['€', '€€'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPresupuesto(p)}
                      className={`h-9 rounded-lg px-3 text-sm font-medium transition ${
                        presupuesto === p
                          ? 'bg-ink text-cream'
                          : 'bg-white/70 text-muted hover:bg-white'
                      }`}
                      aria-pressed={presupuesto === p}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="label" htmlFor="descripcion">
                Detalles <span className="normal-case tracking-normal">(opcional)</span>
              </label>
              <textarea
                id="descripcion"
                rows={3}
                className="field resize-none"
                maxLength={400}
                placeholder="Dónde, qué llevar, a qué hora… lo que queráis recordar cuando salga."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            {error && (
              <p className="rounded-xl bg-terracota/10 px-4 py-3 text-sm text-terracota">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn-accent w-full"
              disabled={guardando || !titulo.trim()}
            >
              {guardando ? 'Guardando…' : '＋ Añadir a la ruleta'}
            </button>
          </form>

          {ideas.length > 0 && (
            <div className="border-t border-ink/5 px-6 py-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
                Ya habéis añadido {ideas.length}
              </p>
              <ul className="space-y-2">
                {ideas.map((idea) => {
                  const cat = CATEGORIES[idea.category]
                  return (
                    <li
                      key={idea.id}
                      className="flex items-center gap-3 rounded-xl bg-white/70 px-3 py-2.5"
                    >
                      <span className="text-lg leading-none">{idea.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{idea.title}</p>
                        <p className="text-[11px]" style={{ color: cat.color }}>
                          {cat.emoji} {cat.short} · {idea.budget}
                        </p>
                      </div>
                      <button
                        onClick={() => onDelete(idea)}
                        className="shrink-0 rounded-full px-2 py-1 text-muted transition hover:bg-sand hover:text-terracota"
                        aria-label={`Eliminar ${idea.title}`}
                      >
                        🗑
                      </button>
                    </li>
                  )
                })}
              </ul>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                Eliminar un plan de aquí no borra los recuerdos que ya tengáis de él.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
