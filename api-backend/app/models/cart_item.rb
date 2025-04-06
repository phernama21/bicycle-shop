class CartItem < ApplicationRecord
    belongs_to :cart
    belongs_to :product
    has_many :cart_item_options, dependent: :destroy
    has_many :options, through: :cart_item_options

    accepts_nested_attributes_for :cart_item_options, allow_destroy: true
    
    validates :quantity, presence: true, numericality: { greater_than: 0 }
    validates :price, presence: true, numericality: { greater_than: 0 }

    def front_data
      item_data = Hash.new
      item_data[:id] = self.id
      item_data[:cart_id] = self.cart_id
      item_data[:product_id] = self.product_id
      item_data[:product_name] = self.product.name
      item_data[:price] = self.price
      item_data[:quantity] = self.quantity
      item_data[:img_url] = self.product.image&.url
      item_data[:cart_item_options] = self.cart_item_options.map{|o| o.front_data}

      return item_data
    end    
    
  end