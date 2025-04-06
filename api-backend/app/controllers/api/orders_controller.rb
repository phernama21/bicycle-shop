class Api::OrdersController < ApiController
    before_action :authenticate_api_user!

    def load
        render json: {orders: Order.all.map{|o| o.front_data}}
    end

    def create
        order = Order.create!(user_id: current_api_user.id, total_amount: 0)
        order.create_from_cart(params[:cart_id].to_i)
        head :no_content
    end

end