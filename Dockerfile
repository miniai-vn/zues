# Use official Node.js LTS image as the build environment
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Copy the rest of the source code
COPY . .

RUN npm install
# Build the Next.js app
RUN npm run build

# Production image
# FROM node:20-alpine AS runner

# WORKDIR /app

# # Copy only the necessary files from the builder
# COPY --from=builder /app/.next .next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/next.config.js ./next.config.js

# # Set environment variables (optional)
# ENV NODE_ENV=production

EXPOSE 3000

# # Start the Next.js app
CMD ["npm", "start"]

