class Api::OrdersController < ApiController
    before_action :authenticate_api_user!
    before_action :admin_check, only: [:load]

    def load
        render json: {orders: Order.all.map{|o| o.front_data}}
    end

    def create
        order = Order.create!(user_id: current_api_user.id, total_amount: 0)
        order.create_from_cart(params[:cart_id].to_i)
        head :no_content
    end

    private

    def admin_check
        unless current_api_user.is_admin?
            render json: { error: 'Unauthorized' }, status: 401
        end
    end

end