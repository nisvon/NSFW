FROM ghcr.io/puppeteer/puppeteer:21.0.0

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["node", "index.js"]
