"use client";

import ProductGrid from '@/components/products/productGrid';
import { Product } from '@/models/product/domain/product';
import { productRepository } from '@/models/product/infrastructure/productRepository';
import { useEffect, useState } from 'react';

function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productData = await productRepository.getAllProducts();
        setProducts(productData);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return <ProductGrid products={products} />;
}

export default ProductPage;