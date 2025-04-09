'use client'

import { ReactNode, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Header } from '@/components/layout/header';
import { useRouter } from 'next/navigation';

export default function ShopLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();
    const router = useRouter();
    
    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);
   
  if (loading || !user) {
    return <></>;
  }
  
  return (
    <div className="flex flex-col h-full">
        <Header />
        <main className="flex-grow">
            {children}
        </main>
    </div>
);
}