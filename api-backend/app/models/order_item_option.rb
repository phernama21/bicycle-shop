class OrderItemOption < ApplicationRecord
    belongs_to :order_item
    belongs_to :option

    validates :price, presence: true, numericality: { greater_than: 0 }
  end