#!/bin/bash

# Script de inicialización de Git para WhatsApp Selling Bot
# Este script configura el repositorio local y lo conecta con GitHub

set -e

echo "════════════════════════════════════════════════════════════════"
echo "🚀 Configurando repositorio Git para WhatsApp Selling Bot"
echo "════════════════════════════════════════════════════════════════"

# Variables
REPO_URL="git@github.com:Jorge-DevOps/web-whatsapp-selling.git"
BRANCH="main"
COMMIT_MSG="Initial commit: WhatsApp Selling Bot v1.0"

# 1. Verificar si ya existe .git
if [ -d ".git" ]; then
    echo "✓ Repositorio Git ya existe"
    echo "  Actualizando remoto..."
    git remote set-url origin "$REPO_URL" || git remote add origin "$REPO_URL"
else
    echo "1️⃣  Inicializando repositorio Git..."
    git init
    git config user.name "WhatsApp Bot Dev"
    git config user.email "bot@whatsapp-selling.local"
    
    echo "✓ Repositorio inicializado"
fi

# 2. Verificar conexión SSH
echo ""
echo "2️⃣  Verificando conexión SSH a GitHub..."
if ssh -T git@github.com >/dev/null 2>&1; then
    echo "✓ Conexión SSH válida"
else
    echo "⚠️  Advertencia: No se puede conectar por SSH"
    echo "   Asegúrate de:"
    echo "   1. Tener SSH key generada: ssh-keygen -t ed25519"
    echo "   2. Agregarla a GitHub: Settings → SSH Keys"
    echo "   3. Agregar a ssh-agent: ssh-add ~/.ssh/id_ed25519"
fi

# 3. Agregar archivos
echo ""
echo "3️⃣  Agregando archivos al índice..."
git add -A
STAGED=$(git diff --cached --name-only | wc -l)
echo "✓ $STAGED archivos agregados"

# 4. Crear primer commit si hay cambios
echo ""
echo "4️⃣  Creando commit inicial..."
if git diff --cached --quiet; then
    echo "ℹ️  No hay cambios para commitar"
else
    git commit -m "$COMMIT_MSG" \
    -m "WhatsApp Selling Bot - Bot conversacional para gestionar apartamentos en arriendo" \
    -m "Incluye:" \
    -m "- Menú interactivo con 9 opciones" \
    -m "- Gestión de sesiones múltiples" \
    -m "- Validación de entradas robusta" \
    -m "- Arquitectura modular y escalable" \
    -m "- Docker support" \
    -m "- Jenkins CI/CD pipeline" \
    -m "- Documentación completa" || echo "ℹ️  Commit no necesario"
    echo "✓ Commit creado"
fi

# 5. Configurar rama por defecto
echo ""
echo "5️⃣  Configurando rama por defecto..."
git branch -M "$BRANCH"
echo "✓ Rama '$BRANCH' configurada"

# 6. Conectar con remoto
echo ""
echo "6️⃣  Conectando con repositorio remoto..."
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"
echo "✓ Remoto configurado: $REPO_URL"

# 7. Hacer push
echo ""
echo "7️⃣  Haciendo push al repositorio..."
echo ""
echo "Para completar el push, ejecuta:"
echo "  git push -u origin $BRANCH"
echo ""
echo "O si tienes permisos, ejecuta directamente:"
echo "  git push -u origin $BRANCH --force"
echo ""

# 8. Mostrar status
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "📊 Estado del Repositorio:"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Rama actual: $(git rev-parse --abbrev-ref HEAD)"
echo "Remoto: $(git remote get-url origin)"
echo ""
echo "Últimos commits:"
git log --oneline -3 || echo "Sin commits aún"
echo ""
echo "Status:"
git status
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "✅ Configuración de Git completada"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "🚀 Próximos pasos:"
echo "   1. git push -u origin main"
echo "   2. Ir a GitHub y configurar webhook para Jenkins"
echo "   3. Verificar pipeline en Jenkins"
echo ""
