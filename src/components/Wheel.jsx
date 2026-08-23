import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { CATEGORIES } from '../data/plans'

const R = 92
const SPIN_MS = 5200
const VUELTAS = 6

const polar = (radius, deg) => {
  const rad = ((deg - 90) * Math.PI) / 180
  return [radius * Math.cos(rad), radius * Math.sin(rad)]
}

// Mezcla un color hex con blanco (amount 0 = original, 1 = blanco)
function tint(hex, amount) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  const mix = (c) => Math.round(c + (255 - c) * amount)
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`
}

function segmentPath(i, total) {
  const step = 360 / total
  const [x0, y0] = polar(R, i * step)
  const [x1, y1] = polar(R, (i + 1) * step)
  const largeArc = step > 180 ? 1 : 0
  return `M 0 0 L ${x0.toFixed(3)} ${y0.toFixed(3)} A ${R} ${R} 0 ${largeArc} 1 ${x1.toFixed(
    3
  )} ${y1.toFixed(3)} Z`
}

const Wheel = forwardRef(function Wheel({ items, onResult, disabled }, ref) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const winnerRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  // Permite que el padre relance la ruleta (botón "Volver a tirar")
  useImperativeHandle(ref, () => ({ spin: () => spin() }))

  // Si cambian los items mientras no gira, reseteamos la posición.
  useEffect(() => {
    if (!spinning) setRotation((r) => r % 360)
  }, [items, spinning])

  const total = items.length

  function spin() {
    if (spinning || disabled || total === 0) return

    const index = Math.floor(Math.random() * total)
    const step = 360 / total
    const centro = index * step + step / 2
    // Ruido dentro del sector para que no caiga siempre clavado en el centro
    const ruido = (Math.random() - 0.5) * step * 0.6
    const objetivo = centro + ruido

    const actual = ((rotation % 360) + 360) % 360
    const delta = ((360 - objetivo - actual) % 360 + 360) % 360

    winnerRef.current = items[index]
    setSpinning(true)
    setRotation(rotation + VUELTAS * 360 + delta)

    // Red de seguridad por si el navegador no dispara transitionend
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(terminar, SPIN_MS + 350)
  }

  function terminar() {
    if (!winnerRef.current) return
    const ganador = winnerRef.current
    winnerRef.current = null
    clearTimeout(timerRef.current)
    setSpinning(false)
    onResult(ganador)
  }

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[min(86vw,34rem)] select-none">
      {/* Aguja */}
      <div className="pointer-events-none absolute left-1/2 top-[-6px] z-20 -translate-x-1/2">
        <div
          className="h-0 w-0 drop-shadow-[0_2px_3px_rgba(46,42,39,.25)]"
          style={{
            borderLeft: '11px solid transparent',
            borderRight: '11px solid transparent',
            borderTop: '22px solid #2E2A27',
          }}
        />
      </div>

      {/* Aro exterior */}
      <div className="absolute inset-0 rounded-full bg-white shadow-soft ring-1 ring-ink/5" />
      <div className="absolute inset-[6px] rounded-full ring-[3px] ring-ink/10" />

      <svg
        viewBox="-100 -100 200 200"
        className="absolute inset-[6px] h-[calc(100%-12px)] w-[calc(100%-12px)]"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning
            ? `transform ${SPIN_MS}ms cubic-bezier(.12,.72,.12,1)`
            : 'none',
        }}
        onTransitionEnd={terminar}
      >
        {total === 0 && <circle r={R} fill="#F2EAE0" />}

        {total === 1 && (
          <circle r={R} fill={tint(CATEGORIES[items[0].category].color, 0.35)} />
        )}

        {total > 1 &&
          items.map((item, i) => (
            <path
              key={item.id}
              d={segmentPath(i, total)}
              fill={tint(CATEGORIES[item.category].color, i % 2 === 0 ? 0.3 : 0.52)}
              stroke="#FFFDFA"
              strokeWidth="0.8"
            />
          ))}

        {items.map((item, i) => {
          const step = 360 / total
          const mid = total === 1 ? 0 : i * step + step / 2
          const etiqueta =
            item.short.length > 13 ? `${item.short.slice(0, 12)}…` : item.short

          // Cada etiqueta va tumbada sobre su radio: así dispone de todo el
          // radio del quesito y nunca invade el sector de al lado.
          return (
            <g key={`t-${item.id}`} transform={`rotate(${mid - 90})`}>
              <text
                x={R - 9}
                y="0"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="9"
              >
                {item.emoji}
              </text>
              <text
                x={R - 20}
                y="0"
                textAnchor="end"
                dominantBaseline="central"
                fontSize={total > 8 ? 7 : 7.8}
                fontWeight="600"
                fill="#2E2A27"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {etiqueta}
              </text>
            </g>
          )
        })}

      </svg>

      {/* Botón central */}
      <button
        type="button"
        onClick={spin}
        disabled={spinning || disabled || total === 0}
        aria-label="Girar la ruleta"
        className="absolute left-1/2 top-1/2 z-10 flex h-[23%] w-[23%] -translate-x-1/2 -translate-y-1/2
                   items-center justify-center rounded-full bg-ink text-cream shadow-soft
                   ring-[5px] ring-white transition-transform duration-200
                   hover:scale-105 active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
      >
        <span className="font-display text-[clamp(.7rem,3vw,1rem)] leading-none">
          {spinning ? '···' : 'GIRAR'}
        </span>
      </button>
    </div>
  )
})

export default Wheel
