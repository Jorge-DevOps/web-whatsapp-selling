# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production && \
    npm cache clean --force

# Stage 2: Runtime
FROM node:22-alpine

WORKDIR /app

# Instalar dependencias de sistema incluidas Chromium, dumb-init y librerías necesarias
RUN apk add --no-cache \
    dumb-init \
    chromium \
    ca-certificates \
    ttf-dejavu \
    font-noto \
    noto-emoji

# Configurar variables de entorno para Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Copiar node_modules desde builder
COPY --from=builder /app/node_modules ./node_modules

# Copiar archivos de dependencias
COPY package*.json ./

# Copiar código fuente
COPY src ./src

# Copiar datos de configuración
COPY docker-compose.yml ./
COPY .env* ./

# Crear carpetas necesarias con permisos adecuados
RUN mkdir -p /app/logs /app/.wwebjs_cache && \
    chmod -R 755 /app && \
    rm -rf /tmp/* /var/tmp/*

# Crear usuario no-root para mayor seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Cambiar propiedad de la carpeta
RUN chown -R nodejs:nodejs /app

USER nodejs

# Exponer puerto (para futuros webhooks)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD node -e "try { require('fs').accessSync('./src/index.js'); process.exit(0); } catch(e) { process.exit(1); }"

# Usar dumb-init para ejecutar el proceso
ENTRYPOINT ["dumb-init", "--"]

# Comando para ejecutar el bot
CMD ["node", "src/index.js"]
