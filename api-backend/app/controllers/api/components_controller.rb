class Api::ComponentsController < ApiController
    before_action :authenticate_api_user!

    def load
        render json: {components: Component.all.map{|c| c.front_data}}
    end

end