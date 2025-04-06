class Api::CartsController < ApiController
    before_action :authenticate_api_user!

    def load_single
        cart = Cart.where(user_id: current_api_user.id, status:'active')&.last&.front_data
        render json: {cart: cart}
    end

    def add_to_cart
        cart = current_api_user.carts.find_or_create_by(status: :active)
        if cart.update(cart_params)
        render json: { cart: cart.front_data }
        else
        render json: { errors: cart.errors.full_messages }, status: :unprocessable_entity
        end
    end

    private

    def cart_params
        params.require(:cart).permit(
          cart_items_attributes: [
            :id, 
            :product_id, 
            :quantity, 
            :price, 
            :_destroy,
            cart_item_options_attributes: [
              :id, 
              :option_id, 
              :price, 
              :_destroy
            ]
          ]
        )
      end
end