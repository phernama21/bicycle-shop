'use client';

import { useCart } from '@/contexts/CartContext';
import React, { useEffect } from 'react';

const CartComponent: React.FC = () => {
  const { 
    cart, 
    cartOpen, 
    cartTotal,
    setCartOpen, 
    removeFromCart, 
    updateCartItemQuantity,
    createOrder,
  } = useCart();
  
  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [cartOpen]);
  
  if (!cart) return null;

 
  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      await updateCartItemQuantity(itemId, newQuantity);
    } else {
      await removeFromCart(itemId);
    }
  };
  
  return (
    <>
      {cartOpen && (
        <div className="relative z-10">
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity"></div>
          
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <div className="pointer-events-auto w-screen max-w-md transform transition ease-in-out duration-500">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    <div className="flex-1 px-4 py-6 sm:px-6 overflow-y-auto">
                      <div className="flex items-start justify-between">
                        <h2 className="text-lg font-medium text-gray-900">Shopping cart</h2>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            onClick={() => setCartOpen(false)}
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                          >
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Close panel</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <div className="flow-root">
                          <ul className="-my-6 divide-y divide-gray-200">
                            {cart.items.map((item) => (
                              <li key={item.id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img src={`${process.env.NEXT_PUBLIC_API_HOST}${item.imageSrc}`} alt="Product" className="h-full w-full object-cover object-center" />
                                </div>
                                
                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>{item.productName}</h3>
                                      <p className="ml-4">€{item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-500">
                                      {item.options.map((option, idx) => (
                                        <p key={idx}>{option.componentName}: {option.optionName}</p>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="flex items-center">
                                      <span className="text-gray-500 mr-2">Qty</span>
                                      <div className="flex items-center border rounded">
                                        <button
                                          type="button"
                                          onClick={() => item.id && handleQuantityChange(item.id, item.quantity - 1)}
                                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                        >
                                          -
                                        </button>
                                        <span className="px-2 py-1">{item.quantity}</span>
                                        <button
                                          type="button"
                                          onClick={() => item.id && handleQuantityChange(item.id, item.quantity + 1)}
                                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                    
                                    <div className="flex">
                                      <button
                                        type="button"
                                        onClick={() => item.id && removeFromCart(item.id)}
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>€{cartTotal.toFixed(2)}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                      <div className="mt-6">
                        <button
                          onClick={createOrder}
                          className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                          Checkout
                        </button>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or{' '}
                          <button
                            type="button"
                            onClick={() => setCartOpen(false)}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {cart.items.length > 0 && !cartOpen && (
        <button 
          onClick={() => setCartOpen(true)}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cart.items.length}
          </span>
        </button>
      )}
    </>
  );
};

export default CartComponent;