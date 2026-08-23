// Traduce los errores crudos de Supabase a algo que se entienda y que diga
// qué hay que hacer. Los tres de abajo son los que salen al configurar el
// proyecto por primera vez.

export function mensajeDeError(err) {
  const texto = err?.message ?? 'Ha fallado la conexión con Supabase.'
  const codigo = err?.code

  // Las tablas todavía no existen: falta ejecutar el esquema.
  if (codigo === 'PGRST205' || /schema cache/i.test(texto)) {
    return 'Las tablas todavía no existen en Supabase. Abre el panel → SQL Editor → New query, pega ahí el contenido de supabase/schema.sql y dale a Run.'
  }

  // El email de la sesión no está en la lista blanca de es_pareja().
  if (codigo === '42501' || /row-level security/i.test(texto)) {
    return 'Tu correo no está autorizado. Revisa que el email con el que has entrado esté en la función es_pareja() de supabase/schema.sql y vuelve a ejecutarla.'
  }

  // El bucket de fotos no existe (esquema ejecutado a medias).
  if (/bucket not found/i.test(texto)) {
    return 'Falta el almacén de fotos. Vuelve a ejecutar supabase/schema.sql entero: el bloque 4 es el que crea el bucket «recuerdos».'
  }

  if (/Failed to fetch|NetworkError/i.test(texto)) {
    return 'No se ha podido conectar con Supabase. Comprueba tu conexión y que la URL del proyecto sea correcta.'
  }

  return texto
}
