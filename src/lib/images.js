// Redimensiona y comprime las fotos antes de subirlas: los móviles hacen
// fotos de 5-8 MB y con 1600 px de lado largo se ve igual de bien ocupando
// una décima parte (y la subida es instantánea con datos móviles).

const MAX_SIDE = 1600
const QUALITY = 0.82

export function compressImage(file, maxSide = MAX_SIDE, quality = QUALITY) {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) return resolve(file)

    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
      if (scale === 1 && file.size < 900 * 1024) return resolve(file)

      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => resolve(blob && blob.size < file.size ? blob : file),
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(file)
    }

    img.src = url
  })
}
