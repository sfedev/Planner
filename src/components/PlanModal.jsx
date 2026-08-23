import { useEffect } from 'react'
import { CATEGORIES } from '../data/plans'

function Dato({ icon, label, children }) {
  return (
    <div className="flex gap-3 rounded-xl bg-sand/60 p-3">
      <span className="text-lg leading-none">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
        <p className="text-sm leading-relaxed text-ink">{children}</p>
      </div>
    </div>
  )
}

export default function PlanModal({ plan, yaHecho, onAccept, onRetry, onClose, saving }) {
  // OJO: este componente se monta siempre en la vista de la ruleta, también
  // cuando no hay plan que enseñar. Sin la guarda de `plan`, el bloqueo de
  // scroll se quedaba aplicado de forma permanente y la rueda del ratón no
  // funcionaba en escritorio.
  useEffect(() => {
    if (!plan) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [plan, onClose])

  if (!plan) return null
  const cat = CATEGORIES[plan.category]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 animate-fade bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={plan.title}
        className="relative z-10 flex max-h-[92vh] w-full max-w-lg animate-pop flex-col
                   overflow-hidden rounded-t-3xl bg-cream shadow-soft sm:rounded-3xl"
      >
        {/* Cabecera */}
        <div
          className="relative px-6 pb-5 pt-7"
          style={{ background: `linear-gradient(160deg, ${cat.color}26, transparent)` }}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center
                       rounded-full bg-white/70 text-muted transition hover:bg-white hover:text-ink"
            aria-label="Cerrar"
          >
            ✕
          </button>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            {yaHecho ? '¡Otra vez!' : '¡Os ha tocado!'}
          </p>
          <div className="flex items-start gap-3">
            <span className="text-4xl leading-none">{plan.emoji}</span>
            <h2 className="pr-8 text-2xl font-semibold leading-tight">{plan.title}</h2>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className="chip text-white"
              style={{ backgroundColor: cat.color }}
            >
              {cat.emoji} {cat.label}
            </span>
            <span className="chip bg-white/70 text-ink ring-1 ring-ink/5">
              {plan.budget === '€' ? '€ Gratis o muy barato' : '€€ Moderado'}
            </span>
            {yaHecho && (
              <span className="chip bg-white/70 text-muted ring-1 ring-ink/5">
                🔁 Ya lo hicisteis el{' '}
                {new Date(yaHecho).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-6 pb-4">
          <p className="text-[15px] leading-relaxed text-ink/85">{plan.description}</p>

          {plan.driveTime && <Dato icon="🚗" label="Coche">{plan.driveTime}</Dato>}

          {plan.tips?.length > 0 && (
            <div className="rounded-xl border border-ink/5 bg-white/70 p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                Consejos prácticos
              </p>
              <ul className="space-y-2">
                {plan.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink/85">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-terracota" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {plan.glutenFree && (
            <div className="rounded-xl border border-salvia/30 bg-salvia/10 p-4">
              <p className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-salvia">
                🌾 Opciones 100% sin gluten
              </p>
              <p className="text-sm leading-relaxed text-ink/85">{plan.glutenFree}</p>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div
          className="flex gap-3 border-t border-ink/5 bg-white/60 px-6 py-4"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <button className="btn-ghost flex-1" onClick={onRetry} disabled={saving}>
            🔄 Volver a tirar
          </button>
          <button className="btn-accent flex-[1.3]" onClick={onAccept} disabled={saving}>
            {saving ? 'Guardando…' : '✓ Aceptar plan'}
          </button>
        </div>
      </div>
    </div>
  )
}
