export function getSafeRedirectPath(candidate?: string | null): string {
  if (!candidate || !candidate.startsWith('/') || candidate.startsWith('//') || candidate.startsWith('/login')) return '/dashboard'
  return candidate
}
