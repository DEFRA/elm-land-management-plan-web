# Base
FROM node:10.15.3-alpine AS base

USER node
WORKDIR /home/node

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

ARG PORT=3000
ENV PORT ${PORT}
EXPOSE ${PORT}

COPY --chown=node:node package.json package-lock.json /home/node/

RUN npm ci --loglevel verbose

# Development
FROM base AS development

ENV NODE_ENV development

RUN npm install --loglevel verbose

COPY --chown=node:node client/ /home/node/client/
COPY --chown=node:node server/ /home/node/server/
COPY --chown=node:node test/ /home/node/test/
COPY --chown=node:node index.js /home/node/index.js

RUN npm run build

CMD ["node", "index.js"]

# Production
FROM base AS production

COPY --chown=node:node --from=development /home/node/index.js /home/node/index.js
COPY --chown=node:node --from=development /home/node/server/ /home/node/server/

CMD ["node", "index.js"]
