'use client'

import { ReactNode } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();
  const { viewMode } = useNavigation();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && user && !user.isAdmin) {
      router.push('/dashboard');
    } else if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return user.isAdmin ? <div className="bg-gray-50 py-5 h-full">
                          <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                            {children}
                          </div>
                        </div> : null;
}