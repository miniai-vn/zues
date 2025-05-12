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


EXPOSE 3000

# # Start the Next.js app
CMD ["npm", "start"]

