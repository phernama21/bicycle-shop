"use client";

import { Product } from "@/models/product/domain/product";
import { productRepository } from "@/models/product/infrastructure/productRepository";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/ui/searchBar";
import Pagination from "@/components/ui/pagination";
import { Plus, X } from "lucide-react";
import { useLoading } from "@/contexts/LoadingContext";

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        startLoading()
        const allProducts = await productRepository.getAllProducts();
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        stopLoading()
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

  const handleCreateProduct = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewProductName("");
  };
  
  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProductName.trim()) return;
    
    try {
      setIsCreating(true);
      
      const newProduct = await productRepository.createProduct(newProductName);
      
      setIsModalOpen(false);
      setNewProductName("");
      
      router.push(`products/${newProduct.id}`);
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsCreating(false);
    }
  };
  
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

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
        
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search products..." />

        <button 
          onClick={handleCreateProduct} 
          className="bg-indigo-600 hover:bg-indigo-800 text-white px-4 me-4 py-2 rounded flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" /> Add Product
        </button>
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
      
      {filteredProducts.length === 0 && !isLoading && (
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
      
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCloseModal}></div>
            
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center pb-3">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Product</h3>
                  <button
                    onClick={handleCloseModal}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleCreateProductSubmit} className="mt-4">
                  <div className="mb-4">
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      id="productName"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  
                  <div className="py-3 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={isCreating || !newProductName.trim()}
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-indigo-300"
                    >
                      {isCreating ? "Creating..." : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}