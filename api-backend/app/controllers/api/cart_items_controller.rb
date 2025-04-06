class Api::CartItemsController < ApiController
    before_action :authenticate_api_user!

    def delete
        cart_item = CartItem.find(params[:id])
        cart = cart_item.cart
        cart_item.destroy!
        render json: {cart: cart.front_data}
    end
end