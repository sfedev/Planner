import { useEffect, useState } from 'react'

export function useMediaQuery(query) {
  const [coincide, setCoincide] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const revisar = () => setCoincide(mq.matches)

    revisar()
    mq.addEventListener('change', revisar)
    // Respaldo: algunos navegadores (y el modo de emulación de móvil de las
    // herramientas de desarrollo) no disparan el evento `change` al cambiar
    // el tamaño de la ventana.
    window.addEventListener('resize', revisar)
    window.addEventListener('orientationchange', revisar)

    return () => {
      mq.removeEventListener('change', revisar)
      window.removeEventListener('resize', revisar)
      window.removeEventListener('orientationchange', revisar)
    }
  }, [query])

  return coincide
}

// Mismo corte que el breakpoint `sm` de Tailwind
export const useEsMovil = () => useMediaQuery('(max-width: 639px)')
