'use client';

import { useState, useEffect } from 'react';
import { Product} from '@/models/product/domain/product';
import { productRepository } from '@/models/product/infrastructure/productRepository';
import { useParams, useRouter } from "next/navigation";
import ComponentCard from '@/components/products/componentCard';
import { useAlert } from '@/contexts/AlertContext';
import { Component } from '@/models/component/domain/component';
import { Option } from '@/models/option/domain/option';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const router = useRouter();
  const { showAlert } = useAlert();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        loadProduct();
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productId = Number(id)
      const data = await productRepository.getProduct(productId);
      setProduct(data);
      setLoading(false);
    } catch (error) {
      showAlert('error', 'Load Error', 'Failed to load product data.');
      setLoading(false);
    }
  };

  const handleProductChange = (field: keyof Product, value: string) => {
    if (!product) return;
    setProduct({ ...product, [field]: value });
    setIsDirty(true);
  };

  const handleComponentChange = (componentIndex: number, field: keyof Component, value: any) => {
    if (!product) return;
    const updatedComponents = [...product.components];
    updatedComponents[componentIndex] = { 
      ...updatedComponents[componentIndex], 
      [field]: value 
    };
    setProduct({ ...product, components: updatedComponents });
    setIsDirty(true);
  };

  const handleOptionChange = (componentIndex: number, optionIndex: number, field: keyof Option, value: any) => {
    if (!product) return;
    const updatedComponents = [...product.components];
    const updatedOptions = [...updatedComponents[componentIndex].options];
    
    updatedOptions[optionIndex] = { 
      ...updatedOptions[optionIndex], 
      [field]: field === 'basePrice' ? parseFloat(value) : value 
    };
    
    updatedComponents[componentIndex] = {
      ...updatedComponents[componentIndex],
      options: updatedOptions
    };
    
    setProduct({ ...product, components: updatedComponents });
    setIsDirty(true);
  };

  const addComponent = () => {
    if (!product) return;
    const newComponent: Component = {
      name: '',
      description: '',
      required: false,
      options: []
    };
    setProduct({ ...product, components: [...product.components, newComponent] });
    setIsDirty(true);
  };

  const removeComponent = (index: number) => {
    if (!product) return;
    const updatedComponents = [...product.components];
    if (updatedComponents[index].id) {
      updatedComponents[index] = { ...updatedComponents[index], _destroy: true };
      setProduct({ ...product, components: updatedComponents });
    } else {
      updatedComponents.splice(index, 1);
      setProduct({ ...product, components: updatedComponents });
    }
    setIsDirty(true);
  };

  const addOption = (componentIndex: number) => {
    if (!product) return;
    const updatedComponents = [...product.components];
    const newOption: Option = {
      name: '',
      description: '',
      basePrice: 0,
      inStock: true
    };
    
    updatedComponents[componentIndex] = {
      ...updatedComponents[componentIndex],
      options: [...updatedComponents[componentIndex].options, newOption]
    };
    
    setProduct({ ...product, components: updatedComponents });
    setIsDirty(true);
  };

  const removeOption = (componentIndex: number, optionIndex: number) => {
    if (!product) return;
    const updatedComponents = [...product.components];
    const updatedOptions = [...updatedComponents[componentIndex].options];
    
    if (updatedOptions[optionIndex].id) {
      updatedOptions[optionIndex] = { 
        ...updatedOptions[optionIndex], 
        _destroy: true 
      };
    } else {
      updatedOptions.splice(optionIndex, 1);
    }
    
    updatedComponents[componentIndex] = {
      ...updatedComponents[componentIndex],
      options: updatedOptions
    };
    
    setProduct({ ...product, components: updatedComponents });
    setIsDirty(true);
  };

  const handleBackClick = () => {
    router.push("/admin/products");
  };

  const handleSubmit = async () => {
    if (!product) return;
    
    try {
      await productRepository.updateProduct(product);
      setIsDirty(false);
      showAlert('success', 'Success!', 'Product updated successfully.');
      loadProduct();
    } catch (error) {
      console.error("Error updating product:", error);
      showAlert('error', 'Update Failed', 'Failed to update product. Please try again.');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!product) return <div className="p-4">Product not found</div>;

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="flex flex-col pt-5 rounded-lg sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center">
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
          <h1 className="text-2xl font-bold text-indigo-600">Product</h1>
        </div>
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-indigo-600"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 px-2 text-sm text-indigo-600">Product Management</span>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => handleProductChange('name', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={product.description || ''}
            onChange={(e) => handleProductChange('description', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows={3}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-indigo-600">Components</h2>
          <button
            onClick={addComponent}
            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 flex items-center justify-center"
            aria-label="Add Component"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
        
        {product.components.filter(comp => !comp._destroy).map((component, cIndex) => (
          <ComponentCard
            key={component.id || `new-${cIndex}`}
            component={component}
            index={cIndex}
            onComponentChange={handleComponentChange}
            onRemoveComponent={() => removeComponent(cIndex)}
            onAddOption={() => addOption(cIndex)}
            onOptionChange={handleOptionChange}
            onRemoveOption={removeOption}
          />
        ))}
        
        {product.components.filter(comp => !comp._destroy).length === 0 && (
          <p className="text-gray-500 italic">No components added yet.</p>
        )}
      </div>
      
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          disabled={!isDirty}
          className={`px-6 py-3 rounded-lg font-medium ${
            isDirty ? 'bg-indigo-600 text-white hover:bg-indigo800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;