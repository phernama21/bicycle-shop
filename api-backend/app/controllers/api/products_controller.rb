class Api::ProductsController < ApiController
    before_action :authenticate_api_user!
    before_action :set_product, only: [:load_base_product]

    def load
      render json: Product.all.map{|p| p.as_json(include: { components: { include: :options } })}
    end

    def load_single
      product = Product.find_by_id(params[:id])
      render json: product.as_json(include: { components: { include: :options } })
    end

    def load_base_product
        render json: Product.first.as_json(include: { components: { include: :options } })
    end

    def update
      product = Product.find_by_id(params[:id])
      if product.update(product_params)
        render json: product.as_json(include: { components: { include: :options } })
      else
        render json: { errors: product.errors.full_messages }, status: :unprocessable_entity
      end
    end
    
    private

    def set_product
      @product = Product.first
      if !@product
        @product = Product.create!(name: 'Bicycle')
      end
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Product not found' }, status: :not_found
    end

    def product_params
      params.require(:product).permit(
        :name, 
        :description, 
        :active,
        components_attributes: [
          :id, 
          :name, 
          :description, 
          :required, 
          :_destroy,
          options_attributes: [
            :id, 
            :name, 
            :description, 
            :base_price, 
            :in_stock, 
            :_destroy
          ]
        ]
      )
    end
  end