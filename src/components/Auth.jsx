import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [modo, setModo] = useState('password') // 'password' | 'magico'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const [error, setError] = useState(null)

  async function entrar(e) {
    e.preventDefault()
    setCargando(true)
    setError(null)
    setMensaje(null)

    try {
      if (modo === 'password') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: window.location.origin,
            // Nunca crear cuentas desde la app: las crea el panel de Supabase.
            shouldCreateUser: false,
          },
        })
        if (error) throw error
        setMensaje('Te hemos enviado un enlace de acceso al correo. Ábrelo desde este dispositivo.')
      }
    } catch (err) {
      setError(err.message ?? 'No se ha podido iniciar sesión.')
    } finally {
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

        {modo === 'password' && (
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
        )}

        {error && (
          <p className="rounded-xl bg-terracota/10 px-4 py-3 text-sm text-terracota">{error}</p>
        )}
        {mensaje && (
          <p className="rounded-xl bg-salvia/15 px-4 py-3 text-sm text-salvia">{mensaje}</p>
        )}

        <button type="submit" className="btn-accent w-full" disabled={cargando}>
          {cargando ? 'Entrando…' : modo === 'password' ? 'Entrar' : 'Enviarme el enlace'}
        </button>

        <button
          type="button"
          className="w-full text-xs text-muted underline underline-offset-4 hover:text-ink"
          onClick={() => {
            setModo((m) => (m === 'password' ? 'magico' : 'password'))
            setError(null)
            setMensaje(null)
          }}
        >
          {modo === 'password'
            ? 'Prefiero recibir un enlace por correo'
            : 'Prefiero usar mi contraseña'}
        </button>

        <p className="text-center text-[11px] leading-relaxed text-muted">
          Las cuentas se crean desde el panel de Supabase
          <br />
          (Authentication → Users → Add user).
        </p>
      </form>
    </div>
  )
}
