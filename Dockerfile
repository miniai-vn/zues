# Base stage for dependencies
FROM node:20-alpine as base

WORKDIR /app
COPY package.json yarn.lock ./
RUN apk add --no-cache git \
    && yarn install --frozen-lockfile \
    && yarn cache clean

# Build stage
FROM node:20-alpine as build

WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .

RUN apk add --no-cache git curl \
    && yarn build
    # Optional optimizations below (uncomment if needed)
    # && rm -rf node_modules \
    # && yarn install --production --frozen-lockfile --ignore-scripts --prefer-offline \
    # && curl -sfL https://gobinaries.com/tj/node-prune | sh \
    # && ./bin/node-prune

# Production stage
FROM node:20-alpine as production

WORKDIR /app

COPY --from=build /app/package.json /app/yarn.lock ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

EXPOSE 3000

CMD ["yarn", "start"]
