// src/app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';

const ADMIN_ROLES = ['staff', 'admin', 'super_admin'];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  console.log('=== ADMIN LAYOUT DEBUG ===');
  console.log('User:', user?.email);
  console.log('User ID:', user?.id);
  console.log('User Error:', userError);
  
  if (!user) {
    console.log('No user - redirecting to login');
    redirect('/login?redirect=/admin');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  console.log('Profile:', profile);
  console.log('Profile Error:', profileError);
  console.log('Role:', profile?.role);
  console.log('Is admin role?:', profile?.role && ADMIN_ROLES.includes(profile.role));
  console.log('=== END DEBUG ===');

  if (!profile?.role || !ADMIN_ROLES.includes(profile.role)) {
    console.log('Not admin - redirecting to dashboard');
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="lg:pl-72">
        <AdminHeader user={user} />
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}