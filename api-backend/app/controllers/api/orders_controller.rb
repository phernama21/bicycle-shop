class Api::OrdersController < ApiController
    before_action :authenticate_api_user!

end