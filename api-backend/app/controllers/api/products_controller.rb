class Api::ProductsController < ApiController
  before_action :authenticate_api_user!
  before_action :set_product, only: [:load_base_product]
  before_action :admin_check, only: [:update, :create]
  
  def load
    render json: Product.where(deleted: false).map{|p| product_with_image_url(p)}
  end
  
  def load_single
    product = Product.where(id: params[:id], deleted: false)&.first
    render json: product_with_image_url(product)
  end
  
  def load_base_product
    render json: product_with_image_url(@product)
  end
  
  def update
    product = Product.find_by_id(params[:id])
    if product.update(product_params)
      render json: product_with_image_url(product)
    else
      render json: { errors: product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def create
    product = Product.create!(name: params[:name])
    render json: {product: product_with_image_url(product)}
  end

  def delete
    product = Product.where(id: params[:id], deleted: false)&.first
    if product
      product.update!(deleted: true)
    end
    head :no_content
  end
  
  private
  
  def product_with_image_url(product)
    product_data = product.as_json(include: { components: { include: :options } })
    product_data['image_url'] = product.image.url if product.image.present?
    
    product_data
  end
  
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
      :image,
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

  def admin_check
    unless current_api_user.is_admin?
        render json: { error: 'Unauthorized' }, status: 401
    end
  end
end