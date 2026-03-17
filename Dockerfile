FROM ghcr.io/puppeteer/puppeteer:21.0.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["node", "index.js"]
