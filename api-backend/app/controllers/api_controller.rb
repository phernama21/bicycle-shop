class ApiController < ApplicationController
    include DeviseTokenAuth::Concerns::SetUserByToken
    
end