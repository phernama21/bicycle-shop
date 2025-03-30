Rails.application.config.middleware.use Rack::Cors do
  allow do
    origins 'http://localhost:3000' # Your Next.js app URL
    
    resource '*',
      headers: :any,
      expose: ['access-token', 'expiry', 'token-type', 'uid', 'client'],
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end