import apiClient from "@/lib/api";
import { Product } from "../domain/product";
import { singleProduct, updateProduct } from "../adapter/productAdapter";


export const productRepository = {
    async getProduct(): Promise<Product> {
        const response = await apiClient.get(`/products/base`);
        return singleProduct(response.data);
    },
    
    async updateProduct(product: Product): Promise<Product> {
        const response = await apiClient.put(`/products`, { product: updateProduct(product) });
        return response.data;
    },

};