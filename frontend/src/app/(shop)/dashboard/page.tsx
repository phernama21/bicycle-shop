'use client'

import { Product } from '@/models/product/domain/product';
import { productRepository } from '@/models/product/infrastructure/productRepository';
import { Rule } from '@/models/rule/domain/rule';
import { ruleRepository } from '@/models/rule/infrastructure/ruleRepository';
import React, { useState, useEffect } from 'react';

export default function ProductCustomizer() {
  const [product, setProduct] = useState<Product | null>(null);
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<Record<number, number>>({});
  const [validOptions, setValidOptions] = useState<Record<number, number[]>>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [optionPriceAdjustments, setOptionPriceAdjustments] = useState<Record<string, number>>({});
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const prod = await productRepository.getProduct();
      const allRules = await ruleRepository.getAllRules();
      setProduct(prod);
      setRules(allRules);
      
      if (prod) {
        const initialValidOptions: Record<number, number[]> = {};
        prod.components.forEach(component => {
          if (component.id !== undefined) {
            initialValidOptions[component.id] = component.options
              .filter(option => option.inStock)
              .map(option => option.id!)
              .filter(id => id !== undefined);
          }
        });
        setValidOptions(initialValidOptions);
      }
      
      setLoading(false);
    };
    
    fetchData();
  }, []);
  
  useEffect(() => {
    if (!product) return;
    
    const newValidOptions: Record<number, number[]> = {};
    product.components.forEach(component => {
      if (component.id !== undefined) {
        newValidOptions[component.id] = component.options
          .filter(option => option.inStock)
          .map(option => option.id!)
          .filter(id => id !== undefined);
      }
    });
    
    const newPriceAdjustments: Record<string, number> = {};
    
    if (Object.keys(selections).length > 0) {
      rules.forEach(rule => {
        const conditionComponentId = rule.componentCondition?.id;
        const conditionOptionId = rule.optionCondition?.id;
        const effectComponentId = rule.componentEffect?.id;
        const effectOptionId = rule.optionEffect?.id;
        
        if (
          conditionComponentId !== undefined && 
          conditionOptionId !== undefined && 
          effectComponentId !== undefined && 
          effectOptionId !== undefined &&
          selections[conditionComponentId] === conditionOptionId
        ) {
          if (rule.effectType === "require") {
            newValidOptions[effectComponentId] = [effectOptionId];
          } else if (rule.effectType === "exclude") {
            newValidOptions[effectComponentId] = newValidOptions[effectComponentId]
              .filter(id => id !== effectOptionId);
          } else if (rule.effectType === "conditional_price") {
            const adjustmentKey = `${effectComponentId}-${effectOptionId}`;
            newPriceAdjustments[adjustmentKey] = rule.priceAdjustment;
          }
        }
      });
      
      Object.keys(selections).forEach(componentIdStr => {
        const componentId = Number(componentIdStr);
        if (
          newValidOptions[componentId] && 
          !newValidOptions[componentId].includes(selections[componentId])
        ) {
          setSelections(prev => ({
            ...prev,
            [componentId]: newValidOptions[componentId][0]
          }));
        }
      });
    }
    
    setValidOptions(newValidOptions);
    setOptionPriceAdjustments(newPriceAdjustments);
    calculatePrice(newPriceAdjustments);
  }, [selections, rules, product]);
  
  const calculatePrice = (priceAdjustments = optionPriceAdjustments) => {
    if (!product || Object.keys(selections).length === 0) {
      setTotalPrice(0);
      return;
    }
    
    let price = 0;
    
    Object.entries(selections).forEach(([componentIdStr, optionId]) => {
      const componentId = Number(componentIdStr);
      const component = product.components.find(c => c.id === componentId);
      if (!component) return;
      
      const option = component.options.find(o => o.id === optionId);
      if (!option) return;
      
      const adjustmentKey = `${componentId}-${optionId}`;
      if (adjustmentKey in priceAdjustments) {
        price += priceAdjustments[adjustmentKey];
      } else {
        price += option.basePrice;
      }
    });
    
    setTotalPrice(price);
  };
  
  const handleSelect = (componentId: number, optionId: number) => {
    if (selections[componentId] === optionId) {
      const component = product?.components.find(c => c.id === componentId);
      if (component) {
        setSelections(prev => {
          const updated = { ...prev };
          delete updated[componentId];
          return updated;
        });
      }
    } else {
      setSelections(prev => ({
        ...prev,
        [componentId]: optionId
      }));
    }
  };
  
  const clearAllSelections = () => {
    setSelections({});
  };
  
  const isConfigurationComplete = () => {
    if (!product) return false;
    
    const requiredComponents = product.components.filter(c => c.required);
    return requiredComponents.every(component => 
      component.id !== undefined && 
      selections[component.id] !== undefined && 
      selections[component.id] !== null
    );
  };
  
  const addToCart = () => {
    if (!product || !isConfigurationComplete()) return;
    
    const selectedOptions = product.components.map(component => {
      if (component.id === undefined) return null;
      
      const selectedOptionId = selections[component.id];
      const option = component.options.find(o => o.id === selectedOptionId);
      return option ? `${component.name}: ${option.name}` : null;
    }).filter(Boolean);
    
    const cartItem = {
      id: Date.now(),
      name: product.name,
      price: totalPrice.toFixed(2),
      options: selectedOptions,
      imageSrc: "/api/placeholder/400/320",
      quantity: 1
    };
    
    setCart(prev => [...prev, cartItem]);
    setCartOpen(true);
    
    clearAllSelections();
    setTotalPrice(0)
  };
  
  const removeFromCart = (itemId: number) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };
  
  const cartTotal = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  
  const getOptionDisplayPrice = (componentId: number, optionId: number, basePrice: number) => {
    const adjustmentKey = `${componentId}-${optionId}`;
    if (adjustmentKey in optionPriceAdjustments) {
      return optionPriceAdjustments[adjustmentKey];
    }
    return basePrice;
  };
  
  const hasAdjustedPrice = (componentId: number, optionId: number) => {
    const adjustmentKey = `${componentId}-${optionId}`;
    return adjustmentKey in optionPriceAdjustments;
  };
  
  if (loading || !product) return <div className="p-4">Loading...</div>;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{product.name}</h1>
        <p className="text-gray-600 mb-8">{product.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="aspect-square bg-gray-100 flex flex-col p-4 rounded mb-4 overflow-y-auto">
              {Object.keys(selections).length > 0 ? (
                <>
                  {product.components.map(component => {
                    if (component.id === undefined) return null;
                    const selectedOptionId = selections[component.id];
                    if (selectedOptionId === undefined || selectedOptionId === null) return null;
                    
                    const option = component.options.find(o => o.id === selectedOptionId);
                    if (!option) return null;
                    
                    const price = getOptionDisplayPrice(component.id, selectedOptionId, option.basePrice);
                    const hasAdjusted = hasAdjustedPrice(component.id, selectedOptionId);
                    
                    return (
                      <div key={component.id} className="mb-2 border-b pb-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{component.name}</span>
                          <span className={`${hasAdjusted ? 'text-green-600' : 'text-gray-900'}`}>
                            €{price.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-gray-700">{option.name}</div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="text-gray-500 flex items-center justify-center h-full">
                  No options selected yet
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">Total: €{totalPrice.toFixed(2)}</p>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={addToCart}
                  disabled={!isConfigurationComplete()}
                  className={`flex-1 py-3 px-4 rounded-md ${
                    isConfigurationComplete()
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-gray-300 cursor-not-allowed text-gray-500'
                  } transition-colors duration-200`}
                >
                  {isConfigurationComplete() ? 'Add to Cart' : 'Complete Selection'}
                </button>
                
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
            <div className='flex justify-between items-center mb-6'>
              <h2 className="text-xl font-semibold">Customize Your Bicycle</h2>
              {Object.keys(selections).length > 0 && 
                <button
                    onClick={clearAllSelections}
                    className="text-md text-red-600 hover:text-red-800 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear
                </button>
              }
              
            </div>
            
            {product.components.map((component) => (
              <div key={component.id ?? `comp-${component.name}`} className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {component.name}
                    {component.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 mb-3">{component.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {component.options.map((option) => {
                    const componentId = component.id;
                    const optionId = option.id;
                    
                    if (componentId === undefined || optionId === undefined) return null;
                    
                    const isValid = validOptions[componentId]?.includes(optionId);
                    const isSelected = selections[componentId] === optionId;
                    const isDisabled = !isValid || !option.inStock;
                    const hasAdjusted = hasAdjustedPrice(componentId, optionId);
                    const displayPrice = getOptionDisplayPrice(componentId, optionId, option.basePrice);
                    
                    return (
                      <div
                        key={optionId ?? `opt-${option.name}`}
                        onClick={() => !isDisabled && handleSelect(componentId, optionId)}
                        className={`p-4 border rounded-md cursor-pointer transition-all ${
                          isDisabled
                            ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                            : isSelected
                            ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{option.name}</h4>
                            <p className="text-sm text-gray-500">{option.description}</p>
                          </div>
                          <span className={`font-medium ${hasAdjusted ? 'text-green-600' : 'text-gray-900'}`}>
                            €{displayPrice.toFixed(2)}
                            {hasAdjusted && option.basePrice !== displayPrice && (
                              <span className="text-xs line-through ml-1 text-gray-500">
                                €{option.basePrice.toFixed(2)}
                              </span>
                            )}
                          </span>
                        </div>
                        {!option.inStock && (
                          <span className="inline-block mt-2 text-sm text-red-600">Out of stock</span>
                        )}
                        {isSelected && (
                          <div className="mt-2 text-xs text-indigo-600">
                            Click again to remove
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {cartOpen && (
        <div className="relative z-10">
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity"></div>
          
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <div className="pointer-events-auto w-screen max-w-md transform transition ease-in-out duration-500">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
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
                            {cart.map((item) => (
                              <li key={item.id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img src={item.imageSrc} alt="Product" className="h-full w-full object-cover object-center" />
                                </div>
                                
                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>{item.name}</h3>
                                      <p className="ml-4">€{item.price}</p>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-500">
                                      {item.options.map((option: string, idx: number) => (
                                        <p key={idx}>{option}</p>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">Qty {item.quantity}</p>
                                    
                                    <div className="flex">
                                      <button
                                        type="button"
                                        onClick={() => removeFromCart(item.id)}
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
                        <a
                          href="#"
                          className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                          Checkout
                        </a>
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
      
      {cart.length > 0 && !cartOpen && (
        <button 
          onClick={() => setCartOpen(true)}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cart.length}
          </span>
        </button>
      )}
    </div>
  );
}