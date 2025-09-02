'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseClient } from '@/lib/supabase/client'

export default function LogoutPage() {
    const router = useRouter()

    useEffect(() => {
        async function logoutUser() {
            await supabaseClient.auth.signOut()
            router.push('/login')
        }

        logoutUser()
    }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-medium">logging out...</p>
    </div> 
  )
}
