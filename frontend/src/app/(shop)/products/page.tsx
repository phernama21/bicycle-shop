"use client";

import ProductGrid from '@/components/products/productGrid';
import { Product } from '@/models/product/domain/product';
import { productRepository } from '@/models/product/infrastructure/productRepository';
import { useLoading } from '@/contexts/LoadingContext';
import { useEffect, useState } from 'react';

function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const fetchProducts = async () => {
      startLoading();
      try {
        const productData = await productRepository.getAllProducts();
        setProducts(productData);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        stopLoading();
      }
    };

    fetchProducts();
  }, []);

  return <ProductGrid products={products} />;
}

export default ProductPage;