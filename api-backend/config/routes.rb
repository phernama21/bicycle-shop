Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth', controllers: {
    sessions: "users/token_auth_sessions",
    registrations: "users/token_auth_registrations"
    #TODO Add confirmations and reset password (future implementations)
  }
  
end
