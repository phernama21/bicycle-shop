DeviseTokenAuth.setup do |config|
  config.change_headers_on_each_request = true
  config.batch_request_buffer_throttle = 5.seconds
  config.token_lifespan = 2.weeks
  config.headers_names = {
    'access-token': 'access-token',
    'client': 'client',
    'expiry': 'expiry',
    'uid': 'uid',
    'token-type': 'token-type'
  }
end