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

CMD ["npm", "start"]