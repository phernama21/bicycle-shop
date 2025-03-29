FROM node:18

# Set up working directory
WORKDIR /frontend
COPY . .

# Install dependencies
RUN npm install

# Expose port for Next.js
EXPOSE 3001

# Start the Next.js app
CMD ["npm", "run", "dev"]
