'use client'

import { ReactNode } from 'react';
import { useUser } from '@/contexts/UserContext';
import { CartProvider } from '@/contexts/CartContext';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { loading } = useUser();
   
  if (loading) {
    return <></>;
  }
  
  return (
        <CartProvider>
            {children}
        </CartProvider>
  )
}