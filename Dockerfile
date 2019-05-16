ARG NODE_VERSION=10.15.3

# Development
FROM node:${NODE_VERSION}-alpine AS development

USER node
WORKDIR /home/node

ENV NODE_ENV development

COPY --chown=node:node package.json package-lock.json /home/node/
RUN npm ci

COPY --chown=node:node . /home/node/
RUN npm run build

CMD ["node", "index.js"]

# Pa11y
FROM node:${NODE_VERSION}-alpine AS pa11y

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
WORKDIR /home/node

RUN apk update && apk upgrade && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
        chromium@edge=72.0.3626.121-r0 \
        nss@edge \
        freetype@edge \
        harfbuzz@edge \
        ttf-freefont@edge

USER node

COPY --chown=node:node --from=development /home/node/ /home/node/

CMD ["npm", "run", "pa11y-test"]

# Production
FROM node:${NODE_VERSION}-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

USER node
WORKDIR /home/node

EXPOSE 3000

COPY --chown=node:node --from=development /home/node/package.json /home/node/package-lock.json /home/node/
COPY --chown=node:node --from=development /home/node/node_modules /home/node/node_modules/
RUN npm prune

COPY --chown=node:node --from=development /home/node/server /home/node/server/
COPY --chown=node:node --from=development /home/node/index.js /home/node/index.js

CMD ["node", "index.js"]
