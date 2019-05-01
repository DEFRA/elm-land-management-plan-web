FROM node:10.15.3-alpine

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

USER node
WORKDIR /home/node

EXPOSE 3000

# Install dependencies, including build tools
COPY package.json package-lock.json /home/node/
RUN NODE_ENV=development npm install

# Add source code, build app and remove build tools
COPY . /home/node/
RUN npm run build && npm ci

CMD ["node", "index.js"]
