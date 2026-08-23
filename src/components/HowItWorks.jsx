import { CATEGORIES } from '../data/plans'

function Seccion({ titulo, intro, children }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold">{titulo}</h2>
        {intro && <p className="mt-1 text-sm leading-relaxed text-muted">{intro}</p>}
      </div>
      {children}
    </section>
  )
}

function Paso({ n, color, emoji, titulo, children }) {
  return (
    <div className="card flex gap-4 p-4">
      <div className="flex flex-col items-center gap-1">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: color }}
        >
          {n}
        </span>
        <span className="text-lg leading-none">{emoji}</span>
      </div>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold leading-snug">{titulo}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink/75">{children}</p>
      </div>
    </div>
  )
}

function Fila({ icono, termino, children }) {
  return (
    <li className="flex gap-3 border-b border-ink/5 py-3 last:border-0">
      <span className="w-16 shrink-0 text-center text-sm font-semibold">{icono}</span>
      <p className="text-sm leading-relaxed text-ink/75">
        <span className="font-medium text-ink">{termino}</span> — {children}
      </p>
    </li>
  )
}

export default function HowItWorks({ onGoToWheel }) {
  return (
    <div className="mx-auto max-w-2xl space-y-10 pb-4">
      <header className="space-y-3 text-center">
        <p className="text-4xl">🎡</p>
        <h1 className="text-3xl font-semibold sm:text-4xl">¿Cómo funciona?</h1>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
          Una ruleta decide vuestro plan de fin de semana y un álbum guarda lo que hicisteis.
          Nada más. Aquí está todo lo que hace la aplicación, en dos minutos de lectura.
        </p>
      </header>

      <Seccion
        titulo="El ciclo de un plan"
        intro="Todo gira alrededor de estos cuatro pasos. Un plan siempre está en uno de ellos."
      >
        <div className="space-y-3">
          <Paso n="1" color="#7E9B7A" emoji="🎡" titulo="Girar">
            Elegís el tipo de plan que os apetece y dais a girar. En el ordenador es una
            ruleta; en el móvil, una tragaperras que baja de arriba abajo. Decide la suerte,
            así que no hay discusión posible.
          </Paso>
          <Paso n="2" color="#C97B5A" emoji="✓" titulo="Aceptar">
            Sale una tarjeta con el plan que os ha tocado. Si os convence, «Aceptar plan» y se
            guarda como pendiente. Si no, «Volver a tirar» y la ruleta gira otra vez sola.
          </Paso>
          <Paso n="3" color="#D9A441" emoji="📌" titulo="Hacerlo">
            El plan os espera en la pestaña <strong>Planes</strong> con toda su información:
            descripción, consejos, presupuesto y opciones sin gluten. Podéis consultarlo el
            mismo día desde el móvil.
          </Paso>
          <Paso n="4" color="#9A7AA0" emoji="📷" titulo="Guardar el recuerdo">
            Al volver, «Ya lo hicimos»: ponéis la fecha, escribís una nota y subís las fotos.
            El plan pasa al álbum y ya no vuelve a salir en la ruleta mientras queden otros
            sin estrenar.
          </Paso>
        </div>
      </Seccion>

      <Seccion
        titulo="La ruleta"
        intro="Cuatro cosas que conviene saber para que no os sorprenda su comportamiento."
      >
        <ul className="card divide-y divide-ink/5 px-4">
          <Fila icono="🎯" termino="Muestra 10 planes">
            El catálogo tiene muchos más, pero con más de diez quesitos no se leería nada. El
            botón <strong>🔀 Barajar</strong> cambia cuáles salen sin tener que girar.
          </Fila>
          <Fila icono="🚫" termino="No repite lo pendiente">
            Un plan que ya tenéis aceptado y sin hacer no vuelve a salir. Sería absurdo que os
            tocara dos veces lo mismo.
          </Fila>
          <Fila icono="✨" termino="Prioriza lo nuevo">
            Los planes que nunca habéis hecho tienen preferencia absoluta. Bajo la ruleta veis
            cuántos os quedan sin estrenar.
          </Fila>
          <Fila icono="🔁" termino="Repite solo si hace falta">
            Cuando no queden suficientes planes nuevos para llenar la ruleta, se rellena con
            los ya hechos. Esos salen marcados con «¡Otra vez!» y la fecha de la última vez.
          </Fila>
        </ul>
      </Seccion>

      <Seccion titulo="Qué significa cada cosa de la tarjeta">
        <ul className="card divide-y divide-ink/5 px-4">
          <Fila icono="€" termino="Gratis o muy barato">
            Planes de menos de 20 € en total, o directamente de cero euros.
          </Fila>
          <Fila icono="€€" termino="Moderado">
            Entradas, gasolina o una comida fuera. Sigue siendo un finde de presupuesto
            ajustado, no un capricho.
          </Fila>
          <Fila icono="🚗" termino="Tiempo en coche">
            Desde Madrid. Ninguna escapada pasa de las tres horas y media: más allá, no
            compensa para un fin de semana.
          </Fila>
          <Fila icono="🌾" termino="Sin gluten">
            En todos los planes que impliquen comer. No es un aviso genérico: dice qué pedir,
            qué evitar y qué preguntar en cada sitio concreto.
          </Fila>
          <Fila icono="🤔" termino="Consejos prácticos">
            Lo que se aprende yendo: qué día ir para pagar menos, dónde aparcar, qué reservar
            con antelación.
          </Fila>
        </ul>

        <div className="card p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
            Las tres categorías
          </p>
          <div className="space-y-2.5">
            {Object.values(CATEGORIES).map((c) => (
              <div key={c.id} className="flex gap-3">
                <span
                  className="chip shrink-0 self-start text-white"
                  style={{ backgroundColor: c.color }}
                >
                  {c.emoji} {c.short}
                </span>
                <p className="text-sm leading-relaxed text-ink/75">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Seccion>

      <Seccion
        titulo="El álbum de recuerdos"
        intro="La otra mitad de la aplicación: lo que queda cuando el finde ya ha pasado."
      >
        <ul className="card divide-y divide-ink/5 px-4">
          <Fila icono="🖼" termino="Dos vistas">
            <strong>Polaroids</strong> es un mosaico de fotos con la nota debajo;{' '}
            <strong>Cronológico</strong> ordena los recuerdos por meses, con todas las fotos
            de cada día. Se cambia con el interruptor de arriba.
          </Fila>
          <Fila icono="🔍" termino="Pantalla completa">
            Al tocar cualquier foto se abre a tamaño completo. En el ordenador podéis pasarlas
            con las flechas del teclado y cerrar con Escape.
          </Fila>
          <Fila icono="📸" termino="Hasta 12 fotos">
            Por recuerdo. Se comprimen automáticamente antes de subirse, así que no gastan
            datos del móvil ni llenan el almacenamiento.
          </Fila>
          <Fila icono="🗑" termino="Borrar tiene marcha atrás">
            Si borráis un recuerdo, su plan vuelve automáticamente a la lista de pendientes,
            como si no lo hubierais hecho.
          </Fila>
        </ul>
      </Seccion>

      <Seccion
        titulo="El historial"
        intro="La pestaña 📜 lleva la cuenta de quién ha hecho qué."
      >
        <ul className="card divide-y divide-ink/5 px-4">
          <Fila icono="🎡" termino="Quién eligió cada plan">
            Cada vez que alguien acepta un plan queda anotado, con la fecha y si ya está hecho
            o sigue pendiente.
          </Fila>
          <Fila icono="📷" termino="Quién subió las fotos">
            Los recuerdos indican quién los guardó y cuántas fotos tienen. También aparece en
            el álbum, debajo de cada uno.
          </Fila>
          <Fila icono="＋" termino="Quién añadió qué plan">
            Los planes que os inventáis también entran en el historial.
          </Fila>
          <Fila icono="🏆" termino="Marcador">
            Arriba del todo, cuántas cosas lleva cada uno. Sin ningún premio, pero sirve para
            picarse.
          </Fila>
        </ul>
      </Seccion>

      <Seccion titulo="Vuestra privacidad">
        <ul className="card divide-y divide-ink/5 px-4">
          <Fila icono="🔒" termino="Solo vosotros dos">
            La base de datos solo acepta los dos correos autorizados. Aunque alguien dé con la
            dirección de la web, no puede leer ni escribir absolutamente nada.
          </Fila>
          <Fila icono="🖼" termino="Fotos privadas">
            El almacén de fotos no es público: cada imagen se sirve con un enlace firmado que
            caduca a la hora.
          </Fila>
          <Fila icono="🔄" termino="Sincronizado">
            Lo que guarda uno aparece en el móvil del otro. Todo vive en Supabase, así que
            da igual desde qué dispositivo entréis.
          </Fila>
        </ul>
      </Seccion>

      <Seccion
        titulo="Añadir vuestros propios planes"
        intro="El catálogo no está cerrado: lo que se os ocurra entra en la ruleta."
      >
        <ul className="card divide-y divide-ink/5 px-4">
          <Fila icono="＋" termino="Botón «Añadir plan»">
            Debajo de la ruleta. Escribís el plan, elegís una de las tres categorías, un icono
            y si es de los baratos o de los moderados.
          </Fila>
          <Fila icono="🎯" termino="Sale donde le toca">
            El plan aparece en el filtro de su categoría y también al girar con
            «Cualquiera», mezclado con los que ya venían.
          </Fila>
          <Fila icono="👀" termino="Los dos lo veis">
            Se guarda en la misma base de datos, así que lo que añade uno le sale al otro.
          </Fila>
          <Fila icono="🗑" termino="Se pueden quitar">
            En la misma ventana de «Añadir plan» está la lista de los vuestros, con su papelera.
            Borrar uno no borra los recuerdos que ya tengáis de él.
          </Fila>
        </ul>
      </Seccion>

      <div className="pt-2 text-center">
        <button className="btn-accent" onClick={onGoToWheel}>
          🎡 Vale, girar la ruleta
        </button>
      </div>
    </div>
  )
}
