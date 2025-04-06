import apiClient from "@/lib/api";
import { Product } from "../domain/product";
import { multipleProduct, singleProduct, updateProduct } from "../adapter/productAdapter";

export const productRepository = {
  async getProduct(id: number): Promise<Product> {
    const response = await apiClient.get(`/products/${id}`);
    return singleProduct(response.data);
  },
  
  async getAllProducts(): Promise<Product[]> {
    const response = await apiClient.get("/products");
    return multipleProduct(response.data);
  },
  
  async updateProduct(product: Product): Promise<Product> {
    const formData = updateProduct(product);
    
    const response = await apiClient.put(
      `/products/${product.id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    return singleProduct(response.data);
  },

  async createProduct(productName: string): Promise<Product> {
    const response = await apiClient.post("/products", {name: productName})
    return singleProduct(response.data.product)
  }
};