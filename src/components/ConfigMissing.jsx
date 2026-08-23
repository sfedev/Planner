// Pantalla que sale cuando la app se ha compilado sin las credenciales de
// Supabase. Antes en ese caso arrancaba en "modo local" y era muy fácil no
// darse cuenta de que los datos no se estaban guardando en ningún sitio.

export default function ConfigMissing() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center p-6">
      <div className="card w-full max-w-md space-y-5 p-7">
        <div className="text-center">
          <p className="mb-2 text-4xl">🔌</p>
          <h1 className="text-2xl font-semibold">Falta conectar Supabase</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Esta copia de la aplicación se ha compilado sin credenciales, así que no puede
            guardar ni leer nada.
          </p>
        </div>

        <div className="space-y-3 rounded-xl bg-sand/60 p-4 text-sm leading-relaxed text-ink/80">
          <p className="font-medium text-ink">En el panel de tu hosting, añade:</p>
          <ul className="space-y-1.5 font-mono text-xs">
            <li className="rounded-lg bg-white/70 px-3 py-2">VITE_SUPABASE_URL</li>
            <li className="rounded-lg bg-white/70 px-3 py-2">VITE_SUPABASE_ANON_KEY</li>
          </ul>
          <p>
            Y vuelve a desplegar. Las variables se incrustan al compilar, así que un
            despliegue anterior no las recoge: hay que lanzar uno nuevo.
          </p>
        </div>

        <p className="text-center text-xs leading-relaxed text-muted">
          En local, las mismas dos líneas en un fichero <code>.env</code> en la raíz del
          proyecto, y reiniciar <code>npm run dev</code>.
        </p>
      </div>
    </div>
  )
}
