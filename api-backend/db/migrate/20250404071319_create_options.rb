class CreateOptions < ActiveRecord::Migration[8.0]
  def change
    create_table :options do |t|
      t.string :name, null: false
      t.text :description
      t.decimal :base_price, precision: 10, scale: 2
      t.boolean :in_stock, default: true
      t.references :component, null: false, foreign_key: true

      t.timestamps
    end
  end
end
