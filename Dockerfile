# Use a imagem oficial do Node.js como base
FROM node:18-alpine

# Instalar dependências necessárias para o Alpine
RUN apk add --no-cache libc6-compat

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação (sem turbopack para evitar problemas)
RUN npm run build

# Expor porta
EXPOSE 3000

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Comando para iniciar a aplicação
CMD ["npm", "start"]