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
    get "products/base" => "products#load_base_product"
    put "products" => "products#update"
  end
  
  
end
