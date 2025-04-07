class Api::UsersController < ApiController
    before_action :authenticate_api_user!
    before_action :admin_check, only: [:load, :change_admin_status]

    def load_me
        render :json => {user: current_api_user.front_data}
    end

    def load
        users = User.all.map{|u| u.front_data}
        render :json => {users: users}
    end

    def change_admin_status
        user = User.find(params[:id])
        user.update!(is_admin: params[:is_admin])
        render json:{user:user}
    end

    private

    def admin_check
        unless current_api_user.is_admin?
            render json: { error: 'Unauthorized' }, status: 401
        end
    end
end