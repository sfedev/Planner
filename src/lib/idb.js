// Mini-wrapper de IndexedDB para guardar las fotos en "modo local"
// (localStorage se queda corto en cuanto subís cuatro fotos).

const DB_NAME = 'ruleta-planes'
const STORE = 'fotos'

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function tx(mode, fn) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const t = db.transaction(STORE, mode)
        const req = fn(t.objectStore(STORE))
        t.oncomplete = () => resolve(req?.result)
        t.onerror = () => reject(t.error)
      })
  )
}

export const putBlob = (key, blob) => tx('readwrite', (s) => s.put(blob, key))
export const getBlob = (key) => tx('readonly', (s) => s.get(key))
export const delBlob = (key) => tx('readwrite', (s) => s.delete(key))
