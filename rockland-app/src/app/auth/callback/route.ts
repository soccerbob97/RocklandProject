import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error_param = requestUrl.searchParams.get('error')

  if (error_param) {
    return NextResponse.redirect(new URL(`/auth/signin?error=${error_param}`, request.url))
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(new URL(`/auth/signin?error=${error.message}`, request.url))
    }
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
