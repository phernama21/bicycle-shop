class Api::CartItemsController < ApiController
    before_action :authenticate_api_user!

    def delete
        cart_item = CartItem.find(params[:id])
        cart = cart_item.cart
        cart_item.destroy!
        render json: {cart: cart.front_data}
    end

    def update_quantity
        cart_item = CartItem.find(params[:id])
        if cart_item.update(quantity: params[:quantity])
            render json: { cart: cart_item.cart.front_data }
        else
            render json: { errors: cart_item.errors.full_messages }, status: :unprocessable_entity
        end
    end
end