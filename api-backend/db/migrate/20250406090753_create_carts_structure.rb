class CreateCartsStructure < ActiveRecord::Migration[8.0]
  def change
    create_table :carts do |t|
      t.references :user, foreign_key: true
      t.string :status, default: 'active'
      t.timestamps
    end

    create_table :cart_items do |t|
      t.references :cart, foreign_key: true
      t.references :product, foreign_key: true
      t.integer :quantity, default: 1
      t.decimal :price, precision: 10, scale: 2
      t.timestamps
    end

    create_table :cart_item_options do |t|
      t.references :cart_item, foreign_key: true
      t.references :option, foreign_key: true
      t.decimal :price, precision:10, scale: 2
      t.timestamps
    end
  end
end
