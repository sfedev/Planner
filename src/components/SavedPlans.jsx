import { useMemo, useState } from 'react'
import MemoryForm from './MemoryForm'
import { CATEGORIES } from '../data/plans'

function formatearFecha(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function PlanCard({ plan, onComplete, onDelete, quien }) {
  const [abierto, setAbierto] = useState(false)
  const [confirmando, setConfirmando] = useState(false)
  const cat = CATEGORIES[plan.category] ?? CATEGORIES.casa
  const completado = plan.status === 'completado'

  return (
    <article className={`card overflow-hidden transition ${completado ? 'opacity-70' : ''}`}>
      <div className="flex items-start gap-3 p-4">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
          style={{ backgroundColor: `${cat.color}22` }}
        >
          {plan.emoji}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-snug">{plan.title}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span style={{ color: cat.color }} className="font-medium">
              {cat.emoji} {cat.short}
            </span>
            <span>{plan.budget}</span>
            {plan.drive_time && <span>🚗 {plan.drive_time}</span>}
            <span>
              {completado ? '✅ Hecho el ' : 'Guardado el '}
              {formatearFecha(completado ? plan.completed_at : plan.accepted_at)}
            </span>
            {quien && <span>· lo eligió {quien}</span>}
          </div>
        </div>

        <button
          onClick={() => setAbierto((v) => !v)}
          className="shrink-0 rounded-full px-2 py-1 text-muted transition hover:bg-sand"
          aria-expanded={abierto}
          aria-label="Ver detalles"
        >
          {abierto ? '▲' : '▼'}
        </button>
      </div>

      {abierto && (
        <div className="animate-fade space-y-3 border-t border-ink/5 px-4 py-4 text-sm">
          <p className="leading-relaxed text-ink/80">{plan.description}</p>

          {plan.tips?.length > 0 && (
            <ul className="space-y-1.5">
              {plan.tips.map((tip, i) => (
                <li key={i} className="flex gap-2 leading-relaxed text-ink/75">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-terracota" />
                  {tip}
                </li>
              ))}
            </ul>
          )}

          {plan.gluten_free && (
            <div className="rounded-xl border border-salvia/30 bg-salvia/10 p-3">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-salvia">
                🌾 Sin gluten
              </p>
              <p className="leading-relaxed text-ink/80">{plan.gluten_free}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 border-t border-ink/5 bg-white/50 px-4 py-3">
        {!completado && (
          <button className="btn-primary flex-1 text-xs" onClick={() => onComplete(plan)}>
            📸 Ya lo hicimos
          </button>
        )}
        {completado && (
          <span className="flex-1 self-center text-xs text-muted">
            Ya está en el álbum de recuerdos
          </span>
        )}

        {confirmando ? (
          <span className="flex items-center gap-2">
            <button
              className="btn-ghost px-3 py-2 text-xs text-terracota"
              onClick={() => onDelete(plan)}
            >
              Sí, borrar
            </button>
            <button
              className="btn-ghost px-3 py-2 text-xs"
              onClick={() => setConfirmando(false)}
            >
              No
            </button>
          </span>
        ) : (
          <button
            className="btn-ghost px-3 py-2 text-xs text-muted"
            onClick={() => setConfirmando(true)}
            aria-label="Eliminar plan"
          >
            🗑
          </button>
        )}
      </div>
    </article>
  )
}

export default function SavedPlans({
  plans,
  perfiles = {},
  onCompletePlan,
  onDeletePlan,
  onGoToWheel,
}) {
  const [planActivo, setPlanActivo] = useState(null)
  const [verCompletados, setVerCompletados] = useState(false)

  const pendientes = useMemo(() => plans.filter((p) => p.status === 'pendiente'), [plans])
  const completados = useMemo(() => plans.filter((p) => p.status === 'completado'), [plans])

  return (
    <div className="space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Planes guardados</h1>
        <p className="text-sm text-muted">
          {pendientes.length === 0
            ? 'No tenéis ningún plan pendiente ahora mismo.'
            : `Tenéis ${pendientes.length} plan${pendientes.length > 1 ? 'es' : ''} esperando.`}
        </p>
      </header>

      {pendientes.length === 0 && completados.length === 0 && (
        <div className="card mx-auto max-w-md p-8 text-center">
          <p className="mb-3 text-3xl">🎡</p>
          <p className="mb-4 text-sm leading-relaxed text-muted">
            Aún no habéis aceptado ningún plan. Girad la ruleta y aceptad el primero.
          </p>
          <button className="btn-accent" onClick={onGoToWheel}>
            Ir a la ruleta
          </button>
        </div>
      )}

      <div className="mx-auto max-w-2xl space-y-3">
        {pendientes.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onComplete={setPlanActivo}
            onDelete={onDeletePlan}
            quien={perfiles[plan.created_by]}
          />
        ))}
      </div>

      {completados.length > 0 && (
        <div className="mx-auto max-w-2xl space-y-3">
          <button
            className="mx-auto flex items-center gap-2 text-xs font-medium text-muted transition hover:text-ink"
            onClick={() => setVerCompletados((v) => !v)}
          >
            {verCompletados ? '▲ Ocultar' : '▼ Ver'} los {completados.length} planes completados
          </button>

          {verCompletados &&
            completados.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onComplete={setPlanActivo}
                onDelete={onDeletePlan}
                quien={perfiles[plan.created_by]}
              />
            ))}
        </div>
      )}

      {planActivo && (
        <MemoryForm
          plan={planActivo}
          onClose={() => setPlanActivo(null)}
          onSubmit={(payload) => onCompletePlan(planActivo.id, payload)}
        />
      )}
    </div>
  )
}
