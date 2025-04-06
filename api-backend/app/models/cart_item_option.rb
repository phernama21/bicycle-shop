class CartItemOption < ApplicationRecord
    belongs_to :cart_item
    belongs_to :option

    validates :price, presence: true, numericality: { greater_than: 0 }

    def front_data
        option_data = Hash.new
        option_data[:id] = self.id
        option_data[:cart_item_id] = self.cart_item_id
        option_data[:option_id] = self.option_id
        option_data[:option_name] = self.option.name
        option_data[:component_name] = self.option.component.name
        option_data[:price] = self.price

        return option_data
    end
end