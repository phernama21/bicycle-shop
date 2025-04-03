class Api::UsersController < ApiController
    before_action :authenticate_api_user!

    def load_me
        render :json => {user: current_api_user.front_data}
    end
end