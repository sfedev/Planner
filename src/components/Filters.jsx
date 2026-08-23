import { CATEGORIES } from '../data/plans'

const TODOS = { id: 'todos', label: 'Cualquiera', short: 'Todo', emoji: '🎲', color: '#2E2A27' }

export default function Filters({ value, onChange, counts }) {
  const opciones = [
    TODOS,
    ...Object.values(CATEGORIES).map((c) => ({
      id: c.id,
      label: c.label,
      short: c.short,
      emoji: c.emoji,
      color: c.color,
    })),
  ]

  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
      {opciones.map((op) => {
        const activo = value === op.id
        return (
          <button
            key={op.id}
            type="button"
            onClick={() => onChange(op.id)}
            className={`chip shrink-0 border px-3.5 py-2 transition-all duration-200 ${
              activo
                ? 'border-transparent text-white shadow-soft'
                : 'border-ink/10 bg-white/70 text-ink/70 hover:border-ink/20 hover:bg-white'
            }`}
            style={activo ? { backgroundColor: op.color } : undefined}
            aria-pressed={activo}
          >
            <span>{op.emoji}</span>
            <span className="hidden sm:inline">{op.label}</span>
            <span className="sm:hidden">{op.short}</span>
            <span className={activo ? 'text-white/70' : 'text-muted'}>{counts[op.id]}</span>
          </button>
        )
      })}
    </div>
  )
}
