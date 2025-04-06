class Product < ApplicationRecord
    has_many :components, dependent: :destroy
    has_many :cart_items
    has_many :order_items
    has_many :rules
  
    validates :name, presence: true
    accepts_nested_attributes_for :components, allow_destroy: true
end
