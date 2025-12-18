# --- Estágio de Dependências (Deps) ---
FROM node:20 AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm install --frozen-lockfile

# --- Estágio de Build (Builder) ---
FROM node:20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- Estágio de Produção (Runner) ---
FROM node:20 AS runner

WORKDIR /app

# Define o usuário e grupo para rodar a aplicação
RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs

# Configura o cache do npm e garante permissões (executado como root)
ENV NPM_CONFIG_CACHE=/tmp/.npm-cache
RUN mkdir -p ${NPM_CONFIG_CACHE} && chown -R nextjs:nextjs ${NPM_CONFIG_CACHE}

# GARANTE QUE O USUÁRIO 'nextjs' TENHA PERMISSÃO DE ESCRITA NA PASTA /app (executado como root)
RUN chown -R nextjs:nextjs /app

USER nextjs 

# Copia os arquivos de produção do estágio 'builder'
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

# Copia os arquivos package.json e INSTALA as dependências de produção AQUI
COPY --from=builder --chown=nextjs:nextjs /app/package*.json ./
RUN npm install --omit=dev 

# Exponha a porta que o Next.js usa
EXPOSE 3000

# Comando para iniciar a aplicação em produção
CMD ["npm", "start"]
