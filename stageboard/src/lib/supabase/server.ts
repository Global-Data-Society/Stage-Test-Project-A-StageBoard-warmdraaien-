import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function supabaseServer() {
  const cookieStore = cookies()
  const cookieHeader = cookieStore ? cookieStore.toString() : ''

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { cookie: cookieHeader },
    },
  })
}


