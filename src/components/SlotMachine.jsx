import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { CATEGORIES } from '../data/plans'

const ALTO_FILA = 84 // px de cada fila del rodillo
const VISIBLES = 3 // filas visibles en la ventana
const REPETICIONES = 9 // cuántas veces se repite la lista en la tira
const SPIN_MS = 3400

function Fila({ item }) {
  const cat = CATEGORIES[item.category]
  return (
    <div className="flex items-center gap-3 px-4" style={{ height: ALTO_FILA }}>
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
        style={{ backgroundColor: `${cat.color}22` }}
      >
        {item.emoji}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold leading-tight">{item.short}</p>
        <p className="mt-0.5 truncate text-[11px] text-muted">
          <span style={{ color: cat.color }}>{cat.emoji}</span> {cat.label} · {item.budget}
        </p>
      </div>
    </div>
  )
}

const SlotMachine = forwardRef(function SlotMachine({ items, onResult, disabled }, ref) {
  const [pos, setPos] = useState(0)
  const [girando, setGirando] = useState(false)
  const [borroso, setBorroso] = useState(false)
  const ganadorRef = useRef(null)
  const timerRef = useRef(null)
  const blurRef = useRef(null)

  const total = items.length

  // La tira repite la lista varias veces para que el rodillo tenga recorrido.
  const tira = useMemo(
    () => Array.from({ length: REPETICIONES }, () => items).flat(),
    [items]
  )

  useEffect(() => {
    setPos(0)
  }, [items])

  useEffect(
    () => () => {
      clearTimeout(timerRef.current)
      clearTimeout(blurRef.current)
    },
    []
  )

  useImperativeHandle(ref, () => ({ spin: () => tirar() }))

  function tirar() {
    if (girando || disabled || total === 0) return

    const index = Math.floor(Math.random() * total)
    ganadorRef.current = items[index]

    setGirando(true)
    setBorroso(true)
    // Aterriza en la penúltima repetición de la tira
    setPos((REPETICIONES - 2) * total + index)

    clearTimeout(blurRef.current)
    blurRef.current = setTimeout(() => setBorroso(false), SPIN_MS - 1100)

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(terminar, SPIN_MS + 300)
  }

  function terminar() {
    if (!ganadorRef.current) return
    const ganador = ganadorRef.current
    ganadorRef.current = null
    clearTimeout(timerRef.current)
    setGirando(false)
    setBorroso(false)
    // Volvemos a la posición equivalente del principio de la tira. Como el
    // contenido se repite, el salto es invisible y el próximo tirón vuelve a
    // tener recorrido de sobra.
    setPos((p) => (total ? p % total : 0))
    onResult(ganador)
  }

  return (
    <div className="mx-auto w-full max-w-sm select-none">
      <div className="rounded-[28px] bg-ink p-3 shadow-soft">
        {/* Lucecitas */}
        <div className="flex justify-center gap-1.5 pb-2.5 pt-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                girando ? 'animate-pulse bg-mostaza' : 'bg-cream/20'
              }`}
              style={{ animationDelay: `${i * 110}ms` }}
            />
          ))}
        </div>

        {/* Ventana del rodillo */}
        <div
          className="relative overflow-hidden rounded-2xl bg-cream"
          style={{ height: VISIBLES * ALTO_FILA }}
        >
          <div
            style={{
              transform: `translateY(${-(pos - 1) * ALTO_FILA}px)`,
              transition: girando
                ? `transform ${SPIN_MS}ms cubic-bezier(.16,.68,.14,1)`
                : 'none',
              filter: borroso ? 'blur(1.1px)' : 'none',
            }}
            onTransitionEnd={terminar}
          >
            {tira.map((item, i) => (
              <Fila key={`${item.id}-${i}`} item={item} />
            ))}
          </div>

          {/* Degradados arriba y abajo */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-cream via-cream/75 to-transparent"
            style={{ height: ALTO_FILA }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-cream via-cream/75 to-transparent"
            style={{ height: ALTO_FILA }}
          />

          {/* Banda ganadora */}
          <div
            className="pointer-events-none absolute inset-x-0 z-20 border-y-2 border-terracota/60 bg-terracota/[0.04]"
            style={{ top: ALTO_FILA, height: ALTO_FILA }}
          >
            <span
              className="absolute -left-px top-1/2 h-0 w-0 -translate-y-1/2"
              style={{
                borderTop: '7px solid transparent',
                borderBottom: '7px solid transparent',
                borderLeft: '9px solid #C97B5A',
              }}
            />
            <span
              className="absolute -right-px top-1/2 h-0 w-0 -translate-y-1/2"
              style={{
                borderTop: '7px solid transparent',
                borderBottom: '7px solid transparent',
                borderRight: '9px solid #C97B5A',
              }}
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={tirar}
        disabled={girando || disabled || total === 0}
        className="mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-full
                   bg-terracota font-display text-sm text-white shadow-soft
                   ring-[6px] ring-terracota/15 transition-transform duration-200
                   active:scale-90 disabled:opacity-60 disabled:active:scale-100"
      >
        {girando ? '···' : 'TIRAR'}
      </button>
    </div>
  )
})

export default SlotMachine
