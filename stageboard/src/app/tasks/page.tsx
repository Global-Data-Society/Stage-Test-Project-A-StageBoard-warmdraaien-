import { supabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TasksPage() {
  const {
    data: { user },
  } = await supabaseServer.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Tasks</h1>
    </main>
  )
}
