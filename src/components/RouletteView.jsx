import { useMemo, useRef, useState } from 'react'
import Wheel from './Wheel'
import SlotMachine from './SlotMachine'
import Filters from './Filters'
import { useEsMovil } from '../lib/useMediaQuery'
import PlanModal from './PlanModal'
import { PLANS, CATEGORIES } from '../data/plans'

const MAX_QUESITOS = 10

function barajar(array) {
  const copia = [...array]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

export default function RouletteView({ plans, onAccept, onGoToPlans }) {
  const [filtro, setFiltro] = useState('todos')
  const [semilla, setSemilla] = useState(0)
  const [resultado, setResultado] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const ruedaRef = useRef(null)
  // En móvil la ruleta se convierte en tragaperras vertical
  const esMovil = useEsMovil()

  // No tiene sentido proponer un plan que ya tenéis pendiente de hacer.
  const pendientes = useMemo(
    () => new Set(plans.filter((p) => p.status === 'pendiente').map((p) => p.idea_id)),
    [plans]
  )

  // Planes ya completados, con la fecha de la última vez.
  const hechos = useMemo(() => {
    const mapa = new Map()
    plans
      .filter((p) => p.status === 'completado')
      .forEach((p) => {
        const previa = mapa.get(p.idea_id)
        if (!previa || (p.completed_at ?? '') > previa) mapa.set(p.idea_id, p.completed_at)
      })
    return mapa
  }, [plans])

  const disponibles = useMemo(
    () => PLANS.filter((p) => !pendientes.has(p.id)),
    [pendientes]
  )

  const counts = useMemo(() => {
    const c = { todos: disponibles.length }
    Object.keys(CATEGORIES).forEach((k) => {
      c[k] = disponibles.filter((p) => p.category === k).length
    })
    return c
  }, [disponibles])

  const pool = useMemo(
    () => disponibles.filter((p) => filtro === 'todos' || p.category === filtro),
    [disponibles, filtro]
  )

  // Los que aún no habéis hecho nunca tienen preferencia absoluta. Los ya
  // completados solo vuelven a la ruleta cuando no quedan suficientes sin
  // estrenar para llenarla: así no se repite nada mientras haya novedades,
  // pero la ruleta tampoco se queda vacía dentro de unos meses.
  const frescos = useMemo(() => pool.filter((p) => !hechos.has(p.id)), [pool, hechos])
  const repetibles = useMemo(() => pool.filter((p) => hechos.has(p.id)), [pool, hechos])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const candidatos = useMemo(() => {
    const nuevos = barajar(frescos).slice(0, MAX_QUESITOS)
    if (nuevos.length >= MAX_QUESITOS) return nuevos
    return [...nuevos, ...barajar(repetibles).slice(0, MAX_QUESITOS - nuevos.length)]
  }, [frescos, repetibles, semilla])

  const repetidosEnRuleta = candidatos.filter((p) => hechos.has(p.id)).length

  async function aceptar() {
    setGuardando(true)
    try {
      await onAccept(resultado)
      setResultado(null)
      setSemilla((s) => s + 1)
    } finally {
      setGuardando(false)
    }
  }

  function volverATirar() {
    setResultado(null)
    setSemilla((s) => s + 1)
    setTimeout(() => ruedaRef.current?.spin(), 260)
  }

  return (
    <>
      {/* En ordenador: texto y filtros a la izquierda, ruleta a la derecha,
          para que todo quepa sin tener que bajar. En móvil y tablet sigue
          siendo una sola columna apilada. */}
      <div className="space-y-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10 lg:space-y-0 xl:gap-14">
        <header className="space-y-3 text-center lg:col-start-1 lg:row-start-1 lg:text-left">
          <h1 className="text-3xl font-semibold sm:text-4xl">¿Qué hacemos este finde?</h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted lg:mx-0">
            Elegid el tipo de plan, dadle {esMovil ? 'a tirar' : 'a girar'} y que decida la
            suerte. Sin discutir.
          </p>
        </header>

        <div className="lg:col-start-1 lg:row-start-2">
          <Filters value={filtro} onChange={setFiltro} counts={counts} />
        </div>

        <div className="lg:col-start-2 lg:row-start-1 lg:row-span-3">
          {pool.length === 0 ? (
            <div className="card mx-auto max-w-md p-8 text-center">
              <p className="mb-2 text-3xl">🎉</p>
              <p className="text-sm leading-relaxed text-muted">
                No quedan planes de esta categoría sin asignar: ya los tenéis todos
                pendientes. Completad alguno o probad con otro filtro.
              </p>
              <button className="btn-ghost mt-4" onClick={onGoToPlans}>
                Ver planes guardados
              </button>
            </div>
          ) : esMovil ? (
            <SlotMachine ref={ruedaRef} items={candidatos} onResult={setResultado} />
          ) : (
            <Wheel ref={ruedaRef} items={candidatos} onResult={setResultado} />
          )}
        </div>

        {pool.length > 0 && (
          <div className="flex flex-col items-center gap-2 lg:col-start-1 lg:row-start-3 lg:items-start">
            <button
              className="btn-ghost text-xs"
              onClick={() => setSemilla((s) => s + 1)}
              title="Cambia los planes que entran en el sorteo"
            >
              🔀 Barajar los planes
            </button>
            <p className="max-w-xs text-center text-xs leading-relaxed text-muted lg:text-left">
              {frescos.length > 0
                ? `${candidatos.length - repetidosEnRuleta} de ${frescos.length} planes sin estrenar`
                : 'Ya los habéis hecho todos: ahora toca repetir los que más os gustaron'}
              {frescos.length > 0 &&
                repetidosEnRuleta > 0 &&
                ` · ${repetidosEnRuleta} repetido${repetidosEnRuleta > 1 ? 's' : ''} para llenar ${
                  esMovil ? 'la tragaperras' : 'la ruleta'
                }`}
            </p>
          </div>
        )}
      </div>

      <PlanModal
        plan={resultado}
        yaHecho={resultado ? hechos.get(resultado.id) : null}
        saving={guardando}
        onAccept={aceptar}
        onRetry={volverATirar}
        onClose={() => setResultado(null)}
      />
    </>
  )
}
