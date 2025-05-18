FROM node:24.0.2-slim

USER root
WORKDIR /app

COPY . .

# Instala dependências do sistema, incluindo openssl e libssl-dev
RUN apt-get update && apt-get install -y \
  openssl \
  libssl-dev \
  procps \
  && rm -rf /var/lib/apt/lists/*

# Instala dependências do projeto
RUN npm install --force

EXPOSE 3333
CMD ["npm", "run", "start:dev"]