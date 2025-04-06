class Api::CartsController < ApiController
    before_action :authenticate_api_user!

end