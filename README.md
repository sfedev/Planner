# 🎡 Nuestra Ruleta de Planes

App web privada para dos: gira la ruleta, te toca un plan de fin de semana, lo aceptáis y
después subís las fotos al álbum de recuerdos.

- **36 planes precargados** repartidos en tres categorías: en casa, por Madrid / cerca y
  escapadas a menos de 3 h 30 de coche.
- Todos los planes que implican comer fuera llevan un apartado **🌾 sin gluten** con
  recomendaciones concretas para celíacos.
- Presupuesto marcado como `€` (gratis o muy barato) o `€€` (moderado).
- React + Tailwind + Supabase (base de datos + almacenamiento de fotos).

---

## 1. Arrancar en 30 segundos (modo local, sin configurar nada)

```bash
npm install
```

```bash
npm run dev
```

Abre <http://localhost:5173>. Sin credenciales de Supabase la app funciona igualmente en
**modo local**: los planes se guardan en `localStorage` y las fotos en IndexedDB, en ese
navegador. Perfecto para probarla. Cuando configures Supabase (paso 2) los datos pasan a la
nube y se sincronizan entre tus dispositivos y los de tu pareja.

> El modo activo se ve en la esquina superior derecha: si pone `modo local`, Supabase no está
> configurado.

---

## 2. Configurar Supabase

### 2.1 Crear el proyecto

1. Entra en <https://supabase.com>, crea una cuenta y un proyecto nuevo (el plan gratuito
   sobra: 500 MB de base de datos y 1 GB de fotos).
2. Apunta la **Project URL** y la **anon public key** desde
   *Project Settings → API*.

### 2.2 Ejecutar el esquema SQL

Son **dos ficheros y en este orden**:

1. [`supabase/schema.sql`](supabase/schema.sql) — copia el fichero entero en *SQL Editor →
   New query* y dale a **Run**. No contiene ningún correo, así que se puede subir a un
   repositorio público sin problema. Es idempotente: puedes relanzarlo las veces que quieras.
2. `supabase/emails.local.sql` — crea este fichero con los dos correos que podrán entrar.
   Git lo ignora (`*.local.sql`), así que nunca sale de tu ordenador:

   ```sql
   insert into public.pareja_autorizada (email) values
     ('tu-email@ejemplo.com'),
     ('email-de-tu-pareja@ejemplo.com')
   on conflict (email) do nothing;
   ```

Quien no esté en esa tabla no puede leer ni escribir absolutamente nada, aunque tenga
cuenta. Para dar o quitar acceso más adelante basta con un `insert` o un `delete`: no hay
que tocar el esquema.

Eso crea:

| Objeto | Qué es |
| --- | --- |
| `pareja_autorizada` | Los correos con acceso. Con RLS activo y sin políticas: ningún cliente puede leerla. |
| `plans` | Los planes que habéis aceptado en la ruleta (pendientes y completados). |
| `memories` | El recuerdo de cada plan: fecha, nota y rutas de las fotos. |
| `v_album` | Vista de solo lectura que junta plan + recuerdo, por si quieres consultarla. |
| Bucket `recuerdos` | Almacenamiento **privado** de las fotos. |
| Políticas RLS | Lectura/escritura solo para los dos emails de `es_pareja()`. |
| Trigger | Si borras el último recuerdo de un plan, el plan vuelve a *pendiente*. |

### 2.3 Crear vuestros dos usuarios

*Authentication → Users → Add user → Create new user*, marcando **Auto Confirm User**, para
cada uno. Usa exactamente los correos que insertaste en `pareja_autorizada`.

Recomendado: en *Authentication → Sign In / Providers*, **desactiva "Allow new users to sign
up"**. Así nadie más puede registrarse.

### 2.4 Conectar la app

```bash
cp .env.example .env
```

Rellena `.env`:

```
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Reinicia `npm run dev`. Ahora aparecerá la pantalla de login.

---

## 3. Cómo se usa

1. **Ruleta** → elige el filtro (*Cualquiera*, *En casa*, *Por Madrid / Cerca*, *Escapada de
   finde*) y pulsa **GIRAR**. En el móvil (pantallas de menos de 640 px) la ruleta se
   convierte en una **tragaperras vertical**: el rodillo gira de arriba abajo y el plan que
   quede en la banda central es el que os toca. Se cambia solo al girar el teléfono o
   redimensionar la ventana.
2. Sale la tarjeta del plan con descripción, consejos, presupuesto, tiempo en coche y
   opciones sin gluten. **Aceptar plan** o **Volver a tirar**.
3. **Planes** → los planes aceptados esperan ahí. Cuando lo hagáis, pulsa **📸 Ya lo
   hicimos**: eliges la fecha, escribes la nota y subes las fotos.
4. **Recuerdos** → el álbum, en vista *Polaroids* o *Cronológico*. Pulsa cualquier foto para
   verla a pantalla completa.

El botón **?** de la cabecera abre la pantalla «¿Cómo funciona?», que explica dentro de la
propia web el ciclo completo, qué significa cada dato de la tarjeta y cómo ampliar el
catálogo. Es el sitio al que mandar a cualquiera que coja la app por primera vez.

Detalles pensados para el día a día:

- Un plan que ya tenéis **pendiente no vuelve a salir** en la ruleta, y los que ya habéis
  completado solo reaparecen cuando no quedan suficientes sin estrenar para llenarla.
- La ruleta (o la tragaperras) muestra 10 planes de los disponibles; **🔀 Barajar** cambia
  los que salen.
- Las fotos se **comprimen a 1600 px** antes de subirse, así no se come el almacenamiento
  gratuito ni los datos del móvil.
- Las fotos se sirven con **URLs firmadas** de 1 hora: el bucket es privado.

---

## 4. Añadir vuestros propios planes

Todo el catálogo está en [`src/data/plans.js`](src/data/plans.js). Copia cualquier objeto y
cámbialo:

```js
{
  id: 'un-id-unico',
  short: 'Etiqueta ruleta',       // texto corto que se ve en el quesito
  title: 'Título completo del plan',
  category: 'casa',               // 'casa' | 'madrid' | 'escapada'
  emoji: '🍕',
  budget: '€',                    // '€' o '€€'
  driveTime: '1 h desde Madrid',  // o null si no aplica
  description: '…',
  tips: ['…', '…'],
  glutenFree: '…',
}
```

No hay que tocar nada más: la ruleta, los filtros y los contadores se actualizan solos.

---

## 5. Publicar la web

Cualquier hosting estático sirve. Con Vercel o Netlify:

```bash
npm run build
```

Sube la carpeta `dist/` (o conecta el repositorio) y añade las dos variables de entorno
`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en el panel del hosting.

> La *anon key* es pública por diseño: quien la tenga no puede hacer nada porque las
> políticas RLS solo dejan pasar a los dos emails autorizados.

---

## 6. Estructura del proyecto

```
├── index.html
├── tailwind.config.js          Paleta cálida (crema, terracota, salvia, malva)
├── supabase/
│   └── schema.sql              Tablas, RLS, bucket, políticas de Storage y trigger
└── src/
    ├── App.jsx                 Navegación, sesión y orquestación de datos
    ├── data/plans.js           Catálogo de 36 planes + categorías
    ├── lib/
    │   ├── supabase.js         Cliente (y detección de modo local)
    │   ├── store.js            Capa de datos única para nube y local
    │   ├── images.js           Compresión de fotos antes de subir
    │   ├── useMediaQuery.js    Detecta móvil para elegir ruleta o tragaperras
    │   └── idb.js              IndexedDB para las fotos en modo local
    └── components/
        ├── Wheel.jsx           Ruleta SVG con animación y aguja (escritorio)
        ├── SlotMachine.jsx     Tragaperras vertical (móvil)
        ├── Filters.jsx         Filtro por categoría
        ├── RouletteView.jsx    Pantalla de la ruleta
        ├── PlanModal.jsx       Tarjeta del plan que ha tocado
        ├── SavedPlans.jsx      Planes pendientes y completados
        ├── MemoryForm.jsx      Formulario de recuerdo + subida de fotos
        ├── Gallery.jsx         Muro polaroid / feed cronológico + lightbox
        ├── HowItWorks.jsx      Pantalla «¿Cómo funciona?»
        └── Auth.jsx            Login (contraseña o enlace mágico)
```

---

## 7. Aviso sobre los datos de los planes

Horarios, precios y condiciones (entradas gratuitas de museos, reserva del aparcamiento de La
Pedriza, fechas del Mercado de Motores…) cambian con el tiempo: **confírmalos en la web
oficial antes de ir**. Lo mismo con los restaurantes sin gluten: la app te dice qué preguntar,
pero la confirmación tiene que darla el local. La app de **FACE** (Federación de Asociaciones
de Celíacos de España) es la referencia para buscar establecimientos seguros por zona.
