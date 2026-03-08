#
# 🏗️ Build Stage
#
FROM node:22.14.0-bookworm-slim AS build

WORKDIR /usr/src/app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first for better caching
COPY --chown=node:node package.json yarn.lock ./

# Install all dependencies (including devDependencies needed for build)
RUN yarn install --frozen-lockfile

# Copy source code
COPY --chown=node:node . .

# Generate the production build
RUN yarn build

# Install only production dependencies and clean cache
RUN yarn install --frozen-lockfile --production && yarn cache clean --force

#
# 🚀 Production Runtime
#
FROM node:22.14.0-bookworm-slim AS production

WORKDIR /usr/src/app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init \
    && rm -rf /var/lib/apt/lists/*

# Set to production environment
ENV NODE_ENV=production

# Copy only the necessary files from build stage
COPY --chown=node:node --from=build /usr/src/app/dist dist
COPY --chown=node:node --from=build /usr/src/app/node_modules node_modules
COPY --chown=node:node --from=build /usr/src/app/package.json ./

# Set Docker as non-root user
USER node

# Expose port
EXPOSE 8000
EXPOSE 5000

# Start the application
CMD ["dumb-init", "node", "dist/main.js"]