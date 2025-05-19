FROM node:24.0.2-slim

USER root
WORKDIR /app

COPY . .

RUN apt-get update && apt-get install -y \
  openssl \
  libssl-dev \
  procps \
  && rm -rf /var/lib/apt/lists/*

RUN npm install --force

CMD sh -c "npx prisma generate && npx prisma migrate deploy && npm run start:dev"