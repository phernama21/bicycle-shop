import apiClient from "@/lib/api";
import { Cart, CartItem } from "../domain/cart";
import { cartItemData, singleCart } from "../adapter/cartAdapter";

export const cartRepository = {

  async getCart(): Promise<Cart | null> {
    try {
      const response = await apiClient.get("/cart")
      if(response?.data?.cart){
        return singleCart(response.data.cart)
      }else{
        return null
      }
      
    } catch (error) {
      console.error('Error fetching cart:', error);
      return null;
    }
  },

  async addToCart(item: CartItem): Promise<Cart | null> {
    try {
        const response = await apiClient.post("/cart", {cart: cartItemData(item)})
        return singleCart(response.data.cart)
    } catch (error) {
      console.error('Error adding to cart:', error);
      return null;
    }
  },

  async removeFromCart(itemId: number): Promise<Cart | null> {
    try {
      const response = await apiClient.delete(`/items/${itemId}`);
      return singleCart(response.data.cart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      return null;
    }
  },

}
