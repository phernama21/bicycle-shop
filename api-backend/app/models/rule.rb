class Rule < ApplicationRecord
    belongs_to :component_condition, class_name: 'Component'
    belongs_to :option_condition, class_name: 'Option'
    belongs_to :component_effect, class_name: 'Component'
    belongs_to :option_effect, class_name: 'Option'
    belongs_to :product
    
    validate :no_contradictory_rules
    validate :no_duplicate_conditional_prices
    validate :no_circular_dependencies
    enum :effect_type, [:require, :exclude, :conditional_price]

    def front_data
      rule_data = Hash.new
      rule_data[:id] = self.id
      rule_data[:component_condition] = self.component_condition
      rule_data[:option_condition] = self.option_condition
      rule_data[:component_effect] = self.component_effect
      rule_data[:product] = self.product.as_json(ony: [:id, :name])
      rule_data[:option_effect] = self.option_effect
      rule_data[:effect_type] = self.effect_type
      rule_data[:price_adjustment] = self.price_adjustment

      return rule_data
    end

    private
    
    def no_contradictory_rules
      if exclude?
        contradictory_rule = Rule.where(
          component_condition_id: component_condition_id,
          option_condition_id: option_condition_id,
          component_effect_id: component_effect_id,
          option_effect_id: option_effect_id,
          effect_type: :require
        ).exists?
        
        errors.add(:base, "Cannot create EXCLUDE rule when a REQUIRE rule exists for the same condition-effect pair") if contradictory_rule
      elsif require?
        contradictory_rule = Rule.where(
          component_condition_id: component_condition_id,
          option_condition_id: option_condition_id,
          component_effect_id: component_effect_id,
          option_effect_id: option_effect_id,
          effect_type: :exclude
        ).exists?
        
        errors.add(:base, "Cannot create REQUIRE rule when an EXCLUDE rule exists for the same condition-effect pair") if contradictory_rule
      end
    end
    
    def no_duplicate_conditional_prices
      if conditional_price?
        duplicate_price_rule = Rule.where(
          component_condition_id: component_condition_id,
          option_condition_id: option_condition_id,
          component_effect_id: component_effect_id,
          option_effect_id: option_effect_id,
          effect_type: :conditional_price
        ).where.not(id: id).exists?
        
        errors.add(:base, "A PRICE CONDITION rule already exists for this condition-effect pair") if duplicate_price_rule
      end
    end
    
    def no_circular_dependencies
      if component_condition_id == component_effect_id && option_condition_id == option_effect_id
        errors.add(:base, "Circular dependency detected: a component/option cannot affect itself")
        return
      end
      

      if require?
        circular_rule = Rule.where(
          component_condition_id: component_effect_id,
          option_condition_id: option_effect_id,
          component_effect_id: component_condition_id,
          option_effect_id: option_condition_id,
          effect_type: :require
        ).exists?
        
        errors.add(:base, "Circular dependency detected between components/options") if circular_rule
      end
    end
    
  end