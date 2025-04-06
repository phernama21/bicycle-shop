class CartItem < ApplicationRecord
    belongs_to :cart
    belongs_to :product
    has_many :cart_item_options, dependent: :destroy
    has_many :options, through: :cart_item_options

    accepts_nested_attributes_for :cart_item_options, allow_destroy: true
    
    validates :quantity, presence: true, numericality: { greater_than: 0 }
    validates :price, presence: true, numericality: { greater_than: 0 }
    
    
  end