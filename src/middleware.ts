import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabasePublicConfig } from './lib/supabase/config'

const isProtectedPath = (pathname: string) =>
  pathname === '/dashboard' || pathname.startsWith('/dashboard/') ||
  pathname === '/clients' || pathname.startsWith('/clients/') ||
  pathname === '/content' || pathname.startsWith('/content/')

function redirectWithCookies(request: NextRequest, response: NextResponse, pathname: string, nextPath?: string) {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  url.search = ''
  if (nextPath) url.searchParams.set('next', nextPath)
  const redirect = NextResponse.redirect(url)
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie))
  return redirect
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const protectedPath = isProtectedPath(pathname)
  const supabaseConfig = getSupabasePublicConfig({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  })

  // Fail closed: private screens stay unavailable until Supabase Auth is configured.
  if (!supabaseConfig) {
    if (protectedPath) return redirectWithCookies(request, NextResponse.next({ request }), '/login', pathname)
    return NextResponse.next({ request })
  }

  let response = NextResponse.next({ request })
  const supabase = createServerClient(supabaseConfig.url, supabaseConfig.key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  if (protectedPath && !user) return redirectWithCookies(request, response, '/login', pathname)
  if (pathname === '/login' && user) return redirectWithCookies(request, response, '/dashboard')
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
