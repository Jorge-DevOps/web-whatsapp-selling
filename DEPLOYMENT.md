# 🚀 IMPLEMENTACIÓN Y DEPLOYMENT

Guía completa para poner tu bot en producción

## 📦 Fase 1: Desarrollo Local

### 1.1 Requisitos
```bash
✓ Node.js 16+
✓ npm o yarn
✓ Cuenta de WhatsApp
✓ Navegador web (para QR)
```

### 1.2 Instalación Local
```bash
cd /home/jdevops/Documents/projects/whastapp-selling-bot
npm install
npm start
```

### 1.3 Testing Local
- Escanea el QR con tu celular
- Envía mensajes de prueba
- Verifica respuestas correctas
- Prueba todas las opciones (1-9, 0)

### 1.4 Checklist de Validación
```
[✓] Bot inicia sin errores
[✓] QR se escanea correctamente
[✓] Menú principal aparece
[✓] Opción 1 muestra valor
[✓] Opción 2 muestra fotos
[✓] Opción 3 muestra info general
[✓] Opción 4 muestra interiores
[✓] Opción 5 muestra zonas comunes
[✓] Opción 6 muestra sector
[✓] Opción 7 muestra ubicación
[✓] Opción 8 pide visita
[✓] Opción 9 muestra contacto
[✓] Opción 0 regresa al menú
[✓] Entradas inválidas se rechazan
[✓] Sesiones independientes funcionen
```

---

## 🖥️ Fase 2: Deployment en Servidor

### 2.1 Opciones de Hosting

#### **Opción A: Heroku (Gratis/Pago)**
```bash
# Instalar CLI
npm install -g heroku

# Login
heroku login

# Crear aplicación
heroku create whatsapp-selling-bot

# Agregar buildpack
heroku buildpacks:add heroku/nodejs

# Deploy
git push heroku main

# Ver logs
heroku logs --tail
```

#### **Opción B: AWS EC2**
```bash
# 1. Crear instancia EC2 (Ubuntu 22.04)
# 2. SSH a la instancia
# 3. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Clonar repo
git clone <tu-repo> whatsapp-selling-bot
cd whatsapp-selling-bot
npm install

# 5. Usar PM2 para mantener el bot vivo
npm install -g pm2
pm2 start src/index.js --name "whatsapp-bot"
pm2 startup
pm2 save
```

#### **Opción C: DigitalOcean Droplet**
```bash
# Similar a AWS pero más simple
# Crear droplet Ubuntu 22.04
# Conectar por SSH
# Seguir pasos de AWS

# Diferencia: usar DigitalOcean App Platform (aún más simple)
```

#### **Opción D: Replit (Muy simple)**
1. Ir a replit.com
2. Crear nuevo proyecto Node.js
3. Subir archivos del bot
4. Ejecutar `npm start`
5. Usar servicio de Repl para mantenerlo vivo

### 2.2 Configuración para Producción

```bash
# 1. Actualizar .env para producción
PORT=8080
NODE_ENV=production
WHATSAPP_SESSION=prod-session

# 2. Instalar dependencias de producción
npm ci --production

# 3. Usar PM2 con configuración
# Crear ecosystem.config.js
```

### 2.3 Archivo ecosystem.config.js
```javascript
module.exports = {
  apps: [
    {
      name: "whatsapp-bot",
      script: "./src/index.js",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production"
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time_format: "YYYY-MM-DD HH:mm:ss Z"
    }
  ]
};
```

### 2.4 Monitoreo en Producción
```bash
# Ver estado del bot
pm2 status

# Ver logs en tiempo real
pm2 logs whatsapp-bot

# Reiniciar si hay error
pm2 restart whatsapp-bot

# Actualizar código y reiniciar
git pull origin main
npm install
pm2 restart whatsapp-bot
```

---

## 🔒 Fase 3: Seguridad y Mejoras

### 3.1 Variables Sensibles
```bash
# Nunca commitear .env
# Usar variables de entorno del servidor
export WHATSAPP_SESSION=prod-session

# Para Heroku:
heroku config:set NODE_ENV=production
```

### 3.2 Rate Limiting (Prevenir spam)
```javascript
// Agregar en utils/rateLimit.js
export class RateLimit {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(userId) {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // Filtrar requests dentro del window
    const recentRequests = userRequests.filter(
      t => now - t < this.windowMs
    );

    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(userId, recentRequests);
    return true;
  }
}
```

### 3.3 Logging Estructurado
```javascript
// Reemplazar console.log con logger
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 3.4 Backup de Sesiones
```bash
# Hacer backup de la carpeta de sesiones
0 * * * * cp -r ~/.wwebjs_auth ~/backups/whatsapp-$(date +\%Y\%m\%d)
```

---

## 📊 Fase 4: Optimización y Escalado

### 4.1 Base de Datos (MongoDB)
```bash
# Instalar MongoDB Atlas
# Reemplazar property.json con:

const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db('realestate');

export async function getProperty(id) {
  return await db.collection('properties').findOne({ _id: id });
}
```

### 4.2 Redis para Sesiones Distribuidas
```bash
# Para múltiples instancias del bot
npm install redis

# Usar Redis en lugar de Map para SessionManager
```

### 4.3 Webhook para Interacciones Externas
```javascript
// Recibir agendamientos desde otros canales
app.post('/schedule-visit', (req, res) => {
  const { userId, date, time } = req.body;
  
  // Notificar al usuario por WhatsApp
  client.sendMessage(
    userId,
    `Tu visita está confirmada para ${date} a las ${time}`
  );
  
  res.json({ success: true });
});
```

---

## 📈 Fase 5: Monitoreo y Mantenimiento

### 5.1 Métricas Importantes
```
- Mensajes procesados por día
- Usuarios únicos por día
- Opciones más consultadas
- Tasa de conversión (consulta → visita)
- Tiempo de respuesta promedio
- Tasa de error
```

### 5.2 Dashboard (Ejemplo con Grafana)
```bash
# Instalar Prometheus para métricas
# Grafana para visualizar
# Alertas si el bot está caído
```

### 5.3 Health Check
```javascript
// Agregar ruta para verificar que bot está vivo
app.get('/health', (req, res) => {
  const status = client.info ? 'ready' : 'not ready';
  res.json({ status, timestamp: new Date() });
});

// Monitoreo externo puede hacer ping cada 5 minutos
// Si falla, notificar automáticamente
```

### 5.4 Mantenimiento Programado
```bash
# Reiniciar bot cada 24 horas (importante para WhatsApp)
0 2 * * * pm2 restart whatsapp-bot

# Limpiar logs antiguos
0 3 * * * find ./logs -mtime +30 -delete

# Backup diario de BD
0 4 * * * mongodump --uri=$MONGODB_URI -o ~/backups/$(date +\%Y\%m\%d)
```

---

## 🔧 Fase 6: Troubleshooting Producción

### 6.1 Bot Desconectado
```
Síntoma: No responde
Solución: Regenerar QR
pm2 restart whatsapp-bot
```

### 6.2 Sesiones Corrupto
```
Síntoma: Mensajes duplicados o no llegan
Solución: Limpiar carpeta de sesiones
rm -rf ~/.wwebjs_auth
pm2 restart whatsapp-bot
```

### 6.3 Memoria Llena
```
Síntoma: Bot lento, timeout
Solución: Aumentar límite de memoria
node --max-old-space-size=2048 src/index.js

O en PM2:
pm2 start src/index.js --max-memory-restart 1G
```

### 6.4 Muchos Errores en Logs
```
Síntoma: Demasiados logs
Solución: Aumentar rotate
npm install winston-daily-rotate-file

# Configurar logs que rotan diariamente
```

---

## ✅ Checklist Deployment

```
ANTES DE IR A PRODUCCIÓN:
[ ] Todas las pruebas locales pasan
[ ] .env.example documentado
[ ] .gitignore correcto (sin .env)
[ ] README actualizado
[ ] Logs configurados
[ ] Backups automatizados
[ ] Monitoreo activo
[ ] Rate limiting implementado
[ ] Base de datos lista (si aplica)

DESPUÉS DE DESPLEGAR:
[ ] Bot responde en servidor
[ ] Monitoreo activo reporta datos
[ ] Backups se crean automáticamente
[ ] Logs se guardan correctamente
[ ] Team notificado de cambios
[ ] Runbook para emergencias disponible
```

---

## 🆘 Runbook de Emergencia

### Situación: Bot no responde

```bash
# 1. Verificar estado
pm2 status whatsapp-bot

# 2. Ver últimos errores
pm2 logs whatsapp-bot --lines 50

# 3. Reiniciar
pm2 restart whatsapp-bot

# 4. Si persiste, resetear sesión
rm -rf ~/.wwebjs_auth/whatsapp-session
pm2 restart whatsapp-bot

# 5. Escanear nuevo QR desde celular
# (seguir instrucciones en terminal)
```

### Situación: Respuestas lentas

```bash
# 1. Verificar uso de memoria
pm2 monit

# 2. Si memoria alta:
pm2 kill
npm install  # limpiar cache
npm start

# 3. O aumentar memoria:
pm2 start src/index.js --max-memory-restart 2G
```

### Situación: Errores de base de datos

```bash
# 1. Verificar conexión
curl https://your-db-url/health

# 2. Si falla, usar modo degradado (JSON local)
# Cambiar en handlers.js para usar property.json

# 3. Restaurar desde backup cuando BD se recupere
mongorestore --uri=$MONGODB_URI ~/backups/latest
```

---

## 📞 Contacto y Soporte

- **Documentación**: Ver README.md
- **Arquitectura**: Ver ARCHITECTURE.md
- **Ejemplos**: Ver EXAMPLES.md
- **Extensiones**: Ver EXTENSIONS.md

---

**¡Listo para producción!** 🚀
