FROM node:20-slim

WORKDIR /app

# 1. Instala dependências do sistema (OpenSSL é obrigatório pro Prisma no Linux)
RUN apt-get update && apt-get install -y python3 make g++ openssl libssl-dev && rm -rf /var/lib/apt/lists/*

# 2. Copia os packages e instala dependências do Node
COPY package*.json ./
RUN npm install

# 3. CRUCIAL: Copia a pasta do Prisma e gera o cliente
# (Certifique-se que sua pasta se chama 'prisma' e está na raiz)
COPY prisma ./prisma
RUN npx prisma generate

# 4. Copia o resto do código
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]