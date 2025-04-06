class Order < ApplicationRecord
    belongs_to :user
    has_many :order_items, dependent: :destroy
    has_many :products, through: :order_items

    accepts_nested_attributes_for :order_items, allow_destroy: true
    
    enum status: { 
      pending: 'pending', 
      paid: 'paid', 
      cancelled: 'cancelled' 
    }
    
    validates :total_amount, presence: true, numericality: { greater_than_or_equal_to: 0 }
    
    def calculate_total_amount
      self.total_amount = order_items.sum { |item| item.price * item.quantity }
    end
    
    def create_from_cart(cart)
      transaction do
        cart.cart_items.each do |cart_item|
          order_item = order_items.create!(
            product: cart_item.product,
            quantity: cart_item.quantity,
            price: cart_item.price
          )
          
          cart_item.cart_item_options.each do |cart_option|
            order_item.order_item_options.create!(option: cart_option.option)
          end
        end
        
        calculate_total_amount
        save!
        
        cart.update(status: :ordered)
      end
    end
  end