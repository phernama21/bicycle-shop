class AddDeletedToProduct < ActiveRecord::Migration[8.0]
  def change
    add_column :products, :deleted, :boolean, default: false
  end
end
