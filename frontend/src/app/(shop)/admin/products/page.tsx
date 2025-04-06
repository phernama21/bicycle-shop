"use client";

import { Product } from "@/models/product/domain/product";
import { productRepository } from "@/models/product/infrastructure/productRepository";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/ui/searchBar";
import Pagination from "@/components/ui/pagination";

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const allProducts = await productRepository.getAllProducts();
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = products.filter(
        product => 
          product.name.toLowerCase().includes(term)
      );
      setFilteredProducts(filtered);
    }
    setCurrentPage(1); 
  }, [searchTerm, products]);

  const handleProductClick = (productId: number) => {
    router.push(`products/${productId}`);
  };
  
  const handleBackClick = () => {
    router.push("/admin/dashboard");
  };
  
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col bg-white py-5 rounded-lg shadow sm:flex-row sm:items-center justify-between gap-4 mb-6">
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
          <h1 className="text-2xl font-bold text-indigo-600">Products</h1>
        </div>
        
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-indigo-600"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 px-2 text-sm text-indigo-600">Product Management</span>
        </div>
      </div>
      
      <ul role="list" className="divide-y divide-gray-100 bg-white rounded-lg shadow mb-6">
        {currentProducts.map((product) => (
          <li 
            key={product.id} 
            className="flex justify-between gap-x-6 py-5 px-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => handleProductClick(product.id)}
          >
            <div className="flex min-w-0 gap-x-4">
              <div className="size-12 flex-none rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-600">
                  {product.name ? product.name.charAt(0) : "P"}
                </span>
              </div>
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold text-gray-900">
                  {product.name || '-'}
                </p>
                <p className="mt-1 truncate text-xs text-gray-500">
                  {product.description}
                </p>
                <p className="mt-1 text-xs text-indigo-600">
                  {product.components.length} components
                </p>
              </div>
            </div>
            <div className="flex items-center">
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
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </li>
        ))}
      </ul>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
      
      {filteredProducts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredProducts.length}
          itemsPerPage={productsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}