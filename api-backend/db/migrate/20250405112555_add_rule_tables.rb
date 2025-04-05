class AddRuleTables < ActiveRecord::Migration[8.0]
  def change
  
    create_table :rules do |t|
      t.references :component_condition, null: false, foreign_key: { to_table: :components }
      t.references :option_condition, null: false, foreign_key: { to_table: :options }
      t.references :component_effect, null: false, foreign_key: { to_table: :components }
      t.references :option_effect, null: false, foreign_key: { to_table: :options }
      t.integer :effect_type, null: false
      t.decimal :price_adjustment, precision: 10, scale: 2, default: 0.0
      
      t.timestamps
    end
  end
end
