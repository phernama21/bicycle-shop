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
    // Only redirect if we're sure the user is not an admin
    if (!loading && user && !user.isAdmin) {
      router.push('/dashboard');
    } else if (!loading && !user) {
      // If not authenticated at all, redirect to login
      router.push('/login');
    }
  }, [user, loading, router]);
  
  // Show loading during authentication check
  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // Only render children if user is admin
  return user.isAdmin ? <>{children}</> : null;
}