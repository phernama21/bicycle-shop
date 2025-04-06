# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_04_06_183045) do
  create_table "cart_item_options", force: :cascade do |t|
    t.integer "cart_item_id"
    t.integer "option_id"
    t.decimal "price", precision: 10, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cart_item_id"], name: "index_cart_item_options_on_cart_item_id"
    t.index ["option_id"], name: "index_cart_item_options_on_option_id"
  end

  create_table "cart_items", force: :cascade do |t|
    t.integer "cart_id"
    t.integer "product_id"
    t.integer "quantity", default: 1
    t.decimal "price", precision: 10, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cart_id"], name: "index_cart_items_on_cart_id"
    t.index ["product_id"], name: "index_cart_items_on_product_id"
  end

  create_table "carts", force: :cascade do |t|
    t.integer "user_id"
    t.string "status", default: "active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_carts_on_user_id"
  end

  create_table "components", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.boolean "required", default: false
    t.integer "product_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id"], name: "index_components_on_product_id"
  end

  create_table "options", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.decimal "base_price", precision: 10, scale: 2
    t.boolean "in_stock", default: true
    t.integer "component_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["component_id"], name: "index_options_on_component_id"
  end

  create_table "order_item_options", force: :cascade do |t|
    t.integer "order_item_id"
    t.integer "option_id"
    t.decimal "price", precision: 10, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["option_id"], name: "index_order_item_options_on_option_id"
    t.index ["order_item_id"], name: "index_order_item_options_on_order_item_id"
  end

  create_table "order_items", force: :cascade do |t|
    t.integer "order_id"
    t.integer "product_id"
    t.integer "quantity", default: 1
    t.decimal "price", precision: 10, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_order_items_on_order_id"
    t.index ["product_id"], name: "index_order_items_on_product_id"
  end

  create_table "orders", force: :cascade do |t|
    t.integer "user_id"
    t.decimal "total_amount", precision: 10, scale: 2
    t.integer "status", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_orders_on_user_id"
  end

  create_table "products", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "image"
  end

  create_table "rules", force: :cascade do |t|
    t.integer "component_condition_id", null: false
    t.integer "option_condition_id", null: false
    t.integer "component_effect_id", null: false
    t.integer "option_effect_id", null: false
    t.integer "effect_type", null: false
    t.decimal "price_adjustment", precision: 10, scale: 2, default: "0.0"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "product_id"
    t.index ["component_condition_id"], name: "index_rules_on_component_condition_id"
    t.index ["component_effect_id"], name: "index_rules_on_component_effect_id"
    t.index ["option_condition_id"], name: "index_rules_on_option_condition_id"
    t.index ["option_effect_id"], name: "index_rules_on_option_effect_id"
    t.index ["product_id"], name: "index_rules_on_product_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.boolean "is_admin", default: false
    t.string "provider", default: "email", null: false
    t.string "uid", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.boolean "allow_password_change", default: false
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.string "name"
    t.string "nickname"
    t.string "image"
    t.string "email"
    t.text "tokens"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
  end

  add_foreign_key "cart_item_options", "cart_items"
  add_foreign_key "cart_item_options", "options"
  add_foreign_key "cart_items", "carts"
  add_foreign_key "cart_items", "products"
  add_foreign_key "carts", "users"
  add_foreign_key "components", "products"
  add_foreign_key "options", "components"
  add_foreign_key "order_item_options", "options"
  add_foreign_key "order_item_options", "order_items"
  add_foreign_key "order_items", "orders"
  add_foreign_key "order_items", "products"
  add_foreign_key "orders", "users"
  add_foreign_key "rules", "components", column: "component_condition_id"
  add_foreign_key "rules", "components", column: "component_effect_id"
  add_foreign_key "rules", "options", column: "option_condition_id"
  add_foreign_key "rules", "options", column: "option_effect_id"
  add_foreign_key "rules", "products"
end
