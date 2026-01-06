import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

// Сіздің админ панеліңіздің навигациясы немесе негізгі компоненттері
// import AdminSidebar from '@/components/admin/admin-sidebar'; 
// import AdminHeader from '@/components/admin/admin-header';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Егер сессия болмаса, кіру бетіне жіберу
  if (!session) {
    redirect('/admin/login');
  }

  // Пайдаланушының админ екенін 'admin_users' кестесінен тексеру
  // Рөлдер: 'SUPER_ADMIN', 'CITY_ADMIN', 'CAFE_ADMIN'
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('role')
    .eq('email', session.user.email!) 
    .single();

  // Егер 'admin_users' кестесінде жазба болмаса, негізгі бетке жіберу
  if (!adminUser) {
    redirect('/');
  }

  return (
    <div className="admin-layout flex">
      {/* <AdminSidebar />  <-- Админ панеліңіздің сол жақ мәзірін осында қосыңыз */}
      <main className="flex-1 p-4">
        {/* <AdminHeader /> <-- Админ панеліңіздің жоғарғы бөлігін осында қосыңыз */}
        {children}
      </main>
    </div>
  );
}
