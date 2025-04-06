'use client'

import { ReactNode } from 'react';
import { useUser } from '@/contexts/UserContext';
import { CartProvider } from '@/contexts/CartContext';
import CartComponent from '@/components/carts/cart';

export default function ProductsLayout({ children }: { children: ReactNode }) {
  const { loading } = useUser();
   
  if (loading) {
    return <></>;
  }
  
  return (
        <CartProvider>
            {children}
            <CartComponent />
        </CartProvider>
  )
}