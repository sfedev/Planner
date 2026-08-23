import { useEffect, useMemo, useState } from 'react'
import { resolvePhotoUrls } from '../lib/store'
import { CATEGORIES } from '../data/plans'

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

function fechaLarga(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} de ${MESES[m - 1]} de ${y}`
}

function fechaCorta(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${String(y).slice(2)}`
}

// Hook: convierte las rutas guardadas en URLs mostrables (firmadas en Supabase,
// object-URLs en modo local).
function useFotos(paths) {
  const [urls, setUrls] = useState([])
  const clave = (paths ?? []).join('|')

  useEffect(() => {
    let vivo = true
    if (!paths?.length) {
      setUrls([])
      return
    }
    resolvePhotoUrls(paths)
      .then((res) => vivo && setUrls(res))
      .catch(() => vivo && setUrls([]))
    return () => {
      vivo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave])

  return urls
}

// --------------------------------------------------------------------------
function Lightbox({ fotos, indice, onClose, onNavegar }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavegar(1)
      if (e.key === 'ArrowLeft') onNavegar(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onNavegar])

  return (
    <div className="fixed inset-0 z-50 flex animate-fade items-center justify-center bg-ink/90 p-4">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center
                   rounded-full bg-white/10 text-white transition hover:bg-white/20"
        aria-label="Cerrar"
      >
        ✕
      </button>

      {fotos.length > 1 && (
        <>
          <button
            onClick={() => onNavegar(-1)}
            className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center
                       rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            onClick={() => onNavegar(1)}
            className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center
                       rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
            aria-label="Siguiente"
          >
            ›
          </button>
        </>
      )}

      <img
        src={fotos[indice]}
        alt=""
        className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
      />

      {fotos.length > 1 && (
        <p className="absolute bottom-6 text-xs text-white/70">
          {indice + 1} / {fotos.length}
        </p>
      )}
    </div>
  )
}

// --------------------------------------------------------------------------
function Polaroid({ memory, index, onAbrir }) {
  const fotos = useFotos(memory.photos)
  const cat = CATEGORIES[memory.plan?.category] ?? CATEGORIES.casa
  const giro = [-1.6, 1.2, -0.8, 1.8, -1.2][index % 5]

  return (
    <div
      className="paper mb-4 break-inside-avoid rounded-sm p-3 pb-4 shadow-polaroid transition-transform
                 duration-300 hover:z-10 hover:!rotate-0 hover:scale-[1.02]"
      style={{ transform: `rotate(${giro}deg)` }}
    >
      {fotos.length > 0 ? (
        <button
          onClick={() => onAbrir(fotos, 0)}
          className="relative block w-full overflow-hidden bg-sand"
        >
          <img
            src={fotos[0]}
            alt={memory.plan?.title ?? 'Recuerdo'}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover"
          />
          {fotos.length > 1 && (
            <span className="absolute bottom-2 right-2 rounded-full bg-ink/70 px-2 py-0.5 text-[11px] text-white">
              +{fotos.length - 1}
            </span>
          )}
        </button>
      ) : (
        <div className="flex aspect-[4/5] w-full items-center justify-center bg-sand text-3xl">
          {memory.plan?.emoji ?? '📷'}
        </div>
      )}

      <div className="px-1 pt-3">
        <p className="font-display text-[15px] font-semibold leading-snug">
          {memory.plan?.title ?? 'Plan eliminado'}
        </p>
        <p className="mt-0.5 text-[11px] text-muted">
          <span style={{ color: cat.color }}>{cat.emoji}</span> {fechaCorta(memory.happened_on)}
        </p>
        {memory.note && (
          <p className="mt-2 line-clamp-4 text-[13px] leading-relaxed text-ink/75">
            {memory.note}
          </p>
        )}
      </div>
    </div>
  )
}

// --------------------------------------------------------------------------
function FeedItem({ memory, onAbrir, onBorrar }) {
  const fotos = useFotos(memory.photos)
  const cat = CATEGORIES[memory.plan?.category] ?? CATEGORIES.casa
  const [confirmando, setConfirmando] = useState(false)

  return (
    <article className="card overflow-hidden">
      <div className="flex items-start gap-3 p-4">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
          style={{ backgroundColor: `${cat.color}22` }}
        >
          {memory.plan?.emoji ?? '📷'}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-snug">
            {memory.plan?.title ?? 'Plan eliminado'}
          </h3>
          <p className="mt-0.5 text-xs text-muted">
            {fechaLarga(memory.happened_on)} · {cat.short}
          </p>
        </div>

        {confirmando ? (
          <span className="flex shrink-0 items-center gap-1">
            <button
              className="btn-ghost px-2.5 py-1.5 text-[11px] text-terracota"
              onClick={() => onBorrar(memory)}
            >
              Borrar
            </button>
            <button
              className="btn-ghost px-2.5 py-1.5 text-[11px]"
              onClick={() => setConfirmando(false)}
            >
              No
            </button>
          </span>
        ) : (
          <button
            className="shrink-0 rounded-full px-2 py-1 text-muted transition hover:bg-sand"
            onClick={() => setConfirmando(true)}
            aria-label="Eliminar recuerdo"
          >
            🗑
          </button>
        )}
      </div>

      {fotos.length > 0 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-1">
          {fotos.map((url, i) => (
            <button
              key={url}
              onClick={() => onAbrir(fotos, i)}
              className="shrink-0 overflow-hidden rounded-xl"
            >
              <img
                src={url}
                alt=""
                loading="lazy"
                className={`h-44 object-cover transition hover:opacity-90 ${
                  fotos.length === 1 ? 'w-auto max-w-full' : 'w-36'
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {memory.note && (
        <p className="px-4 pb-4 pt-3 text-sm leading-relaxed text-ink/80">{memory.note}</p>
      )}
    </article>
  )
}

// --------------------------------------------------------------------------
export default function Gallery({ memories, onDeleteMemory, onGoToWheel }) {
  const [vista, setVista] = useState('polaroid')
  const [lightbox, setLightbox] = useState(null)

  const totalFotos = useMemo(
    () => memories.reduce((n, m) => n + (m.photos?.length ?? 0), 0),
    [memories]
  )

  const porMes = useMemo(() => {
    const grupos = new Map()
    memories.forEach((m) => {
      const [y, mes] = m.happened_on.split('-')
      const clave = `${MESES[Number(mes) - 1]} de ${y}`
      if (!grupos.has(clave)) grupos.set(clave, [])
      grupos.get(clave).push(m)
    })
    return [...grupos.entries()]
  }, [memories])

  const abrir = (fotos, i) => setLightbox({ fotos, indice: i })
  const navegar = (paso) =>
    setLightbox((lb) =>
      lb ? { ...lb, indice: (lb.indice + paso + lb.fotos.length) % lb.fotos.length } : lb
    )

  if (memories.length === 0) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <p className="mb-3 text-3xl">📷</p>
        <h2 className="mb-2 text-xl font-semibold">Vuestro álbum está vacío</h2>
        <p className="mb-4 text-sm leading-relaxed text-muted">
          Cuando hagáis un plan, marcadlo como hecho y subid las fotos. Aparecerán aquí para
          siempre.
        </p>
        <button className="btn-accent" onClick={onGoToWheel}>
          Girar la ruleta
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold">Nuestros recuerdos</h1>
        <p className="text-sm text-muted">
          {memories.length} finde{memories.length > 1 ? 's' : ''} · {totalFotos} foto
          {totalFotos === 1 ? '' : 's'}
        </p>

        <div className="inline-flex rounded-full bg-sand/70 p-1">
          {[
            { id: 'polaroid', label: '🖼 Polaroids' },
            { id: 'feed', label: '📜 Cronológico' },
          ].map((op) => (
            <button
              key={op.id}
              onClick={() => setVista(op.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                vista === op.id ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>
      </header>

      {vista === 'polaroid' ? (
        <div className="mx-auto max-w-4xl columns-2 gap-4 sm:columns-3 lg:columns-4">
          {memories.map((m, i) => (
            <Polaroid key={m.id} memory={m} index={i} onAbrir={abrir} />
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-2xl space-y-8">
          {porMes.map(([mes, items]) => (
            <section key={mes} className="space-y-3">
              <h2 className="sticky top-2 z-10 mx-auto w-fit rounded-full bg-cream/90 px-4 py-1
                             text-xs font-semibold uppercase tracking-wider text-muted backdrop-blur">
                {mes}
              </h2>
              {items.map((m) => (
                <FeedItem key={m.id} memory={m} onAbrir={abrir} onBorrar={onDeleteMemory} />
              ))}
            </section>
          ))}
        </div>
      )}

      {lightbox && (
        <Lightbox
          fotos={lightbox.fotos}
          indice={lightbox.indice}
          onClose={() => setLightbox(null)}
          onNavegar={navegar}
        />
      )}
    </div>
  )
}
