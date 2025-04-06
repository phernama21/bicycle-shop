class CartItemOption < ApplicationRecord
    belongs_to :cart_item
    belongs_to :option

    validates :price, presence: true, numericality: { greater_than: 0 }
end