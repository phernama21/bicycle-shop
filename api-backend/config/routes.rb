Rails.application.routes.draw do
  namespace :api do
    mount_devise_token_auth_for 'User', at: 'auth', controllers: {
      sessions: "users/token_auth_sessions",
      registrations: "users/token_auth_registrations"
      #TODO Add confirmations and reset password (future implementations)
    }

    #USERS
    get "auth/me" => "users#load_me"
    get "users" => "users#load"
    put "users/:id" => "users#change_admin_status"

    #PRODUCTS
    get "products" => "products#load"
    get "products/base" => "products#load_base_product"
    get "products/:id" => "products#load_single"
    put "products/:id" => "products#update"

    #RULES
    get "rules" => "rules#load"
    post "rules" => "rules#create"
    put "rules/:id" => "rules#update"
    delete "rules/:id" => "rules#delete"

    #COMPONENTS
    get "components" => "components#load"

    #CARTS
    get "cart" => "carts#load_single"
    post "cart" => "carts#add_to_cart"

    #CART ITEMS
    delete "items/:id" => "cart_items#delete"
    put "items/:id/quantity" => "cart_items#update_quantity"

    #ORDERS
    get "orders" => "orders#load"
    post "orders" => "orders#create"

  end
  
  
end
