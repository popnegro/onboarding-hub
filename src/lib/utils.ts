/**
 * Formatea fecha a formato localizado (es-AR)
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Formatea fecha con hora
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Calcula días desde una fecha
 */
export function daysSince(date: string | Date): number {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/**
 * Trunca texto a N caracteres
 */
export function truncate(text: string, length: number = 50): string {
  return text.length > length ? text.substring(0, length) + '...' : text
}

/**
 * Clase CSS condicional
 */
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Convierte array a Record por key
 */
export function arrayToRecord<T extends Record<string, any>>(
  array: T[],
  key: keyof T
): Record<string, T> {
  return array.reduce((acc, item) => {
    acc[String(item[key])] = item
    return acc
  }, {} as Record<string, T>)
}
