FROM ruby:3.2

# Install dependencies
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs

# Set up working directory
WORKDIR /api-backend
COPY . .

# Install gems
RUN gem install bundler
RUN bundle install

# Set environment variables
ENV RAILS_ENV='development'

# Expose port for Rails
EXPOSE 3000

# Start the Rails server
CMD ["rails", "server", "-b", "0.0.0.0"]