import { single } from "@/models/user/adapter/userAdapter";
import { Order } from "../domain/order";

export const singleOrder = (orderData: any): Order => {
    return {
        id: orderData.id,
        user: single(orderData.user),
        status: orderData.status,
        amount: parseFloat(orderData.total_amount),
        nItems: orderData.number_of_items,
        createdAt: orderData.created_at
    }
}

export const multipleOrders = (ordersData: any): Order[] => {
    if(Array.isArray(ordersData)){
        const orders = ordersData.map((order) => {
            if(order?.id === undefined){
                throw new Error('User has no id.')
            }else{
                return singleOrder(order);
            }
        })
        return orders;
    }else{
        return []
    }

}