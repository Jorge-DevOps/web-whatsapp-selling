# 📖 Guía de Uso - WhatsApp Selling Bot

## 🎯 Inicio Rápido

### 1. Instalación (5 minutos)
```bash
# Navega a la carpeta del proyecto
cd /home/jdevops/Documents/projects/whastapp-selling-bot

# Instala dependencias
npm install

# Ejecuta el bot
npm start
```

### 2. Autenticación WhatsApp
- Se mostrará un código QR en la terminal
- Abre WhatsApp en tu celular
- Ve a **Configuración** → **Dispositivos conectados** → **Conectar dispositivo**
- Escanea el código QR
- Espera 20-30 segundos a que se complete la autenticación

### 3. ¡Ya está funcionando!
```
✅ Bot iniciado y listo para recibir mensajes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 📱 Cómo Usar el Bot

### Flujo de Usuario Normal

1. **Usuario envía mensaje de inicio**
   ```
   Usuario: "Hola"
   ```

2. **Bot responde con bienvenida y menú**
   ```
   🏡 APARTAMENTO EN ARRIENDO
   Suba Tibabuyes – Bogotá D.C.
   
   1️⃣  Conocer el valor
   2️⃣  Ver fotos
   ... (opciones)
   ```

3. **Usuario selecciona opción**
   ```
   Usuario: "1"
   ```

4. **Bot proporciona información**
   ```
   💰 VALOR DEL ARRIENDO
   Canon mensual: $ 1.400.000
   ...
   ```

5. **Volver al menú cuando quiera**
   ```
   Usuario: "0"
   ```

## 🎮 Opciones Detalladas

### Opción 1️⃣ - Conocer el Valor
Muestra el canon de arriendo y detalles financieros.
```
Usuario escribe: 1
Bot responde: Canon, piso, estrato, estado
```

### Opción 2️⃣ - Ver Fotos
Lista las fotos disponibles del apartamento.
```
Usuario escribe: 2
Bot responde: Rutas de imágenes (futuro: envío real)
```

### Opción 3️⃣ - Información General
Resumen completo del inmueble.
```
Usuario escribe: 3
Bot responde: Ubicación, área, valor, estado, descripción
```

### Opción 4️⃣ - Interiores
Detalles de acabados y decoración.
```
Usuario escribe: 4
Bot responde: Cocina, pisos, baños
```

### Opción 5️⃣ - Zonas Comunes
Amenidades del conjunto residencial.
```
Usuario escribe: 5
Bot responde: Portería, lobby, parqueadero, zonas verdes, etc.
```

### Opción 6️⃣ - Atributos del Sector
Características de la zona.
```
Usuario escribe: 6
Bot responde: Colegios, comercio, transporte, hospitales, etc.
```

### Opción 7️⃣ - Ubicación
Dirección y acceso a servicios.
```
Usuario escribe: 7
Bot responde: Dirección exacta y detalles de ubicación
```

### Opción 8️⃣ - Agendar Visita
Solicita información para agendar visita.
```
Usuario escribe: 8
Bot responde: Instrucciones para contactar y agendar
```

### Opción 9️⃣ - Hablar con Asesor
Información de contacto directo.
```
Usuario escribe: 9
Bot responde: Nombre, teléfono, email del asesor
```

### Opción 0️⃣ - Volver al Menú
Regresa al menú principal.
```
Usuario escribe: 0
Bot responde: Menú principal completo
```

## ⚙️ Personalización Rápida

### Cambiar Información del Inmueble

Edita `src/data/property.json`:

```json
{
  "rent": 1400000,        // Cambia el canon
  "area": 54,            // Cambia el área
  "location": "Dirección", // Cambia la dirección
  "floor": 5,            // Cambia el piso
  "stratum": 3,          // Cambia el estrato
  "contact": {
    "advisor": "Tu Nombre",
    "phone": "+57 300 XXX XXXX",
    "email": "tu@email.com"
  }
}
```

### Cambiar Textos del Menú

Edita `src/menu.js`:

```javascript
static mainMenu() {
  return `
🏡 APARTAMENTO EN ARRIENDO
Tu Descripción Aquí

1️⃣  Opción 1
... etc
`;
}
```

### Cambiar Respuestas

Edita `src/handlers.js`:

```javascript
static handleOption1() {
  return `
Tu respuesta personalizada aquí
Con el contenido que necesites
`;
}
```

## 📊 Agregar Múltiples Inmuebles

### Paso 1: Actualizar `property.json`

```json
{
  "properties": [
    {
      "id": "apt-001",
      "name": "Apartamento Suba",
      // ... datos del primer inmueble
    },
    {
      "id": "apt-002",
      "name": "Apartamento Usaquén",
      // ... datos del segundo inmueble
    }
  ]
}
```

### Paso 2: Crear lógica de selección

En `src/index.js`, modificar el flujo para que el usuario seleccione un inmueble primero:

```javascript
if (session.stage === 'welcome') {
  sessionManager.updateSession(userId, { stage: 'selectProperty' });
  await message.reply("¿Cuál inmueble te interesa?\n1. Suba\n2. Usaquén");
} 
else if (session.stage === 'selectProperty') {
  const propertyId = option === 1 ? 'apt-001' : 'apt-002';
  sessionManager.updateSession(userId, { 
    stage: 'menu',
    selectedProperty: propertyId 
  });
  await message.reply(Menu.mainMenu());
}
```

## 🐛 Solución de Problemas

### El bot no responde
- ✓ Verifica que el terminal muestre "Bot iniciado y listo"
- ✓ Asegúrate de escanear correctamente el QR
- ✓ Revisa que tu número está en la sesión de WhatsApp

### Error "ENOENT: property.json"
- ✓ Verifica que el archivo existe: `src/data/property.json`
- ✓ Ejecuta desde la carpeta correcta

### Mensajes duplicados
- ✓ Es normal en los primeros segundos después de autenticar
- ✓ Se estabiliza después de 30 segundos

### Problema de QR
- ✓ Genera un nuevo QR: Ctrl+C y ejecuta `npm start` de nuevo
- ✓ Asegúrate de usar una cuenta WhatsApp nueva o dedicada

## 📈 Métricas Útiles

### Monitorear Bot

El terminal mostrará logs así:

```
📨 Mensaje de +573001234567: 3
💰 VALOR DEL ARRIENDO
...
[16:45:23] Respuesta enviada
```

### Información Registrada
- Número del usuario
- Contenido del mensaje
- Opción seleccionada
- Timestamp

## 🔄 Actualizar Contenido

### Sin reiniciar el bot
1. Edita `src/data/property.json`
2. Los cambios se aplican en el siguiente mensaje del usuario

### Después de editar código
1. Presiona Ctrl+C en el terminal
2. Ejecuta `npm start` nuevamente

### Con modo desarrollo
```bash
npm run dev  # Se reinicia automáticamente al editar archivos
```

## 💡 Tips y Trucos

### Para desarrolladores
- Agrega `console.log()` en `handlers.js` para debuguear
- Usa `ARCHITECTURE.md` para entender la lógica
- Modifica `formatters.js` para cambiar formato de números

### Para usuarios finales
- Comparte el número del bot en tu equipo
- Crea un grupo de WhatsApp y agrega el bot
- Puedes enviar el menú manualmente si lo necesitas

### Optimización
- El bot limpia sesiones antiguas automáticamente
- No requiere base de datos externa
- Funciona offline después de la autenticación inicial

## 📞 Soporte

### Preguntas Frecuentes

**P: ¿Cómo envío imágenes reales?**
R: En el código hay preparado para S3/Cloud Storage. Ver `ARCHITECTURE.md`.

**P: ¿Puedo usar esto en un negocio real?**
R: Sí, está diseñado para producción. Agrega BD y considera WhatsApp Business API.

**P: ¿Cómo hago que sea multiidioma?**
R: Crea archivos separados `menu-es.js`, `menu-en.js` y carga según preferencia.

**P: ¿Puede mandar notificaciones?**
R: Sí, usa `client.sendMessage()` para enviar mensajes proactivos.

---

**¡Listo para usar! Cualquier duda revisa ARCHITECTURE.md** 🚀
