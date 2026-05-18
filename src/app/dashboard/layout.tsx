import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

/**
 * Dashboard layout — auth guard.
 * Redirects to /login?next=[currentPath] if not authenticated.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const headersList = await headers()
    const nextPath = headersList.get('x-pathname') ?? '/dashboard'
    redirect(`/login?next=${encodeURIComponent(nextPath)}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {children}
    </div>
  )
}
