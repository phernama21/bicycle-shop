class OrderItem < ApplicationRecord
    belongs_to :order
    belongs_to :product
    has_many :order_item_options, dependent: :destroy
    has_many :options, through: :order_item_options

    accepts_nested_attributes_for :order_item_options, allow_destroy: true
    
    validates :quantity, presence: true, numericality: { greater_than: 0 }
    validates :price, presence: true, numericality: { greater_than: 0 }
  end