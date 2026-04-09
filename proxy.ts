import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const adminMatcher = /^\/admin(\/.*)?$/

export async function proxy(request: NextRequest) {
  const response = NextResponse.next()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    return response
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
          response.cookies.set(name, value, options)
        })
      }
    }
  })

  const { data } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isAdminRoute = adminMatcher.test(pathname)
  const isLoginRoute = pathname === '/admin/login'

  if (isAdminRoute && !isLoginRoute && !data.user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (isLoginRoute && data.user) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*']
}
