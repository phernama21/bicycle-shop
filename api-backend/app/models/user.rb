class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  include DeviseTokenAuth::Concerns::User

  has_many :carts
  has_many :orders

  def front_data
    user_data = self.as_json(only: [:id, :email, :first_name, :last_name, :is_admin])
    return user_data
  end
end
