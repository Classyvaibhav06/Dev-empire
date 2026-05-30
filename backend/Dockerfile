# ── Backend Dockerfile ──
FROM node:20-alpine

# Install build tools (needed for native addons like bcrypt)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files first for layer caching
COPY package.json package-lock.json ./

RUN npm ci --omit=dev

# Copy the rest of the source
COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
