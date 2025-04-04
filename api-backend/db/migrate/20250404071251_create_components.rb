class CreateComponents < ActiveRecord::Migration[8.0]
  def change
    create_table :components do |t|
      t.string :name, null: false
      t.text :description
      t.boolean :required, default: false
      t.references :product, null: false, foreign_key: true

      t.timestamps
    end
  end
end
