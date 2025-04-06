class ChangeStatusColumn < ActiveRecord::Migration[8.0]
  def change
    change_column :orders, :status, :integer, default: 0
  end
end
