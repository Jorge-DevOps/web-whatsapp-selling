# Guía de Docker y CI/CD

## 🐳 Docker Setup

### Compilar imagen Docker
```bash
docker build -t whatsapp-selling-bot:latest .
```

### Ejecutar contenedor
```bash
# Desarrollo
docker run -it --name whatsapp-bot whatsapp-selling-bot:latest

# Producción con volúmenes persistentes
docker run -d \
  --name whatsapp-bot \
  -v whatsapp_sessions:/app/.wwebjs_cache \
  -v whatsapp_auth:/app/.wwebjs_auth \
  -v bot_logs:/app/logs \
  --restart unless-stopped \
  whatsapp-selling-bot:latest
```

### Docker Compose
```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f whatsapp-bot

# Detener
docker-compose down

# Limpiar volúmenes
docker-compose down -v
```

### Volúmenes Persistentes
```bash
# Crear volúmenes
docker volume create whatsapp_sessions
docker volume create whatsapp_auth
docker volume create bot_logs

# Ver volúmenes
docker volume ls

# Inspeccionar volumen
docker volume inspect whatsapp_sessions
```

---

## 🚀 Jenkins CI/CD Setup

### Requisitos
- Jenkins 2.387+
- Docker instalado en agentes
- Git plugin
- Pipeline plugin
- Docker plugin
- Credentials binding plugin

### Configuración Inicial

#### 1. Crear Credenciales en Jenkins
```
Jenkins → Manage Credentials → Global → Add Credentials
```

**Credential 1: Docker Hub**
- Kind: Username with password
- ID: docker-hub-credentials
- Username: tu-usuario-dockerhub
- Password: tu-token-dockerhub

**Credential 2: GitHub SSH**
- Kind: SSH Username with private key
- ID: github-ssh-key
- Username: git
- Private Key: tu-clave-ssh

#### 2. Crear Pipeline Job
```
Jenkins → New Item → Pipeline → OK
Nombre: WhatsApp-Selling-Bot
```

#### 3. Configurar Pipeline
```
Pipeline → Definition: Pipeline script from SCM
SCM: Git
  Repository URL: git@github.com:Jorge-DevOps/web-whatsapp-selling.git
  Credentials: github-ssh-key
  Branch: */main
  Script Path: Jenkinsfile
```

#### 4. Configurar Disparadores
```
Build Triggers:
  ✓ GitHub hook trigger for GITScm polling
  ✓ Poll SCM (H/5 * * * *)
```

#### 5. Configurar Webhook en GitHub
```
GitHub → Settings → Webhooks → Add webhook
Payload URL: http://jenkins-server/github-webhook/
Content type: application/json
Triggers: Push events, Pull requests
Active: ✓
```

### Ejecutar Pipeline

**Opción 1: Build Manual**
```
Jenkins → WhatsApp-Selling-Bot → Build Now
```

**Opción 2: Trigger por Git Push**
```bash
git push origin main
# Jenkins se dispara automáticamente
```

**Opción 3: Trigger por Webhook**
- Cualquier push a GitHub → Webhook dispara Jenkins

### Monitorear Build
```
Jenkins → Logs → Ver en tiempo real
```

---

## 📊 Pipeline Stages

### 1. Checkout (2 min)
- Clona el repositorio de GitHub
- Valida acceso SSH

### 2. Clean (1 min)
- Limpia workspace anterior
- Prepara ambiente nuevo

### 3. Install Dependencies (3 min)
- npm ci --only=production
- Valida Node.js y npm

### 4. Lint & Validate (1 min)
- Valida sintaxis JavaScript
- Valida JSON

### 5. Test (2 min)
- Verifica archivos principales
- Valida código

### 6. Build Docker Image (5 min)
- Construye imagen Docker
- Taguea con nombre y build number

### 7. Push to Registry (3 min)
- Solo en rama main
- Sube a Docker Hub
- Taguea latest y número de build

### 8. Generate Reports (1 min)
- Crea reporte de dependencias
- Información de build

### 9. Archive Artifacts (1 min)
- Archiva reportes
- Disponibles para descarga

**Tiempo total: ~20 minutos**

---

## 🔔 Notificaciones

### Email
```groovy
post {
  success {
    emailext(
      to: 'tu-email@example.com',
      subject: 'Build exitoso: ${PROJECT_NAME}',
      body: 'Build completado correctamente'
    )
  }
  failure {
    emailext(
      to: 'tu-email@example.com',
      subject: 'Build fallido: ${PROJECT_NAME}',
      body: 'Revisa los logs para más información'
    )
  }
}
```

### Slack
```groovy
post {
  success {
    slackSend(
      channel: '#deployments',
      message: '✅ Build exitoso: WhatsApp-Selling-Bot'
    )
  }
  failure {
    slackSend(
      channel: '#deployments',
      message: '❌ Build fallido: WhatsApp-Selling-Bot'
    )
  }
}
```

---

## 🚀 Deployment

### Desplegamiento Manual
```bash
# Obtener imagen del registro
docker pull jorgde/whatsapp-selling-bot:latest

# Detener contenedor anterior
docker stop whatsapp-bot || true
docker rm whatsapp-bot || true

# Ejecutar nuevo contenedor
docker-compose up -d
```

### Desplegamiento Automático (CD)
Agregar stage a Jenkinsfile:
```groovy
stage('Deploy') {
  when {
    branch 'main'
  }
  steps {
    sh '''
      docker-compose down
      docker-compose up -d
      docker-compose ps
    '''
  }
}
```

---

## 📋 Troubleshooting

### Jenkins no puede acceder a GitHub
```
1. Verificar credenciales SSH
2. Validar permisos en GitHub
3. Probar conexión: ssh -T git@github.com
```

### Docker build falla
```
1. Verificar Dockerfile
2. Validar espacios en blanco
3. Revisar .dockerignore
```

### Imagen no se sube a Docker Hub
```
1. Verificar credenciales Docker
2. Verificar nombre de imagen
3. docker login -u usuario
```

---

## 📚 Recursos Útiles

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Webhooks](https://docs.github.com/en/developers/webhooks-and-events/webhooks)
- [Docker Hub](https://hub.docker.com/)

---

**¡Pipeline CI/CD completamente configurado!** 🚀
