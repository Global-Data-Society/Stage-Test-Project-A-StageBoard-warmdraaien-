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

  return <p>logging out...</p>
}
