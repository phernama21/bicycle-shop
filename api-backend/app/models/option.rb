class Option < ApplicationRecord
    belongs_to :component
  
    validates :name, presence: true
    validates :base_price, numericality: { allow_nil: false }
end
