import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * Admin layout — auth guard requiring at least content_moderator role.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/admin')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('admin_role')
    .eq('id', user.id)
    .single()

  const adminRoles = ['content_moderator', 'directory_admin', 'super_admin']
  if (!profile?.admin_role || !adminRoles.includes(profile.admin_role)) {
    redirect('/')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <nav aria-label="Admin navigation" className="flex gap-4 mb-8 text-sm font-medium border-b border-border-default pb-4">
        <a href="/admin" className="text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">Home</a>
        <a href="/admin/listings" className="text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">Listings</a>
        <a href="/admin/photos" className="text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">Photos</a>
      </nav>
      {children}
    </div>
  )
}
