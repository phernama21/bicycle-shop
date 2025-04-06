class CreateOrdersStructure < ActiveRecord::Migration[8.0]
  def change
    create_table :orders do |t|
      t.references :user, foreign_key: true
      t.decimal :total_amount, precision: 10, scale: 2
      t.string :status, default: 'pending'
      t.timestamps
    end

    create_table :order_items do |t|
      t.references :order, foreign_key: true
      t.references :product, foreign_key: true
      t.integer :quantity, default: 1
      t.decimal :price, precision: 10, scale: 2
      t.timestamps
    end

    create_table :order_item_options do |t|
      t.references :order_item, foreign_key: true
      t.references :option, foreign_key: true
      t.decimal :price, precision:10, scale: 2
      t.timestamps
    end
  end
end
