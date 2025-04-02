'use client'

import { ReactNode } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Header } from '@/components/layout/header';

export default function ShopLayout({ children }: { children: ReactNode }) {
  const { loading } = useUser();
   
  if (loading) {
    return <></>;
  }
  
  return (
    <div className="flex flex-col h-full">
        <Header />
        <main className="flex-grow">
            {children}
        </main>
    </div>);
}