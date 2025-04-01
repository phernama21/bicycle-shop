class Users::TokenAuthRegistrationsController < DeviseTokenAuth::RegistrationsController
    before_action :configure_permitted_parameters
    def create
        user = User.find_by(email: params[:email])
        if user.present?
            render json: {error: 'User already exists'}, status: 422 and return
        else
            super
        end 
    end

    def destroy
        super
    end
    def configure_permitted_parameters
        added_attributes = [
            :first_name,
            :last_name
        ]
        devise_parameter_sanitizer.permit :sign_up, keys: added_attributes
        devise_parameter_sanitizer.permit :account_update, keys: added_attributes
    end

    def render_create_success
        render json: {
            user: resource_data(resource_json: @resource.front_data)
        }
    end
end