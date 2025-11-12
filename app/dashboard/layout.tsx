import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Header from '@/components/layout/Header'
import OfflineIndicator from '@/components/layout/OfflineIndicator'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Create Supabase client with async cookies
  const supabase = createServerComponentClient({ cookies });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Header user={session.user} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8">
            {children}
          </div>
        </div>
      </main>
      
      <OfflineIndicator />
      
      {/* Optional: Footer */}
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-12">
        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Your App. All rights reserved.
        </div>
      </footer>
    </div>
  )
}