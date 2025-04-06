class Option < ApplicationRecord
    belongs_to :component
    has_many :cart_item_options
    has_many :order_item_options
  
    validates :name, presence: true
    validates :base_price, numericality: { allow_nil: false }
end
