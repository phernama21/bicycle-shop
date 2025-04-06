import apiClient from "@/lib/api";
import { Order } from "../domain/order";
import { multipleOrders } from "../adapter/orderAdapter";
import { Cart } from "@/models/cart/domain/cart";

export const orderRepository = {
    async getAllOrders(): Promise <Order[]> {
        const response = await apiClient.get("/orders")
        return multipleOrders(response.data.orders);
    },

    async createOrder(cart: Cart) : Promise <boolean> {
        const response = await apiClient.post("/orders", {cart_id: cart.id})
        return response.status == 204
    }
}