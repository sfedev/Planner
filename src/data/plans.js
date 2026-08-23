// ---------------------------------------------------------------------------
// Catálogo de planes. Añade los vuestros aquí: solo hace falta respetar
// la forma del objeto. `short` es la etiqueta corta que aparece en la ruleta.
// ---------------------------------------------------------------------------

export const CATEGORIES = {
  casa: {
    id: 'casa',
    label: 'En casa',
    short: 'Casa',
    emoji: '🏠',
    color: '#7E9B7A',
    description: 'Planes de sofá, cocina y manta. Coste casi cero.',
  },
  madrid: {
    id: 'madrid',
    label: 'Por Madrid / Cerca',
    short: 'Madrid',
    emoji: '🌳',
    color: '#C97B5A',
    description: 'Día completo o media tarde sin salir de la Comunidad (o casi).',
  },
  escapada: {
    id: 'escapada',
    label: 'Escapada de finde',
    short: 'Escapada',
    emoji: '🚗',
    color: '#9A7AA0',
    description: 'Máximo 3–4 h de coche desde Madrid. Para dormir fuera.',
  },
}

export const PLANS = [
  // ===================== EN CASA / ECONÓMICOS =============================
  {
    id: 'maraton-ghibli',
    short: 'Ghibli',
    title: 'Maratón Studio Ghibli con cena japonesa casera',
    category: 'casa',
    emoji: '🎬',
    budget: '€',
    driveTime: null,
    description:
      'Tres pelis de Ghibli seguidas (El viaje de Chihiro, Mi vecino Totoro y La princesa Mononoke) con la casa a media luz, mantita y una cena japonesa hecha por vosotros: gyozas, arroz y edamame.',
    tips: [
      'Bajad las persianas aunque sea de día: el efecto cine se nota.',
      'Comprad el arroz y el edamame congelado en un supermercado asiático: sale a mitad de precio.',
      'Turnaos para elegir la peli de cada tanda para que no acabe eligiendo siempre el mismo.',
    ],
    glutenFree:
      'Usad salsa de soja tamari certificada sin gluten (la soja normal lleva trigo). Las gyozas de obleas de trigo NO valen: haced la versión con obleas de arroz o sustituidlas por brochetas yakitori con tamari. El arroz, el edamame y el nori son naturalmente sin gluten.',
  },
  {
    id: 'noche-italiana',
    short: 'Pasta casera',
    title: 'Noche italiana: pasta desde cero',
    category: 'casa',
    emoji: '🍝',
    budget: '€',
    driveTime: null,
    description:
      'Delantal, música italiana de fondo y hacer la pasta y la salsa desde cero. Cena a la luz de las velas en la mesa de casa, con una botella de vino de menos de 5 €.',
    tips: [
      'Un Lambrusco o un tinto de la Ribera joven por 4–5 € cumple de sobra.',
      'Poned una playlist de standards italianos: cambia por completo la noche.',
      'De postre, tiramisú exprés con mascarpone y café.',
    ],
    glutenFree:
      'Haced la pasta fresca con mezcla panificable sin gluten + huevo (sale mejor que la seca) o usad pasta de maíz y arroz. Ojo con el tiramisú: sustituid los bizcochos de soletilla por savoiardi sin gluten certificados. Comprobad que el vino no lleve trazas y que la superficie de trabajo esté limpia de harina normal.',
  },
  {
    id: 'torneo-mesa',
    short: 'Juegos mesa',
    title: 'Torneo de juegos de mesa con picoteo',
    category: 'casa',
    emoji: '🎲',
    budget: '€',
    driveTime: null,
    description:
      'Liguilla al mejor de tres con los juegos que tengáis en casa. El que pierde friega y elige la peli del próximo finde. Tabla de puntuaciones en papel pegada en la nevera.',
    tips: [
      'Si os faltan juegos, muchas bibliotecas municipales de Madrid prestan juegos de mesa gratis.',
      'Premio simbólico para el ganador: mandar en el mando durante una semana.',
      'Juegos rápidos para dos: Jaipur, 7 Wonders Duel, Patchwork.',
    ],
    glutenFree:
      'Picoteo 100% sin gluten fácil: patatas fritas de bolsa con sello sin gluten, aceitunas, jamón ibérico, queso curado, frutos secos naturales y nachos de maíz certificados. Evitad picar del mismo bol si uno de los dos come pan normal (contaminación cruzada por las manos).',
  },
  {
    id: 'maraton-saga',
    short: 'Maratón saga',
    title: 'Maratón de una saga entera (fin de semana completo)',
    category: 'casa',
    emoji: '🧙',
    budget: '€',
    driveTime: null,
    description:
      'Elegid una saga larga (El Señor de los Anillos versión extendida, Harry Potter, Regreso al Futuro) y repartidla entre sábado y domingo, en pijama y sin mirar el móvil.',
    tips: [
      'Las versiones extendidas de ESDLA son 11 h: cuatro películas por día es demasiado, repartid.',
      'Regla de oro: móviles en modo avión y boca abajo.',
      'Preparad la comida antes para no cortar el ritmo a mitad.',
    ],
    glutenFree:
      'Palomitas caseras hechas en olla con maíz a granel: baratas y sin gluten (las de microondas revisad el paquete). Chocolate onza a onza y helado con sello sin gluten para la tarde.',
  },
  {
    id: 'spa-casero',
    short: 'Spa casero',
    title: 'Noche de spa casero',
    category: 'casa',
    emoji: '🕯️',
    budget: '€',
    driveTime: null,
    description:
      'Mascarillas, masaje de espalda por turnos de 20 minutos, música tranquila, velas y baño de pies con sal. Cero pantallas durante toda la noche.',
    tips: [
      'Mascarillas de tela en Primor o Mercadona por 1–2 €.',
      'Cronómetro para los turnos de masaje: si no, siempre sale perdiendo alguien.',
      'Terminad con infusión y lectura en voz alta de un par de capítulos.',
    ],
    glutenFree:
      'Si vais a picar algo: fruta, yogur natural con miel y frutos secos, todo naturalmente sin gluten. Ojo con algunas mascarillas y exfoliantes con avena o extracto de trigo si hay dermatitis herpetiforme: revisad el INCI.',
  },
  {
    id: 'cata-baratos',
    short: 'Cata ciegas',
    title: 'Cata a ciegas de quesos y vinos baratos',
    category: 'casa',
    emoji: '🧀',
    budget: '€',
    driveTime: null,
    description:
      'Cuatro quesos y dos vinos de supermercado, presupuesto máximo 20 €. Cada uno puntúa a ciegas del 1 al 10 en una ficha y al final se descubren los precios: casi siempre gana el más barato.',
    tips: [
      'Comprad los quesos en la sección de corte del súper: pedís 100 g de cada uno y sale baratísimo.',
      'Sacad los quesos de la nevera 30 min antes de la cata.',
      'Guardad las fichas puntuadas: es un recuerdo estupendo para el álbum.',
    ],
    glutenFree:
      'Los quesos curados y el vino son sin gluten, pero acompañadlos con tostaditas de maíz/arroz o crackers certificados en lugar de picos de pan. Cuidado con los quesos azules artesanos elaborados con pan de centeno y con las cremas de queso con espesantes: mirad la etiqueta.',
  },
  {
    id: 'reposteria',
    short: 'Repostería',
    title: 'Tarde de repostería (y desastre en la cocina)',
    category: 'casa',
    emoji: '🧁',
    budget: '€',
    driveTime: null,
    description:
      'Elegid una receta que ninguno de los dos haya hecho nunca: brownie, cheesecake japonés, cinnamon rolls. Foto del resultado real al lado de la foto de la receta original.',
    tips: [
      'Empezad por un brownie: es casi imposible que salga mal.',
      'Poned un temporizador de verdad, no confiéis en "yo lo controlo".',
      'Repartid lo que sobre entre los vecinos o la familia.',
    ],
    glutenFree:
      'Toda la repostería es fácilmente 100% sin gluten: usad harina de arroz + almidón, o mezcla panificable Schär/Proceli. El cheesecake y el brownie salen igual de buenos. Usad un bol y una espátula que no hayan tocado harina de trigo y levadura química certificada.',
  },
  {
    id: 'camping-salon',
    short: 'Camping',
    title: 'Camping en el salón',
    category: 'casa',
    emoji: '⛺',
    budget: '€',
    driveTime: null,
    description:
      'Montar una cabaña con mantas y sillas, luces de guirnalda, sacos o edredón en el suelo, y dormir ahí. Peli proyectada en la pared o en el portátil dentro de la cabaña.',
    tips: [
      'Guirnalda de luces cálidas por 5 € en cualquier bazar: es lo que hace la foto.',
      'Colchoneta hinchable o los cojines del sofá para no acabar con la espalda destrozada.',
      'Historias de miedo con linterna antes de dormir.',
    ],
    glutenFree:
      'Merienda de campamento sin gluten: nubes de azúcar (revisad marca), chocolate y galletas María sin gluten para hacer s\'mores en el horno. Casi todas las nubes comerciales son sin gluten pero confirmadlo en el envase.',
  },
  {
    id: 'masterchef',
    short: 'Masterchef',
    title: 'Masterchef en casa: la caja misteriosa',
    category: 'casa',
    emoji: '👨‍🍳',
    budget: '€',
    driveTime: null,
    description:
      'Cada uno compra 5 ingredientes en secreto (máximo 8 € cada uno) y el otro tiene que cocinar un plato con ellos en 45 minutos. Se puntúa presentación, sabor y originalidad.',
    tips: [
      'Prohibido pasarse de presupuesto: la gracia está en la limitación.',
      'Poned una cuenta atrás en el móvil y hacedla sonar bien alta.',
      'Fotos de emplatado obligatorias antes de probar nada.',
    ],
    glutenFree:
      'Regla de la caja misteriosa: todo lo que se compre tiene que ser apto para celíacos (nada de pan rallado, harina normal, cerveza o salsas con trigo). Alternativas: pan rallado sin gluten, maicena para espesar, tamari en vez de soja. Cocinad con utensilios limpios y freidora/aceite sin usar previamente para rebozados con gluten.',
  },
  {
    id: 'escape-casero',
    short: 'Escape casero',
    title: 'Escape room de mesa en casa',
    category: 'casa',
    emoji: '🗝️',
    budget: '€',
    driveTime: null,
    description:
      'Las cajas tipo Exit o Unlock! son escape rooms completos en formato juego de mesa por 12–15 €. Dos horas de acertijos, candados y papeles por toda la mesa, sin salir del salón y sin reservar nada.',
    tips: [
      'Para empezar: "Exit: El Laboratorio Secreto" o "Unlock! Star Wars". Los de dificultad 1 o 2 son los adecuados si es vuestra primera vez.',
      'Las cajas Exit se doblan, se rompen y se escriben: forma parte del juego, no las tratéis con cuidado o no saldréis.',
      'Si no queréis gastar nada, hay escape rooms imprimibles gratuitos: buscad "escape room imprimible gratis" y os salen decenas.',
    ],
    glutenFree:
      'Al ser plan de casa lo controláis vosotros: patatas y nachos con sello sin gluten, frutos secos, aceitunas y refrescos. Cuidado con picar del mismo bol si uno de los dos come pan normal.',
  },

  // ===================== POR MADRID / CERCA ==============================
  {
    id: 'picnic-retiro',
    short: 'Retiro',
    title: 'Picnic en el Retiro y barca en el estanque',
    category: 'madrid',
    emoji: '🧺',
    budget: '€',
    driveTime: 'Sin coche: metro Retiro / Ibiza',
    description:
      'Manta, cesta preparada en casa y una tarde tirados en el césped del Retiro. Barca en el estanque (unos 6 € los 45 min entre semana) y vuelta paseando por el Paseo de Coches.',
    tips: [
      'Id por la puerta de Menéndez Pelayo: la zona del Chopo y el Bosque del Recuerdo está mucho más tranquila.',
      'Las barcas se llenan los domingos por la tarde: mejor sábado por la mañana o entre semana.',
      'Aparcar en el centro es carísimo: dejad el coche en casa y tirad de metro.',
    ],
    glutenFree:
      'Cesta 100% sin gluten muy fácil: tortilla de patata, ensalada de arroz, hummus con crudités, fruta, embutido con sello sin gluten y tostas de maíz. Cerca del Retiro tenéis Celicioso (c/ Hortaleza) para llevar dulces certificados si preferís no cocinar.',
  },
  {
    id: 'debod-atardecer',
    short: 'Debod',
    title: 'Atardecer en el Templo de Debod y ruta de miradores',
    category: 'madrid',
    emoji: '🌇',
    budget: '€',
    driveTime: 'Sin coche: metro Plaza de España',
    description:
      'El mejor atardecer gratis de Madrid. Después, bajar por el Parque del Oeste, cruzar a la Terraza de las Vistillas y acabar paseando por el barrio de La Latina.',
    tips: [
      'Llegad 45 min antes de la puesta de sol: en verano se pone imposible de gente.',
      'Llevad algo de picar y una manta y os ahorráis la terraza.',
      'Consultad la hora exacta de la puesta de sol en el móvil antes de salir.',
    ],
    glutenFree:
      'Si acabáis cenando por La Latina, buscad sitios con carta sin gluten certificada: hay varias opciones en el barrio y en la app de FACE (Federación de Asociaciones de Celíacos de España) podéis filtrar restaurantes seguros por zona. Preguntad siempre por la freidora compartida.',
  },
  {
    id: 'pedriza',
    short: 'La Pedriza',
    title: 'Senderismo en La Pedriza (Manzanares el Real)',
    category: 'madrid',
    emoji: '⛰️',
    budget: '€',
    driveTime: '50 min desde Madrid',
    description:
      'Ruta de mañana entre las rocas de granito de La Pedriza, con el castillo de Manzanares el Real y el embalse de Santillana de fondo. Comida de mochila en cualquier roca con vistas.',
    tips: [
      'MUY IMPORTANTE: el aparcamiento tiene aforo limitado y hay que reservar plaza online con antelación (web de la Comunidad de Madrid). En fin de semana se agota.',
      'Llegad temprano, sobre las 9:00, y en verano evitad las horas centrales.',
      'Ruta fácil: Camino Ancho hasta Charca Verde. Más exigente: El Yelmo.',
    ],
    glutenFree:
      'Llevad la comida hecha de casa y garantizáis el 100% sin gluten: bocatas con pan sin gluten, tortilla, fruta y frutos secos. En Manzanares el Real hay bares en la plaza, pero confirmad antes por teléfono si manejan producto sin gluten certificado; en pueblos pequeños no siempre es fiable.',
  },
  {
    id: 'escorial',
    short: 'El Escorial',
    title: 'El Escorial y la Silla de Felipe II',
    category: 'madrid',
    emoji: '🏰',
    budget: '€€',
    driveTime: '55 min desde Madrid',
    description:
      'Mañana paseando el casco histórico de San Lorenzo de El Escorial y la Casita del Príncipe, y por la tarde subir a la Silla de Felipe II para ver el monasterio desde arriba (esto es gratis y es lo mejor del día).',
    tips: [
      'El Monasterio tiene entrada gratuita para residentes en la UE en ciertas franjas de tarde: consultad la web de Patrimonio Nacional antes de ir.',
      'La Silla de Felipe II tiene aparcamiento propio y está a 5 min en coche del centro.',
      'Merienda en la plaza de la Constitución con vistas.',
    ],
    glutenFree:
      'En el pueblo hay bastantes restaurantes; buscad los adheridos a FACE o preguntad expresamente por carta sin gluten y freidora exclusiva. Alternativa segura: llevad la comida de casa y subid a la Silla de Felipe II a comer allí con vistas al monasterio.',
  },
  {
    id: 'rastro-brunch',
    short: 'Rastro',
    title: 'Rastro y Mercado de Motores + brunch en Malasaña',
    category: 'madrid',
    emoji: '🛍️',
    budget: '€€',
    driveTime: 'Sin coche: metro La Latina / Delicias',
    description:
      'Domingo de mercadillo: el Rastro por la mañana, o el Mercado de Motores en el Museo del Ferrocarril si cae en el fin de semana adecuado. Después, vermú o brunch por Malasaña.',
    tips: [
      'El Mercado de Motores es solo un fin de semana al mes: comprobad las fechas en su web.',
      'Al Rastro id antes de las 11:00 o será imposible andar.',
      'Poneos un tope de gasto antes de entrar; si no, se va de las manos.',
    ],
    glutenFree:
      'En Malasaña hay varios sitios sin gluten certificados de referencia en Madrid (Celicioso en Hortaleza para dulces, y varias hamburgueserías con pan sin gluten). Filtrad por "sin gluten certificado" en la app de FACE antes de elegir sitio y confirmad la freidora al reservar.',
  },
  {
    id: 'museo-gratis',
    short: 'Museo gratis',
    title: 'Museo gratis a última hora y paseo por el Paseo del Arte',
    category: 'madrid',
    emoji: '🖼️',
    budget: '€',
    driveTime: 'Sin coche: metro Atocha / Banco de España',
    description:
      'El Prado, el Reina Sofía y el Thyssen tienen franjas de entrada gratuita al final del día. Un par de horas de museo eligiendo cada uno 3 cuadros favoritos para explicárselos al otro, y paseo después.',
    tips: [
      'Consultad los horarios de gratuidad en la web oficial de cada museo: cambian y hay que llegar con margen de cola.',
      'El Reina Sofía suele estar menos saturado que el Prado en la franja gratuita.',
      'No intentéis verlo todo: elegid dos salas y disfrutadlas.',
    ],
    glutenFree:
      'Las cafeterías de los museos tienen opciones limitadas. Mejor cenad después: en la zona de Huertas/Las Letras hay restaurantes adheridos a FACE. Llevad encima una barrita o fruta por si el hambre aprieta antes.',
  },
  {
    id: 'purgatorio',
    short: 'Rascafría',
    title: 'Cascadas del Purgatorio y Monasterio de El Paular (Rascafría)',
    category: 'madrid',
    emoji: '💧',
    budget: '€',
    driveTime: '1 h 15 min desde Madrid',
    description:
      'Ruta circular fácil de unas 3 h por el bosque de Rascafría hasta la cascada, con parada en el Puente del Perdón y el Monasterio de El Paular. En otoño es espectacular.',
    tips: [
      'Aparcad en el área recreativa de Las Presillas: hay sitio y sale barato.',
      'En verano se puede uno bañar en las piscinas naturales de Las Presillas.',
      'Zapatillas con algo de agarre: el último tramo tiene piedra suelta.',
    ],
    glutenFree:
      'Comida de mochila hecha en casa es lo más seguro. En Rascafría pueblo hay restaurantes de cocina serrana: llamad antes para confirmar que ofrecen menú sin gluten real, porque las judiones y guisos suelen llevar harina para espesar.',
  },
  {
    id: 'aranjuez',
    short: 'Aranjuez',
    title: 'Jardines de Aranjuez y paseo junto al Tajo',
    category: 'madrid',
    emoji: '⛲',
    budget: '€',
    driveTime: '45 min desde Madrid',
    description:
      'Los Jardines del Príncipe y de la Isla son gratuitos y enormes: una mañana entera de paseo entre fuentes y plátanos centenarios, con el Palacio Real de fondo y el Tajo al lado.',
    tips: [
      'La entrada a los jardines es gratis; el palacio se paga aparte (y se puede saltar sin pena).',
      'Llevad la manta: hay zonas de césped perfectas para tumbarse.',
      'Los fresones de Aranjuez en temporada (primavera) son obligatorios.',
    ],
    glutenFree:
      'Los fresones con nata son sin gluten. Para comer, en el centro de Aranjuez hay varios restaurantes; preguntad por carta sin gluten y evitad los sitios donde solo ofrezcan "ensalada sin picatostes", que suele indicar que no controlan la contaminación cruzada.',
  },
  {
    id: 'chinchon',
    short: 'Chinchón',
    title: 'Chinchón: Plaza Mayor y merienda',
    category: 'madrid',
    emoji: '🍷',
    budget: '€€',
    driveTime: '50 min desde Madrid',
    description:
      'Media tarde en uno de los pueblos más bonitos de la Comunidad: la Plaza Mayor de balconadas de madera, el mirador del castillo y un paseo tranquilo por las calles empedradas.',
    tips: [
      'Aparcad en las afueras y subid andando: dentro es un laberinto.',
      'Ir un sábado a última hora de la tarde: menos gente y mejor luz para las fotos.',
      'El mirador junto al castillo es el mejor sitio para ver el atardecer.',
    ],
    glutenFree:
      'La cocina de Chinchón es muy de guisos y fritos (contaminación cruzada casi segura en freidora). Llamad antes al restaurante y preguntad expresamente si tienen freidora exclusiva sin gluten; si no, tirad de plancha (carne, verduras, huevos), vino de la zona y queso.',
  },
  {
    id: 'cerro-tio-pio',
    short: 'Tío Pío',
    title: 'Atardecer en el Cerro del Tío Pío',
    category: 'madrid',
    emoji: '🌆',
    budget: '€',
    driveTime: 'Sin coche: metro Buenos Aires',
    description:
      'El "parque de las siete tetas" de Vallecas: el mejor skyline de Madrid completamente gratis. Manta, algo de picar y ver cómo se enciende la ciudad.',
    tips: [
      'Subid a la colina del fondo, la que tiene la vista limpia de las torres.',
      'Llevad una chaqueta: aunque haga calor, ahí arriba corre el aire.',
      'Plan perfecto para media tarde de sábado sin gastar un euro.',
    ],
    glutenFree:
      'Al ser plan de manta, lleváis vosotros la comida y controláis todo: tostas de maíz, hummus, tortilla, fruta y una botella de vino. 100% seguro.',
  },
  {
    id: 'alcala',
    short: 'Alcalá',
    title: 'Alcalá de Henares: Cervantes, cigüeñas y Calle Mayor',
    category: 'madrid',
    emoji: '🕊️',
    budget: '€€',
    driveTime: '35 min desde Madrid',
    description:
      'Casco histórico Patrimonio de la Humanidad, la Casa Natal de Cervantes (entrada gratuita), la Universidad y la calle porticada más larga de España, con nidos de cigüeña por todas partes.',
    tips: [
      'La Casa Natal de Cervantes es gratis y se ve en 40 min.',
      'Aparcamiento gratuito en las afueras del casco y entrar andando.',
      'Las migas y las rosquillas de Alcalá son típicas, pero llevan gluten.',
    ],
    glutenFree:
      'Alcalá tiene bastante oferta de tapeo. Buscad establecimientos adheridos a FACE en la app antes de ir y avisad de la celiaquía al sentaros, no al pedir. Opción segura: tapeo de plancha, jamón, queso y tortilla, evitando croquetas y frituras.',
  },
  {
    id: 'madrid-rio',
    short: 'Madrid Río',
    title: 'Bici por Madrid Río y tarde en Matadero',
    category: 'madrid',
    emoji: '🚲',
    budget: '€',
    driveTime: 'Sin coche: metro Legazpi / Príncipe Pío',
    description:
      'Ruta en bici (vuestra o BiciMAD) por todo Madrid Río, de Príncipe Pío a Legazpi, y tarde en Matadero: exposiciones gratuitas, la Casa del Lector y la terraza.',
    tips: [
      'Casi todas las exposiciones de Matadero son gratuitas: mirad la programación de la semana.',
      'El tramo del Puente de Toledo es el más bonito para las fotos.',
      'En verano hay chorros de agua en la playa urbana: llevad toalla.',
    ],
    glutenFree:
      'En Matadero suele haber cafetería y food trucks en eventos; no siempre controlan el gluten. Lo seguro: llevad merienda o acercaos a Legazpi, donde hay más opciones de restaurante con carta sin gluten.',
  },

  {
    id: 'escape-room-madrid',
    short: 'Escape room',
    title: 'Escape room por Madrid',
    category: 'madrid',
    emoji: '🔐',
    budget: '€€',
    driveTime: 'Sin coche: hay salas por todo el centro',
    description:
      'Madrid es de las ciudades de Europa con más salas por habitante, así que hay para todos los gustos: misterio, terror, aventura o ciencia ficción. Una hora encerrados resolviendo acertijos y luego media hora comentando la jugada.',
    tips: [
      'Buscad expresamente salas diseñadas para 2 jugadores: las de 4 o 6 personas se hacen muy cuesta arriba a dos y acabáis tirando de pistas.',
      'Entre semana o a primera hora del día es bastante más barato, y en muchas salas os hacen precio de dos jugadores en vez de mínimo de tres.',
      'Pedid pistas sin vergüenza: el objetivo es pasarlo bien, no salir en el ranking.',
    ],
    glutenFree:
      'El juego en sí no implica comer, pero la costumbre es acabar cenando cerca. Mirad antes en la app de FACE los restaurantes adheridos de la zona de la sala y reservad avisando de la celiaquía: improvisar a las once de la noche es la peor idea.',
  },
  {
    id: 'bolera-recreativos',
    short: 'Bolera',
    title: 'Bolera y salón recreativo',
    category: 'madrid',
    emoji: '🎳',
    budget: '€€',
    driveTime: '20–30 min a cualquier centro comercial con bolera',
    description:
      'Partida de bolos con las barreras puestas si hace falta, y después las máquinas: air hockey, baloncesto, el simulador de coches y el de la garra que nunca coge nada. Una tarde entera por poco dinero.',
    tips: [
      'Entre semana y antes de las 18:00 la partida cuesta prácticamente la mitad.',
      'Llevad calcetines de casa: en muchas boleras te los cobran aparte con el alquiler de los zapatos.',
      'El que pierda paga el helado de la vuelta. Es la regla, no se discute.',
    ],
    glutenFree:
      'La comida de bolera es fritanga y pizza con freidora compartida: contaminación cruzada casi garantizada, así que mejor no comer allí. Cenad después en un sitio con carta sin gluten o llevad algo de casa para el momento del bajón.',
  },
  {
    id: 'rocodromo',
    short: 'Rocódromo',
    title: 'Rocódromo para principiantes',
    category: 'madrid',
    emoji: '🧗',
    budget: '€€',
    driveTime: 'Sin coche: hay rocódromos repartidos por toda la ciudad',
    description:
      'Escalada en bloque: sin cuerdas, sin arnés y sin saber nada. Se escala a poca altura sobre colchonetas y la entrada con alquiler de pies de gato ronda los 12–18 € por persona. Es el plan que más engancha de la lista.',
    tips: [
      'Id a media mañana o media tarde entre semana: por la noche se llenan de gente con abono y da corte estar empezando.',
      'Ropa cómoda y calcetines finos. No hace falta comprar absolutamente nada más el primer día.',
      'Empezad por los bloques del color más fácil aunque parezcan tontos, y calentad los dedos: las lesiones del primer día vienen todas de ahí.',
    ],
    glutenFree:
      'Llevad vuestra fruta o barritas de casa: las máquinas de vending de los rocódromos casi nunca tienen nada certificado y después de dos horas escalando el hambre aprieta de verdad.',
  },
  {
    id: 'estrellas-sierra',
    short: 'Estrellas',
    title: 'Noche de estrellas en la sierra',
    category: 'madrid',
    emoji: '🌌',
    budget: '€',
    driveTime: '1 h desde Madrid',
    description:
      'Subir de noche a la zona de Canencia, Navacerrada o el puerto de la Morcuera con dos mantas, un termo y una app de mapa estelar. Lejos de las luces de Madrid se ve la Vía Láctea a simple vista. Cuesta cero euros.',
    tips: [
      'Mirad la fase lunar antes de ir: con luna llena no se ve casi nada, con luna nueva se ve todo.',
      'Las mejores noches del año son las Perseidas (10–13 de agosto) y las Gemínidas (13–14 de diciembre).',
      'Abrigaos muchísimo más de lo que creéis, incluso en verano, y llevad una linterna con luz roja para no perder la visión nocturna.',
    ],
    glutenFree:
      'Termo de chocolate caliente y algo dulce hecho en casa: así es 100% seguro y además es la mitad del plan. Comprobad el sello del cacao soluble, que algunos llevan trazas.',
  },
  // ===================== ESCAPADAS DE FIN DE SEMANA ======================
  {
    id: 'segovia',
    short: 'Segovia',
    title: 'Segovia: acueducto, Alcázar y judiones',
    category: 'escapada',
    emoji: '🏛️',
    budget: '€€',
    driveTime: '1 h 10 min desde Madrid',
    description:
      'Finde clásico y barato: acueducto romano, callejear por la judería, el Alcázar (el castillo que inspiró el de Disney) y atardecer desde el mirador de la Pradera de San Marcos.',
    tips: [
      'Dormid en el casco antiguo si encontráis oferta; si no, un hostal a las afueras sale por 40–50 €.',
      'La subida a la torre del Alcázar cuesta poco y las vistas compensan.',
      'El mirador de la Pradera de San Marcos es gratis y tiene la mejor foto del Alcázar.',
    ],
    glutenFree:
      'El cochinillo es naturalmente sin gluten pero muchos asadores lo acompañan con salsas espesadas con harina: preguntad. En Segovia hay restaurantes adheridos a FACE (consultad la app o la web de la asociación de celíacos de Castilla y León). Reservad avisando de la celiaquía con antelación: en asadores tradicionales lo agradecen.',
  },
  {
    id: 'toledo',
    short: 'Toledo',
    title: 'Toledo: las tres culturas de noche',
    category: 'escapada',
    emoji: '🗡️',
    budget: '€€',
    driveTime: '1 h desde Madrid',
    description:
      'Toledo de noche, con las calles vacías y la ciudad iluminada, es otra cosa. Catedral, sinagoga del Tránsito, mirador del Valle y paseo por el puente de San Martín.',
    tips: [
      'La Pulsera Turística (unos 12 €) da acceso a 7 monumentos: sale mucho más a cuenta que entradas sueltas.',
      'Dormid dentro del casco: la ciudad de noche sin turistas es el verdadero plan.',
      'Aparcad en el Miradero o en Safont y usad las escaleras mecánicas.',
    ],
    glutenFree:
      'El mazapán de Toledo lleva solo almendra y azúcar (sin gluten) pero comprobad la obra y las variedades rellenas. Hay varios restaurantes con carta sin gluten en el casco; buscadlos en la app de FACE y reservad avisando. Las carcamusas suelen llevar harina, preguntad siempre.',
  },
  {
    id: 'cuenca',
    short: 'Cuenca',
    title: 'Cuenca: casas colgadas y Ciudad Encantada',
    category: 'escapada',
    emoji: '🪨',
    budget: '€€',
    driveTime: '2 h desde Madrid',
    description:
      'Sábado en el casco de Cuenca (casas colgadas, puente de San Pablo, hoz del Huécar) y domingo en la Ciudad Encantada, un bosque de rocas con formas imposibles a 30 min del centro.',
    tips: [
      'La foto clásica de las casas colgadas se hace desde el puente de San Pablo.',
      'La Ciudad Encantada cuesta unos 6 € por persona y se recorre en 1,5 h.',
      'Dormir en la parte baja de Cuenca es bastante más barato que en el casco alto.',
    ],
    glutenFree:
      'El morteruelo y el ajoarriero típicos suelen llevar pan: preguntad siempre. Cuenca tiene establecimientos adheridos a la asociación de celíacos de Castilla-La Mancha; consultad la app de FACE. Llevad barritas y algo de desayuno seguro para el hotel.',
  },
  {
    id: 'avila',
    short: 'Ávila',
    title: 'Ávila: muralla completa y chuletón',
    category: 'escapada',
    emoji: '🧱',
    budget: '€€',
    driveTime: '1 h 15 min desde Madrid',
    description:
      'Recorrer la muralla medieval mejor conservada de Europa por arriba, callejear el casco y ver el atardecer desde los Cuatro Postes, con toda la ciudad amurallada iluminada enfrente.',
    tips: [
      'La entrada a la muralla cuesta unos 5 € y los martes por la tarde suele ser gratuita: comprobad la web.',
      'Los Cuatro Postes están a 5 min en coche y son gratis: id justo al anochecer.',
      'Ávila es fría todo el año: llevad abrigo aunque en Madrid haga bueno.',
    ],
    glutenFree:
      'El chuletón de Ávila a la brasa es naturalmente sin gluten: comprobad solo que no lo acompañen con salsa harinosa y que las patatas no salgan de una freidora compartida. Las yemas de Santa Teresa son huevo y azúcar (aptas), pero confirmad la marca.',
  },
  {
    id: 'salamanca',
    short: 'Salamanca',
    title: 'Salamanca: Plaza Mayor y ambiente universitario',
    category: 'escapada',
    emoji: '🐸',
    budget: '€€',
    driveTime: '2 h 15 min desde Madrid',
    description:
      'La Plaza Mayor más bonita de España, buscar la rana de la fachada de la Universidad, subir a las torres de la Catedral (Ieronimus) y noche de ambiente joven y barato.',
    tips: [
      'Ieronimus (torres de la catedral) es la mejor entrada calidad-precio de la ciudad.',
      'Salamanca es ciudad universitaria: cenar y tomar algo sale muy barato.',
      'Al atardecer, cruzad al Puente Romano para la foto de postal.',
    ],
    glutenFree:
      'Salamanca tiene buena oferta sin gluten por ser ciudad universitaria (varias pizzerías y hamburgueserías con opción certificada). El hornazo tradicional lleva gluten. Consultad la app de FACE y reservad avisando.',
  },
  {
    id: 'gredos',
    short: 'Gredos',
    title: 'Sierra de Gredos: Laguna Grande y cabras montesas',
    category: 'escapada',
    emoji: '🏔️',
    budget: '€€',
    driveTime: '2 h 15 min desde Madrid',
    description:
      'Ruta desde la Plataforma de Gredos hasta la Laguna Grande (unas 5 h ida y vuelta, sin dificultad técnica) rodeados de cabras montesas, y noche en un pueblo de la zona como Hoyos del Espino o Navarredonda.',
    tips: [
      'La Plataforma tiene aparcamiento de pago y se llena: llegad antes de las 9:00.',
      'Llevad 2 litros de agua por persona: no hay fuentes en todo el recorrido.',
      'Casas rurales por 50–60 € la noche entre semana o fuera de temporada.',
    ],
    glutenFree:
      'Para la ruta, comida de mochila 100% controlada por vosotros. Para la cena, avisad a la casa rural con antelación: en alojamientos pequeños suelen adaptar el menú sin problema si lo sabéis pedir con tiempo. Llevad vuestro pan sin gluten para los desayunos.',
  },
  {
    id: 'hoces-duraton',
    short: 'Duratón',
    title: 'Hoces del Duratón, Sepúlveda y Pedraza',
    category: 'escapada',
    emoji: '🦅',
    budget: '€€',
    driveTime: '1 h 45 min desde Madrid',
    description:
      'Ruta a la ermita de San Frutos sobre el cañón del Duratón (con buitres leonados volando debajo de vosotros), comer en Sepúlveda y dormir en Pedraza, un pueblo medieval amurallado que de noche es una maravilla.',
    tips: [
      'La ruta a San Frutos es fácil y corta (1 h) pero el acceso en coche es por pista de tierra: id despacio.',
      'En Pedraza, las Noches de las Velas (julio) son espectaculares pero hay que sacar entrada.',
      'De marzo a julio hay tramos con acceso restringido por la cría de los buitres: comprobad antes.',
    ],
    glutenFree:
      'El cordero asado de Sepúlveda es sin gluten en sí mismo, pero confirmad con el asador que no usen harina en la salsa ni compartan freidora. Reservad por teléfono avisando de la celiaquía: los asadores de la zona están acostumbrados.',
  },
  {
    id: 'albarracin',
    short: 'Albarracín',
    title: 'Albarracín y los pinares de Teruel',
    category: 'escapada',
    emoji: '🟥',
    budget: '€€',
    driveTime: '3 h desde Madrid',
    description:
      'Uno de los pueblos más bonitos de España: casas rojizas colgadas de la roca, muralla, y alrededores de pinares y pinturas rupestres. Perfecto para un finde de desconexión total.',
    tips: [
      'Es un pueblo pequeño: con sábado tarde y domingo mañana lo veis con calma.',
      'El paseo por la muralla al atardecer es imprescindible y gratuito.',
      'Alojamiento más barato en Gea de Albarracín, a 10 min.',
    ],
    glutenFree:
      'Pueblo pequeño = menos opciones certificadas. Llamad al restaurante antes de reservar y llevad de casa desayuno y algún recambio (pan, galletas) por si acaso. El jamón de Teruel y los quesos son opciones seguras.',
  },
  {
    id: 'siguenza',
    short: 'Sigüenza',
    title: 'Sigüenza: castillo, catedral y el Doncel',
    category: 'escapada',
    emoji: '🛡️',
    budget: '€€',
    driveTime: '1 h 30 min desde Madrid',
    description:
      'Pueblo medieval tranquilísimo y poco turístico: catedral con el sepulcro del Doncel, castillo convertido en parador, plaza mayor porticada y calles empedradas en cuesta.',
    tips: [
      'Se puede entrar al patio del parador aunque no os alojéis allí.',
      'La visita guiada a la catedral merece mucho la pena y es barata.',
      'A 20 min está el Barranco del Río Dulce, con miradores preciosos.',
    ],
    glutenFree:
      'Sigüenza tiene varios restaurantes que trabajan bien el producto local. Avisad al reservar. Como siempre en pueblos, llevad desayuno propio y confirmad por teléfono antes de decidir dónde comer.',
  },
  {
    id: 'valencia-playa',
    short: 'Valencia',
    title: 'Valencia: playa, Ciudad de las Artes y paella',
    category: 'escapada',
    emoji: '🏖️',
    budget: '€€',
    driveTime: '3 h 30 min desde Madrid',
    description:
      'El finde más "de vacaciones" de la lista: playa de la Malvarrosa, paseo en bici por el antiguo cauce del Turia, Ciudad de las Artes y las Ciencias por fuera (gratis) y casco antiguo del Carmen.',
    tips: [
      'Salid el viernes por la tarde para exprimir el sábado entero.',
      'Recorrer el Turia en bici de alquiler es la mejor forma de ver la ciudad.',
      'El exterior de la Ciudad de las Artes es gratis y es lo más fotogénico.',
    ],
    glutenFree:
      'Buena noticia: la paella valenciana auténtica es naturalmente sin gluten (arroz, pollo, conejo, verduras, azafrán). Confirmad que no usen caldos con gluten ni colorantes con trazas y que la paella no se prepare en cocina compartida con rebozados. Valencia tiene mucha oferta certificada, incluidas horchaterías (la horchata y los fartons: la horchata sí, los fartons NO).',
  },
]

export const PLANS_BY_ID = Object.fromEntries(PLANS.map((p) => [p.id, p]))
