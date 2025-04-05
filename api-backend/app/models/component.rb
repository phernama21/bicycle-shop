class Component < ApplicationRecord
    belongs_to :product
    has_many :options, dependent: :destroy
    
    validates :name, presence: true
    accepts_nested_attributes_for :options, allow_destroy: true

    def front_data
        component_data = Hash.new

        component_data[:id] = self.id
        component_data[:name] = self.name
        component_data[:description] = self.description
        component_data[:required] = self.required
        component_data[:options] = self.options
        
        return component_data
    end
end
