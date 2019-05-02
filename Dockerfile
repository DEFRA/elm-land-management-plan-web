ARG NODE_ENV=production
ARG NODE_VERSION=10.15.3

# Development
FROM node:${NODE_VERSION}-alpine AS development

USER node
WORKDIR /home/node

COPY package.json package-lock.json /home/node/
RUN npm ci

COPY . /home/node/
RUN npm run build

CMD ["node", "index.js"]

# Production
FROM node:${NODE_VERSION}-alpine AS production

ENV NODE_ENV $NODE_ENV

USER node
WORKDIR /home/node

EXPOSE 3000

COPY --from=development /home/node/package.json /home/node/package-lock.json /home/node/
COPY --from=development /home/node/server /home/node/server/
COPY --from=development /home/node/index.js /home/node/index.js
RUN npm ci

CMD ["node", "index.js"]
