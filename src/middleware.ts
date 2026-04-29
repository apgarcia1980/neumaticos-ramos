import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // ─── Refresca la sesión ───────────────────────────────────
  // IMPORTANTE: nunca mezclar lógica aquí con next-intl u otros
  // middlewares que modifiquen la request antes de Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresca el token — no usar getSession() aquí, usar getUser()
  const { data: { user } } = await supabase.auth.getUser()

  // ─── Protección de rutas /admin ───────────────────────────
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  if (isAdminRoute && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/auth/login'
    loginUrl.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ─── Redirige si ya está logueado e intenta entrar al login ─
  const isLoginRoute = request.nextUrl.pathname === '/auth/login'

  if (isLoginRoute && user) {
    const adminUrl = request.nextUrl.clone()
    adminUrl.pathname = '/admin'
    return NextResponse.redirect(adminUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas excepto:
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - archivos con extensión (png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}