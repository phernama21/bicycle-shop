import { Cart, CartItem, CartItemOption } from "../domain/cart"

export const singleCart= (cartData: any): Cart => {
    return {
        id: cartData.id,
        userId: cartData.user_id,
        status: cartData.status,
        items: cartData.cart_items.map((item:any) => {
            return singleItem(item)
        })

    }
}

export const singleItem = (itemData: any): CartItem=> {
    return {
        id: itemData.id,
        cartId: itemData.cart_id,
        product: itemData.product_id,
        productName: itemData.product_name,
        price: parseFloat(itemData.price),
        quantity: itemData.quantity,
        imageSrc: itemData.img_url,
        options: itemData.cart_item_options.map((option:any) => {
            return singleOption(option)
        })

    }
}

export const singleOption = (optionData: any): CartItemOption => {
    return {
        id: optionData.id,
        cartItemId: optionData.cart_item_id,
        optionId: optionData.option_id,
        optionName: optionData.option_name,
        componentName: optionData.component_name,
        price: parseFloat(optionData.price)
    }
}

export const cartItemData = (item: CartItem): any => {
    return {
        cart_items_attributes: [{
            product_id: item.product!,
            quantity: item.quantity,
            price: item.price,
            cart_item_options_attributes: item.options.map(option => {
                return {
                    option_id: option.optionId,
                    price: option.price
                }
            })}]
    }
}