FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY ./ .

# Build
RUN npm run build

# Install dotenv-cli for runtime environment loading
RUN npm install -g dotenv-cli

# Create cache directory
RUN mkdir -p ./cache

EXPOSE 3001

# Runtime environment variables will be provided by docker-compose or secrets
CMD ["sh", "-c", "dotenv -e .env node dist/index.js"]
