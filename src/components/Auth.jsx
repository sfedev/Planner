import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  async function entrar(e) {
    e.preventDefault()
    setCargando(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } catch (err) {
      setError(
        /Invalid login credentials/i.test(err.message ?? '')
          ? 'Correo o contraseña incorrectos.'
          : err.message ?? 'No se ha podido iniciar sesión.'
      )
      setCargando(false)
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center p-6">
      <form onSubmit={entrar} className="card w-full max-w-sm space-y-5 p-7">
        <div className="text-center">
          <p className="mb-2 text-4xl">🎡</p>
          <h1 className="text-2xl font-semibold">Nuestra ruleta</h1>
          <p className="mt-1 text-sm text-muted">Un sitio para dos. Iniciad sesión.</p>
        </div>

        <div>
          <label className="label" htmlFor="email">
            Correo
          </label>
          <input
            id="email"
            type="email"
            className="field"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className="field"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="rounded-xl bg-terracota/10 px-4 py-3 text-sm text-terracota">{error}</p>
        )}

        <button type="submit" className="btn-accent w-full" disabled={cargando}>
          {cargando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
