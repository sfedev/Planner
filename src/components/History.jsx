import { useMemo } from 'react'
import { CATEGORIES } from '../data/plans'

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

// Colores estables por nombre, para que cada uno tenga siempre el mismo.
const COLORES = ['#C97B5A', '#7E9B7A', '#9A7AA0', '#D9A441']
const colorDe = (nombre) => {
  let suma = 0
  for (const c of nombre) suma += c.charCodeAt(0)
  return COLORES[suma % COLORES.length]
}

function cuando(iso) {
  const fecha = new Date(iso)
  const hoy = new Date()
  const dias = Math.floor((hoy - fecha) / 86400000)
  if (dias <= 0) return 'hoy'
  if (dias === 1) return 'ayer'
  if (dias < 7) return `hace ${dias} días`
  if (dias < 30) return `hace ${Math.floor(dias / 7)} semana${dias < 14 ? '' : 's'}`
  return `${fecha.getDate()} de ${MESES[fecha.getMonth()]}${
    fecha.getFullYear() !== hoy.getFullYear() ? ` de ${fecha.getFullYear()}` : ''
  }`
}

function Avatar({ nombre }) {
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: colorDe(nombre) }}
      title={nombre}
    >
      {nombre.charAt(0).toUpperCase()}
    </span>
  )
}

export default function History({ plans, memories, ideas, perfiles, onGoToWheel }) {
  const nombreDe = (id) => perfiles[id] ?? 'Alguien'

  const eventos = useMemo(() => {
    const lista = []

    plans.forEach((p) =>
      lista.push({
        clave: `plan-${p.id}`,
        fecha: p.accepted_at,
        quien: p.created_by,
        icono: '🎡',
        verbo: 'eligió el plan',
        titulo: p.title,
        categoria: p.category,
        estado: p.status === 'completado' ? 'ya hecho' : 'pendiente',
      })
    )

    memories.forEach((m) =>
      lista.push({
        clave: `rec-${m.id}`,
        fecha: m.created_at,
        quien: m.created_by,
        icono: '📷',
        verbo: 'guardó el recuerdo de',
        titulo: m.plan?.title ?? 'un plan borrado',
        categoria: m.plan?.category,
        extra:
          m.photos?.length > 0
            ? `${m.photos.length} foto${m.photos.length > 1 ? 's' : ''}`
            : 'sin fotos',
      })
    )

    ideas.forEach((i) =>
      lista.push({
        clave: `idea-${i.id}`,
        fecha: i.creadoEn,
        quien: i.creadoPor,
        icono: '＋',
        verbo: 'añadió el plan',
        titulo: i.title,
        categoria: i.category,
        extra: 'al catálogo',
      })
    )

    return lista
      .filter((e) => e.fecha)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  }, [plans, memories, ideas])

  // Cuántas cosas ha hecho cada uno, para el resumen de arriba.
  const marcador = useMemo(() => {
    const cuenta = {}
    eventos.forEach((e) => {
      const n = nombreDe(e.quien)
      cuenta[n] = (cuenta[n] ?? 0) + 1
    })
    return Object.entries(cuenta).sort((a, b) => b[1] - a[1])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventos, perfiles])

  if (eventos.length === 0) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <p className="mb-3 text-3xl">📜</p>
        <h2 className="mb-2 text-xl font-semibold">Todavía no hay historial</h2>
        <p className="mb-4 text-sm leading-relaxed text-muted">
          Aquí irá quedando quién eligió cada plan, quién subió las fotos y quién añadió qué.
        </p>
        <button className="btn-accent" onClick={onGoToWheel}>
          Girar la ruleta
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold">Historial</h1>
        <p className="text-sm text-muted">Quién ha hecho qué, y cuándo.</p>

        {marcador.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {marcador.map(([nombre, n]) => (
              <span
                key={nombre}
                className="chip bg-white/70 text-ink ring-1 ring-ink/5"
                title={`${n} cosas`}
              >
                <Avatar nombre={nombre} />
                {nombre} · {n}
              </span>
            ))}
          </div>
        )}
      </header>

      <ol className="relative space-y-3 before:absolute before:bottom-4 before:left-[19px] before:top-4 before:w-px before:bg-ink/10">
        {eventos.map((e) => {
          const nombre = nombreDe(e.quien)
          const cat = CATEGORIES[e.categoria]
          return (
            <li key={e.clave} className="relative flex gap-3">
              <span className="z-10 mt-1">
                <Avatar nombre={nombre} />
              </span>

              <div className="card min-w-0 flex-1 p-3.5">
                <p className="text-sm leading-relaxed">
                  <span className="font-semibold">{nombre}</span>{' '}
                  <span className="text-ink/70">{e.verbo}</span>{' '}
                  <span className="font-medium">{e.titulo}</span>
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-muted">
                  <span>{e.icono}</span>
                  <span>{cuando(e.fecha)}</span>
                  {cat && <span style={{ color: cat.color }}>{cat.emoji} {cat.short}</span>}
                  {e.extra && <span>{e.extra}</span>}
                  {e.estado && (
                    <span
                      className={
                        e.estado === 'ya hecho' ? 'text-salvia' : 'text-mostaza'
                      }
                    >
                      {e.estado === 'ya hecho' ? '✅ ya hecho' : '⏳ pendiente'}
                    </span>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
