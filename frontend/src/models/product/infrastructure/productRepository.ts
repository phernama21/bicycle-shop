import apiClient from "@/lib/api";
import { Product, ProductReduced } from "../domain/product";
import { multipleProduct, singleProduct, updateProduct } from "../adapter/productAdapter";


export const productRepository = {
    async getProduct(id: number): Promise<Product> {
        const response = await apiClient.get(`/products/${id}`);
        return singleProduct(response.data);
    },

    async getAllProducts(): Promise<Product[]> {
        const response = await apiClient.get("/products");
        return multipleProduct(response.data)
    },
    
    async updateProduct(product: Product): Promise<Product> {
        const response = await apiClient.put(`/products/${product.id}`, { product: updateProduct(product) }); //this updateProduct is from the adapter
        return response.data;
    },

};