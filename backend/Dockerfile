# Backend Dockerfile
FROM node:20-alpine AS build
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npm run build

# Production image
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy only needed files
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/dist ./dist
COPY .env.example ./

EXPOSE 5002
CMD ["node", "dist/server.js"]
