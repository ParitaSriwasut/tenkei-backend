FROM node:20-alpine

# Add OpenSSL
RUN apk add --no-cache openssl
WORKDIR /app

# Copy env file first
# COPY .env ./
# or use ENV in Dockerfile
# connect to host machine
# ENV DATABASE_URL="mysql://root:root@host.docker.internal:3306/tenkei-project"

# Install dependencies first
COPY package*.json ./
RUN  npm install

# Copy prisma files and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy rest of the files
COPY . .

EXPOSE 4000
CMD ["node", "index.js"]


# # Builder stage
# FROM node:20-alpine AS builder
# WORKDIR /app
# # Cache dependencies
# COPY package*.json ./
# RUN npm ci
# # Copy rest of files
# COPY . .
# RUN npx prisma generate

# # Production stage
# FROM node:20-alpine
# WORKDIR /app
# ENV NODE_ENV=production

# # Install production deps only
# COPY package*.json ./
# RUN npm ci --only=production \
#     && npm cache clean --force

# # Copy app files
# COPY --from=builder /app/index.js ./ 
# COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# COPY prisma ./prisma

# # Security
# USER node

# EXPOSE 3000
# CMD ["node", "index.js"]