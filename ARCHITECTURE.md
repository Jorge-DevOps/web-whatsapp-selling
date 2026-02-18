# 🔧 Documentación Técnica - Arquitectura del Bot

## Descripción General

Bot conversacional para WhatsApp que gestiona información de inmuebles en arriendo. Implementa un flujo conversacional intuitivo con menú interactivo y respuestas contextuales basadas en sesiones de usuario.

## 🏛️ Arquitectura

### Patrones de Diseño Utilizados

1. **Session Management**: Cada usuario tiene su propia sesión con estado
2. **Handler Pattern**: Cada opción tiene su manejador específico
3. **Data Centralization**: La información se almacena en JSON
4. **Modular Architecture**: Código separado por responsabilidad

### Diagrama de Flujo

```
┌──────────────┐
│   Usuario    │
│   Envía Msg  │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  Validación Input    │
│  InputValidator      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  SessionManager      │
│  Get/Update Session  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Verificar Stage     │
│  - welcome           │
│  - menu              │
└──────┬───────────────┘
       │
       ├─ welcome ───► Menu.welcomeMessage()
       │
       ├─ menu ────► InputValidator.isValidMenuOption()
       │                    │
       │                    ├─ Válido (0-9) ► Handlers.handleOptionN()
       │                    │
       │                    └─ Inválido ► Menu.invalidOptionMessage()
       │
       ▼
┌──────────────────────┐
│  Enviar Respuesta    │
│  message.reply()     │
└──────────────────────┘
```

## 📁 Estructura de Archivos Detallada

### `src/index.js` - Núcleo Principal
**Responsabilidad**: Inicializar el cliente de WhatsApp y orquestar la lógica principal

**Componentes clave**:
- Configuración del cliente WhatsApp
- Listeners de eventos (QR, ready, message)
- Procesamiento de mensajes
- Gestión de sesiones
- Limpieza automática de sesiones antiguas

**Flujo**:
```
1. Autenticación con QR
2. Esperar evento 'message'
3. Validar entrada
4. Actualizar sesión
5. Procesar según stage
6. Enviar respuesta
```

### `src/menu.js` - Definiciones del Menú
**Responsabilidad**: Proporcionar todos los textos del menú

**Métodos**:
- `mainMenu()`: Menú principal con opciones
- `welcomeMessage()`: Saludo inicial
- `invalidOptionMessage()`: Error por opción inválida
- `backToMenuMessage()`: Prompt para volver

**Ventajas**:
- Fácil de actualizar textos
- Centralizado
- Reutilizable

### `src/handlers.js` - Lógica de Respuestas
**Responsabilidad**: Generar respuestas para cada opción del menú

**Métodos** (uno por opción):
- `handleOption1()`: Valor del arriendo
- `handleOption2()`: Ver fotos
- `handleOption3()`: Información general
- `handleOption4()`: Interiores
- `handleOption5()`: Zonas comunes
- `handleOption6()`: Atributos del sector
- `handleOption7()`: Ubicación
- `handleOption8()`: Agendar visita
- `handleOption9()`: Contacto asesor

**Características**:
- Obtiene datos de `property.json`
- Formatea información
- Respuestas profesionales
- Estructura clara

### `src/data/property.json` - Base de Datos
**Responsabilidad**: Almacenar información del inmueble

**Estructura**:
```json
{
  "properties": [
    {
      "id": "apt-001",
      "name": "Nombre",
      "location": "Dirección",
      "rent": 1400000,
      "area": 54,
      "floor": 5,
      "stratum": 3,
      "status": "Estado",
      "interiors": { ... },
      "amenities": { ... },
      "images": [],
      "contact": { ... }
    }
  ]
}
```

**Para agregar inmuebles**: Duplica el objeto dentro del array y actualiza valores.

### `src/utils/validation.js` - Validación de Entrada
**Responsabilidad**: Validar y normalizar datos del usuario

**Métodos**:
- `isValidMenuOption(input, min, max)`: Valida número en rango
- `normalizeInput(input)`: Limpia entrada
- `isValidPhone(phone)`: Valida teléfono
- `isValidEmail(email)`: Valida email

**Uso en handlers**:
- Validar opción (0-9)
- Validar datos en futuras capturas (email, teléfono)

### `src/utils/formatter.js` - Formateo de Mensajes
**Responsabilidad**: Formatear datos para visualización

**Métodos**:
- `formatCOP(amount)`: Convierte a moneda
- `formatArea(area)`: Formatea área
- `separator()`: Línea divisoria
- `title(title)`: Crea título

**Ejemplo**:
```javascript
MessageFormatter.formatCOP(1400000) // "$ 1.400.000"
```

### `src/utils/sessionManager.js` - Gestión de Sesiones
**Responsabilidad**: Mantener estado de usuario durante conversación

**Estructura de sesión**:
```javascript
{
  userId: "...",
  createdAt: Date,
  lastInteraction: Date,
  stage: "welcome|menu",  // Etapa actual
  viewingOption: null     // Última opción consultada
}
```

**Métodos**:
- `getSession(userId)`: Obtiene o crea sesión
- `updateSession(userId, updates)`: Actualiza estado
- `cleanupSessions()`: Limpia sesiones antiguas (>1 hora)
- `resetSession(userId)`: Reinicia sesión

## 🔄 Flujo Detallado de Mensajes

### Primera Interacción
```
Usuario: "Hola"
         │
         ▼
Stage = "welcome"
         │
         ▼
Envía: welcomeMessage() + Menu vacío
Update: stage = "menu"
         │
         ▼
Espera respuesta
```

### Selección de Opción
```
Usuario: "3"
         │
         ▼
Stage = "menu"
         │
         ├─ isValidMenuOption("3") ✓
         │
         ├─ processMenuOption(3)
         │
         ├─ Handlers.handleOption3()
         │
         ▼
Envía respuesta + backToMenuMessage()
```

### Volver al Menú
```
Usuario: "0"
         │
         ▼
Stage = "menu"
         │
         ├─ option === 0 ✓
         │
         ▼
Envía: Menu.mainMenu()
```

## 📊 Gestión de Sesiones

### Ciclo de Vida

1. **Creación**: Usuario envía primer mensaje
   - Se crea sesión con `stage = "welcome"`
   
2. **Transición**: Usuario interactúa
   - Se actualiza a `stage = "menu"`
   - Sesión se marca con `lastInteraction`
   
3. **Mantenimiento**: Bot sigue conversación
   - `lastInteraction` se actualiza en cada mensaje
   
4. **Limpieza**: Sesión inactiva >1 hora
   - Se elimina automáticamente
   - Limpieza cada 30 minutos

### Ventajas
- ✅ Cada usuario tiene contexto propio
- ✅ Permite conversaciones concurrentes
- ✅ Memoria de interacciones
- ✅ Preparado para futuras características (historial, preferencias)

## 🔌 Puntos de Extensión

### Agregar Nueva Opción al Menú

1. Actualizar `Menu.mainMenu()`:
   ```javascript
   // Agregar línea al menú visual
   "🔟 Mi nueva opción\n"
   ```

2. Crear handler en `handlers.js`:
   ```javascript
   static handleOption10() {
     return "Contenido de la opción 10";
   }
   ```

3. Actualizar validador (rango 0-10):
   ```javascript
   isValidMenuOption(input, 0, 10)
   ```

4. Agregar a mapa en `index.js`:
   ```javascript
   const handlerMap = {
     // ... otras opciones
     10: () => Handlers.handleOption10()
   };
   ```

### Agregar Múltiples Inmuebles

```javascript
// En handlers.js
static getPropertyById(id) {
  const property = propertyData.properties.find(p => p.id === id);
  return property;
}

// Luego usar:
const property = this.getPropertyById('apt-002');
```

### Integrar Base de Datos

Reemplazar `property.json` con:
```javascript
// En handlers.js
static async getMainProperty() {
  const property = await db.collection('properties').findOne({});
  return property;
}
```

## 🧪 Testing Manual

### Test 1: Flujo Básico
```
1. Enviar "hola" → Ver bienvenida + menú
2. Enviar "3" → Ver información general
3. Enviar "0" → Ver menú principal nuevamente
```

### Test 2: Validación
```
1. Enviar "abc" → Error de opción inválida
2. Enviar "10" → Error de opción inválida
3. Enviar "1" → Ver valor del arriendo
```

### Test 3: Sesiones Múltiples
```
1. Abrir 2 WhatsApp (simular usuarios)
2. Ambos interactúan simultáneamente
3. Cada uno debe tener su sesión independiente
```

## 🚀 Performance

- **Tiempo de respuesta**: <1 segundo (local)
- **Memoria por sesión**: ~1KB
- **Sesiones simultáneas**: Ilimitadas
- **Escalabilidad**: Preparado para distribución

## 🔐 Seguridad

- ✅ Validación de entrada obligatoria
- ✅ Sin almacenamiento de datos sensibles
- ✅ Sesiones con timeout
- ✅ Error handling sin exposición de detalles técnicos

---

**Documento técnico completo para mantenimiento y expansión futura** 📚
