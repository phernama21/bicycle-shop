'use client';

import { Cart, CartItem } from '@/models/cart/domain/cart';
import { cartRepository } from '@/models/cart/infrastructure/cartRepository';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAlert } from './AlertContext';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateCartItemQuantity: (itemId: number, quantity: number) => Promise<void>;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const { showAlert } = useAlert();

  
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      const fetchedCart = await cartRepository.getCart();
      if (fetchedCart) {
        setCart(fetchedCart);
      } else {
        setCart({
          status: 'active',
          items: []
        });
      }
      setLoading(false);
    };
    
    fetchCart();
  }, []);
  
  const addToCart = async (item: CartItem) => {
    setLoading(true);
    const updatedCart = await cartRepository.addToCart(item);
    if (updatedCart) {
      setCart(updatedCart);
    }
    setLoading(false);
  };
  
  const removeFromCart = async (itemId: number) => {
    setLoading(true);
    const updatedCart = await cartRepository.removeFromCart(itemId);
    if (updatedCart) {
      setCart(updatedCart);
      showAlert('success', 'Success!', 'Product removed successfully.');
    }
    setLoading(false);
  };

  const updateCartItemQuantity = async (itemId: number, quantity: number) => {
    setLoading(true);
    const updatedCart = await cartRepository.updateCartItemQuantity(itemId, quantity);
    if (updatedCart) {
      setCart(updatedCart);
      showAlert('success', 'Success!', 'Quantity updated successfully.');
    }
    setLoading(false);
  };
    
  const cartTotal = cart?.items.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  ) || 0;
  
  return (
    <CartContext.Provider value={{
      cart,
      loading,
      cartOpen,
      setCartOpen,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};