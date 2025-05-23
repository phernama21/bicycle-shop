'use client'

import { useCart } from '@/contexts/CartContext';
import { useLoading } from '@/contexts/LoadingContext';
import { CartItem, CartItemOption } from '@/models/cart/domain/cart';
import { Product } from '@/models/product/domain/product';
import { productRepository } from '@/models/product/infrastructure/productRepository';
import { Rule } from '@/models/rule/domain/rule';
import { ruleRepository } from '@/models/rule/infrastructure/ruleRepository';
import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

export default function ProductCustomizer() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [rules, setRules] = useState<Rule[]>([]);
  const { startLoading, stopLoading, isLoading} = useLoading();
  const [selections, setSelections] = useState<Record<number, number>>({});
  const [validOptions, setValidOptions] = useState<Record<number, number[]>>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [optionPriceAdjustments, setOptionPriceAdjustments] = useState<Record<string, number>>({});
  const { addToCart, setCartOpen } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const productId = Number(id)
      startLoading();
      const prod = await productRepository.getProduct(productId);
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
      
      stopLoading()
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

  const handleBackClick = () => {
    router.push("/products");
  };

  const handleAddToCart = async () => {
    if (!product || !isConfigurationComplete()) return;
    
    const selectedOptions: CartItemOption[] = product.components.map(component => {
      if (component.id === undefined) return null;
      
      const selectedOptionId = selections[component.id];
      if (selectedOptionId === undefined) return null;
      
      const option = component.options.find(o => o.id === selectedOptionId);
      if (!option) return null;
      
      const price = getOptionDisplayPrice(component.id, selectedOptionId, option.basePrice);
      
      return {
        optionId: selectedOptionId,
        optionName: option.name,
        componentName: component.name,
        price: price
      };
    }).filter((item): item is CartItemOption => item !== null);
    
    const cartItem: CartItem = {
      product: product.id!,
      productName: product.name,
      price: totalPrice,
      quantity: 1,
      options: selectedOptions ,
      imageSrc: product.image_url
    };
    
    await addToCart(cartItem);
    setCartOpen(true);
    
    clearAllSelections();
    setTotalPrice(0);
  };
  
  if (isLoading || !product) return <></>;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 pt-2 sm:px-6 lg:px-8">
        <div className="flex items-center py-4">
          <button 
            onClick={handleBackClick}
            className="mr-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back to dashboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-indigo-600"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className='flex flex-col'>
            <h1 className="text-2xl font-bold text-indigo-600">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
          </div>
          
        </div>
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-indigo-600"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-2 text-sm text-indigo-600">Customize your product</span>
          </div>
        </div>
        
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
                  onClick={handleAddToCart}
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
              <h2 className="text-xl font-semibold">Customize Your {product.name}</h2>
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
    </div>
  );
}