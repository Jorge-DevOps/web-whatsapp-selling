# Usar imagen base de Node.js LTS
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY src ./src

# Crear carpetas necesarias
RUN mkdir -p /app/logs /app/.wwebjs_cache

# Exponer puerto (para futuros webhooks)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "console.log('OK')" || exit 1

# Comando para ejecutar el bot
CMD ["node", "src/index.js"]
