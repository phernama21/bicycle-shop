class ApplicationController < ActionController::Base
        include DeviseTokenAuth::Concerns::SetUserByToken
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  skip_forgery_protection
  allow_browser versions: :modern
end
