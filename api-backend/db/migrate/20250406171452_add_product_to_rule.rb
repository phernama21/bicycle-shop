class AddProductToRule < ActiveRecord::Migration[8.0]
  def change
    add_reference :rules, :product, foreign_key: true
  end
end
