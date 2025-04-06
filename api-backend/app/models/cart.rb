class Cart < ApplicationRecord
    belongs_to :user
    has_many :cart_items, dependent: :destroy
    has_many :products, through: :cart_items

    accepts_nested_attributes_for :cart_items, allow_destroy: true
    
    enum :status, [:active, :abandoned, :ordered]
    
    def total_amount
      cart_items.sum { |item| item.price * item.quantity }
    end

    def front_data
      cart_data = Hash.new
      cart_data[:id] = self.id
      cart_data[:user_id] = self.user_id
      cart_data[:status] = self.status
      cart_data[:cart_items] = self.cart_items.map{|i| i.front_data}

      return cart_data
    end
  end