import { useEffect, useRef, useState } from 'react'
import { mensajeDeError } from '../lib/errors'

const hoy = () => new Date().toISOString().slice(0, 10)

export default function MemoryForm({ plan, onClose, onSubmit }) {
  const [fecha, setFecha] = useState(hoy())
  const [nota, setNota] = useState('')
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [subiendo, setSubiendo] = useState(false)
  const [progreso, setProgreso] = useState(0)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [files])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !subiendo && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, subiendo])

  function añadirFotos(e) {
    const nuevos = Array.from(e.target.files ?? [])
    setFiles((prev) => [...prev, ...nuevos].slice(0, 12))
    e.target.value = ''
  }

  const quitarFoto = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))

  async function enviar(e) {
    e.preventDefault()
    setSubiendo(true)
    setError(null)
    try {
      await onSubmit({
        happenedOn: fecha,
        note: nota.trim(),
        files,
        onProgress: (n, total) => setProgreso(total ? Math.round((n / total) * 100) : 100),
      })
      onClose()
    } catch (err) {
      setError(mensajeDeError(err))
      setSubiendo(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 animate-fade bg-ink/40 backdrop-blur-sm"
        onClick={() => !subiendo && onClose()}
      />

      <form
        onSubmit={enviar}
        className="relative z-10 flex max-h-[92vh] w-full max-w-lg animate-pop flex-col
                   overflow-hidden rounded-t-3xl bg-cream shadow-soft sm:rounded-3xl"
      >
        <div className="border-b border-ink/5 px-6 pb-4 pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Guardar recuerdo
          </p>
          <h2 className="mt-1 flex items-start gap-2 text-xl font-semibold leading-tight">
            <span>{plan.emoji}</span>
            {plan.title}
          </h2>
        </div>

        <div className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div>
            <label className="label" htmlFor="fecha">
              ¿Qué día fue?
            </label>
            <input
              id="fecha"
              type="date"
              className="field"
              value={fecha}
              max={hoy()}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="nota">
              Vuestra nota del recuerdo
            </label>
            <textarea
              id="nota"
              rows={4}
              className="field resize-none"
              placeholder="Lo mejor del día, la anécdota que no queréis olvidar, lo que repetiríais…"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />
          </div>

          <div>
            <span className="label">Fotos {files.length > 0 && `(${files.length})`}</span>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {previews.map((src, i) => (
                <div key={src} className="group relative aspect-square overflow-hidden rounded-xl">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => quitarFoto(i)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center
                               rounded-full bg-ink/70 text-xs text-white opacity-0 transition
                               group-hover:opacity-100 focus:opacity-100"
                    aria-label={`Quitar foto ${i + 1}`}
                  >
                    ✕
                  </button>
                </div>
              ))}

              {files.length < 12 && (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center gap-1
                             rounded-xl border-2 border-dashed border-ink/15 bg-white/50
                             text-muted transition hover:border-terracota/50 hover:text-terracota"
                >
                  <span className="text-xl">＋</span>
                  <span className="text-[10px] font-medium">Añadir</span>
                </button>
              )}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={añadirFotos}
            />
            <p className="mt-2 text-xs text-muted">
              Se comprimen automáticamente antes de subirlas. Máximo 12 por recuerdo.
            </p>
          </div>

          {error && (
            <p className="rounded-xl bg-terracota/10 px-4 py-3 text-sm text-terracota">{error}</p>
          )}

          {subiendo && files.length > 0 && (
            <div className="space-y-1.5">
              <div className="h-1.5 overflow-hidden rounded-full bg-sand">
                <div
                  className="h-full rounded-full bg-salvia transition-all duration-300"
                  style={{ width: `${progreso}%` }}
                />
              </div>
              <p className="text-xs text-muted">Subiendo fotos… {progreso}%</p>
            </div>
          )}
        </div>

        <div
          className="flex gap-3 border-t border-ink/5 bg-white/60 px-6 py-4"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <button type="button" className="btn-ghost flex-1" onClick={onClose} disabled={subiendo}>
            Cancelar
          </button>
          <button type="submit" className="btn-accent flex-[1.3]" disabled={subiendo}>
            {subiendo ? 'Guardando…' : '✓ Marcar como hecho'}
          </button>
        </div>
      </form>
    </div>
  )
}
