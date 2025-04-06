class Order < ApplicationRecord
    belongs_to :user
    has_many :order_items, dependent: :destroy
    has_many :products, through: :order_items

    accepts_nested_attributes_for :order_items, allow_destroy: true
        
    validates :total_amount, presence: true, numericality: { greater_than_or_equal_to: 0 }
    
    enum :status, { pending: 0, paid: 1, cancelled: 2 }

    def front_data
      order_data = Hash.new
      order_data[:id] = self.id
      order_data[:user] = self.user.front_data
      order_data[:status] = self.status
      order_data[:total_amount] = self.total_amount
      order_data[:number_of_items] = self.order_items.count
      order_data[:created_at] = self.created_at

      return order_data
    end
    
    def create_from_cart(cart_id)
      cart = Cart.find_by_id(cart_id)
      transaction do
        cart.cart_items.each do |cart_item|
          order_item = OrderItem.create!(
            order_id: self.id,
            product_id: cart_item.product_id,
            quantity: cart_item.quantity,
            price: cart_item.price
          )
          
          cart_item.cart_item_options.each do |cart_option|
            order_item.order_item_options.create!(
              option_id: cart_option.option_id,
              price: cart_option.price)
          end
        end
        
        calculate_total_amount
        save!
        
        cart.update(status: :ordered)
      end
    end

    private

    def calculate_total_amount
      self.total_amount = order_items.sum { |item| item.price * item.quantity }
    end
    
  end