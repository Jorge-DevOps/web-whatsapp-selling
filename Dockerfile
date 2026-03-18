# Imagen base slim con Node.js 22 (estable)
FROM node:22-slim

# Metadatos
LABEL maintainer="WhatsApp Bot" \
    version="1.0" \
    description="Bot conversacional para WhatsApp - Gestión de inmuebles"

# Configurar variables de entorno
ENV TZ=America/Bogota \
    NODE_ENV=production \
    NODE_OPTIONS=--no-warnings \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    WDM_LOCAL=1

# Instalar dependencias del sistema en una sola capa
RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init \
    chromium \
    ca-certificates \
    fonts-dejavu \
    libxss1 \
    libnss3 \
    fonts-liberation \
    xdg-utils \
    wget \
    curl \
    # Limpiar cache de apt
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Crear usuario no root
RUN useradd --create-home --shell /bin/bash nodejs

# Directorio de trabajo
WORKDIR /app

# Copiar e instalar dependencias primero (mejor cache de Docker)
COPY package*.json ./
RUN npm ci --only=production \
    && npm cache clean --force

# Copiar código fuente con permisos correctos
COPY --chown=nodejs:nodejs src ./src
COPY --chown=nodejs:nodejs .puppeteerrc.cjs .env* ./

# Crear carpetas necesarias con permisos correctos
RUN mkdir -p /app/logs /app/.wwebjs_cache \
    && chown -R nodejs:nodejs /app \
    && chmod -R 755 /app

# Cambiar a usuario no root
USER nodejs

# Exponer puerto (para futuros webhooks)
EXPOSE 8080

# Health check para verificar que el bot está corriendo
HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
    CMD pgrep -f "node src/index.js" >/dev/null || exit 1

# Usar dumb-init para ejecutar el proceso correctamente
ENTRYPOINT ["dumb-init", "--"]

# Ejecutar el bot
CMD ["node", "src/index.js"]
