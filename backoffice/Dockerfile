# backoffice/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Clean Next.js cache
RUN rm -rf .next

RUN npm run build

EXPOSE 3002
CMD ["npm", "start"]