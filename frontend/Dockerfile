FROM node:18

# Set up working directory
WORKDIR /frontend
COPY package.json package-lock.json ./
# Install dependencies
RUN npm install

# Expose port for Next.js
EXPOSE 3001

# Start the Next.js app
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]