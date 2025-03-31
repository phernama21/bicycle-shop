class Users::TokenAuthSessionsController < DeviseTokenAuth::SessionsController

    def create
        super
    end

    def destroy
        super
    end
    def render_create_success
        render json: {
            user: resource_data(resource_json: @resource.front_data)
        }
    end
end