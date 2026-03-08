#
# 🏗️ Build Stage
#
FROM node:24-bookworm-slim AS build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

RUN yarn install --production --frozen-lockfile && yarn cache clean


#
# 🚀 Production Runtime (minimal attack surface)
#
FROM gcr.io/distroless/nodejs22-debian12

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json .

EXPOSE 8000
EXPOSE 5000

CMD ["dist/main.js"]