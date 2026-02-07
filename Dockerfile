FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# installer su-exec pour drop privileges
RUN apk add --no-cache su-exec

COPY --from=build /app/.output /app/.output
COPY --from=build /app/package.json /app/package.json
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh \
  && addgroup -S appgroup \
  && adduser -S appuser -G appgroup

# Entrypoint runs as root so it can read docker secrets, it will drop to appuser
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
