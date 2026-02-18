# 🏡 WhatsApp Selling Bot - Inmuebles en Arriendo

Bot conversacional inteligente para gestionar consultas sobre apartamentos en arriendo mediante WhatsApp, construido con Node.js y whatsapp-web.js.

## 📋 Características

- ✅ Menú interactivo con 9 opciones
- ✅ Respuestas automáticas contextuales
- ✅ Gestión de sesiones de usuario
- ✅ Arquitectura modular y escalable
- ✅ Validación de entradas robusta
- ✅ Formato profesional de mensajes
- ✅ Código limpio y comentado

## 🏗️ Estructura del Proyecto

```
whatsapp-selling-bot/
├── src/
│   ├── index.js              # Inicialización principal del bot
│   ├── menu.js               # Definición del menú principal
│   ├── handlers.js           # Manejadores de opciones (1-9)
│   ├── data/
│   │   └── property.json     # Información del inmueble
│   └── utils/
│       ├── validation.js     # Validación de entradas
│       ├── formatter.js      # Formateo de mensajes
│       └── sessionManager.js # Gestión de sesiones
├── package.json              # Dependencias y configuración
├── .env.example              # Variables de entorno
└── README.md                 # Este archivo
```

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js 16+ instalado
- Cuenta de WhatsApp activa
- Navegador web (para escanear QR)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd /home/jdevops/Documents/projects/whastapp-selling-bot
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Crear archivo de variables de entorno**
   ```bash
   cp .env.example .env
   ```

4. **Ejecutar el bot**
   ```bash
   npm start
   ```

5. **Autenticar con WhatsApp**
   - El terminal mostrará un código QR
   - Abre WhatsApp en tu teléfono
   - Ve a Configuración → Dispositivos conectados
   - Escanea el código QR con tu teléfono
   - Espera la autenticación (20-30 segundos)

### Modo Desarrollo
```bash
npm run dev  # Con recarga automática
```

## 📱 Flujo de Conversación

### Primer Mensaje
El usuario envía cualquier mensaje y el bot responde con:
1. Saludo bienvenida
2. Introducción breve del inmueble
3. Menú principal con opciones numeradas

### Menú Principal
```
🏡 APARTAMENTO EN ARRIENDO
Suba Tibabuyes – Bogotá D.C.

1️⃣  Conocer el valor
2️⃣  Ver fotos
3️⃣  Información general
4️⃣  Interiores
5️⃣  Zonas comunes
6️⃣  Atributos del sector
7️⃣  Ubicación
8️⃣  Agendar visita
9️⃣  Hablar con asesor
0️⃣  Volver al menú principal
```

### Comportamiento
- El usuario escribe un número (0-9)
- El bot responde con información relevante
- Se ofrece opción de volver al menú
- Entradas inválidas se rechazan amablemente

## 📊 Opciones Disponibles

| Opción | Contenido                          |
| ------ | ---------------------------------- |
| **1**  | Canon mensual y detalles básicos   |
| **2**  | Galería de fotos del apartamento   |
| **3**  | Información general completa       |
| **4**  | Detalles de interiores             |
| **5**  | Amenidades del conjunto            |
| **6**  | Características del sector         |
| **7**  | Ubicación y ubicación estratégica  |
| **8**  | Agendar visita (recopilar datos)   |
| **9**  | Información de contacto del asesor |
| **0**  | Regresa al menú principal          |

## 💾 Datos del Inmueble

Información centralizada en `src/data/property.json`:

```json
{
  "properties": [
    {
      "id": "apt-001",
      "name": "Apartamento Suba Tibabuyes",
      "rent": 1400000,
      "area": 54,
      "floor": 5,
      "stratum": 3,
      "status": "Listo para habitar",
      "interiors": { ... },
      "amenities": { ... },
      "contact": { ... }
    }
  ]
}
```

### Agregar Más Inmuebles
Para agregar otro apartamento, simplemente agrega un nuevo objeto en el array `properties` con su información.

## 🔒 Seguridad

- ✅ Validación de entrada en cada paso
- ✅ Gestión de sesiones con timeout
- ✅ Error handling robusto
- ✅ Autenticación local de WhatsApp (no requiere API keys)

## 🛠️ Mejoras Futuras

- [ ] Base de datos para múltiples propiedades
- [ ] Soporte multiidioma (ES/EN)
- [ ] Envío de imágenes reales desde AWS S3
- [ ] Integración con Google Maps
- [ ] Registro de visitas agendadas en Firestore
- [ ] Notificaciones a asesores
- [ ] Análisis de conversaciones
- [ ] Webhook para Business API

## ⚙️ Configuración Avanzada

### Variables de Entorno (.env)
```env
PORT=3000
WHATSAPP_SESSION=whatsapp-session
NODE_ENV=development
```

### Para Producción
- Usar WhatsApp Business API
- Implementar base de datos (MongoDB, Firebase)
- Agregar autenticación
- Configurar HTTPS
- Usar gestión de sesiones distribuida

## 📞 Soporte

Para consultas técnicas o mejoras, revisa el código comentado en cada archivo.

## 📝 Licencia

MIT - Libre para usar y modificar

---

**Desarrollado como solución profesional para gestión inmobiliaria en WhatsApp** 🚀
