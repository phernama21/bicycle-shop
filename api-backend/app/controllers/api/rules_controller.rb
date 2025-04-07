class Api::RulesController < ApiController
    before_action :authenticate_api_user!
    before_action :admin_check, except: [:load]

    def load
        render json: {rules: Rule.all.map{|r| r.front_data}}
    end

    def create
        begin
            rule = Rule.create!(rule_params)
            render json: {rule: rule.front_data}
        rescue ActiveRecord::RecordInvalid => e
            render json: {errors: e.record.errors.full_messages}, status: :unprocessable_entity
        end
    end

    def update
        begin
            rule = Rule.find(params[:id])
            rule.update!(rule_params)
            render json: {rule: rule.front_data}
        rescue ActiveRecord::RecordInvalid => e
            render json: {errors: e.record.errors.full_messages}, status: :unprocessable_entity
        rescue ActiveRecord::RecordNotFound => e
            render json: {errors: ["Rule not found"]}, status: :not_found
        end
    end

    def delete
        begin
            rule = Rule.find(params[:id])
            rule.destroy!
            head :no_content
        rescue ActiveRecord::RecordNotFound => e
            render json: {errors: ["Rule not found"]}, status: :not_found
        end
    end

    private

    def rule_params
        params.require(:rule).permit(
            :product_id,
            :component_condition_id,
            :option_condition_id,
            :component_effect_id,
            :option_effect_id,
            :effect_type,
            :price_adjustment
        )
    end

    def admin_check
        unless current_api_user.is_admin?
            render json: { error: 'Unauthorized' }, status: 401
        end
    end

end