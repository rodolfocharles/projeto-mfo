# Use uma imagem base Node.js LTS para o ambiente de build
FROM node:20 AS builder

# Instale as dependências do sistema operacional necessárias para o Prisma
# libssl1.1-compat é para compatibilidade com libssl.so.1.1
# ca-certificates é uma boa prática para requisições HTTPS
#RUN apk add --no-cache openssl libssl1.1-compat ca-certificates
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie os arquivos package.json e package-lock.json para instalar as dependências
COPY package*.json ./

# Instale as dependências de produção E as devDependencies, pois 'tsx' está em devDependencies
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Gere o cliente Prisma
RUN npx prisma generate

# --- Estágio de Produção ---
FROM node:20 AS stage-1

# Instale as dependências do sistema operacional necessárias para o Prisma
#RUN apk add --no-cache openssl libssl1.1-compat ca-certificates
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Defina o diretório de trabalho
WORKDIR /app

# Copie as dependências (incluindo devDependencies como 'tsx') do estágio 'builder'
COPY --from=builder /app/node_modules ./node_modules

# Copie os arquivos package.json e package-lock.json (apenas para referência)
COPY --from=builder /app/package*.json ./

# Copie o código-fonte e o esquema Prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./.env 

# Exponha a porta que o Fastify usa (verifique no seu código Fastify, geralmente 3333)
EXPOSE 3333

# Comando para iniciar a aplicação em produção usando o script 'start' que acabamos de criar
CMD ["npm", "start"]
