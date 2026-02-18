/**
 * EJEMPLO DE EXTENSIÓN: Soporte para múltiples inmuebles
 * Este archivo muestra cómo implementar un sistema para gestionar varios apartamentos
 */

/**
 * Extensión 1: Selector de Inmuebles
 * 
 * Agregar esta lógica en src/index.js para que el usuario elija un inmueble primero
 */

// En el evento 'message' de index.js, reemplaza la lógica así:

/*
client.on('message', async (message) => {
  try {
    const userId = message.from;
    const userInput = message.body.trim();
    
    const session = sessionManager.getSession(userId);

    console.log(`📨 Mensaje de ${userId}: ${userInput}`);

    // NUEVA ETAPA: Seleccionar inmueble
    if (session.stage === 'welcome') {
      sessionManager.updateSession(userId, { stage: 'selectProperty' });
      await message.reply(Menu.propertySelectionMenu());
    } 
    else if (session.stage === 'selectProperty') {
      if (!InputValidator.isValidMenuOption(userInput, 1, 2)) {
        await message.reply(Menu.invalidOptionMessage());
        return;
      }

      const propertyIndex = parseInt(userInput) - 1;
      const properties = propertyData.properties;

      if (propertyIndex >= properties.length) {
        await message.reply(Menu.invalidOptionMessage());
        return;
      }

      sessionManager.updateSession(userId, { 
        stage: 'menu',
        selectedPropertyId: properties[propertyIndex].id
      });

      await message.reply(Menu.mainMenu());
    }
    else if (session.stage === 'menu') {
      // ... resto del código igual
    }
  } 
  catch (error) {
    console.error('❌ Error procesando mensaje:', error);
    await message.reply('Disculpa, hubo un error. Por favor, intenta nuevamente.');
  }
});
*/

/**
 * Extensión 2: Actualizar menu.js con selector de inmuebles
 */

/*
export class Menu {
  static propertySelectionMenu() {
    return `
🏢 BIENVENIDO

Tenemos varios apartamentos disponibles. Elige uno:

1️⃣  Apartamento Suba Tibabuyes (54 m² - $ 1.400.000)
2️⃣  Apartamento Usaquén (68 m² - $ 1.800.000)
3️⃣  Apartamento Chapinero (45 m² - $ 1.200.000)

Escribe el número de tu opción:`;
  }

  // ... resto de métodos igual
}
*/

/**
 * Extensión 3: Actualizar handlers.js para usar propiedad seleccionada
 */

/*
export class Handlers {
  static getPropertyById(propertyId) {
    const property = propertyData.properties.find(p => p.id === propertyId);
    return property || propertyData.properties[0]; // Fallback
  }

  // Modificar handlers para:
  static handleOption1(propertyId = 'apt-001') {
    const property = this.getPropertyById(propertyId);
    return `
💰 VALOR DEL ARRIENDO

Canon mensual: ${MessageFormatter.formatCOP(property.rent)}
...
`;
  }

  // Y así con todas las opciones...
}
*/

/**
 * Extensión 4: Datos de múltiples inmuebles (actualizar property.json)
 */

/*
{
  "properties": [
    {
      "id": "apt-001",
      "name": "Apartamento Suba Tibabuyes",
      "location": "Suba Tibabuyes – Bogotá D.C.",
      "rent": 1400000,
      "area": 54,
      "floor": 5,
      "stratum": 3,
      "status": "Listo para habitar",
      // ... resto de datos
    },
    {
      "id": "apt-002",
      "name": "Apartamento Usaquén",
      "location": "Usaquén – Bogotá D.C.",
      "rent": 1800000,
      "area": 68,
      "floor": 8,
      "stratum": 4,
      "status": "Remodelado",
      // ... resto de datos
    },
    {
      "id": "apt-003",
      "name": "Apartamento Chapinero",
      "location": "Chapinero – Bogotá D.C.",
      "rent": 1200000,
      "area": 45,
      "floor": 3,
      "stratum": 3,
      "status": "Listo para habitar",
      // ... resto de datos
    }
  ]
}
*/

/**
 * Extensión 5: Sistema de Lenguaje (i18n)
 * 
 * Crear archivos separados:
 * - src/lang/es.js
 * - src/lang/en.js
 * - src/lang/fr.js (si quieres)
 */

// src/lang/es.js
export const ES = {
  welcome: 'Hola, bienvenido',
  menu: '🏡 APARTAMENTO EN ARRIENDO',
  selectLanguage: 'Selecciona tu idioma:\n1. Español\n2. English',
  rent: 'Canon',
  area: 'Área'
};

// src/lang/en.js
export const EN = {
  welcome: 'Hello, welcome',
  menu: '🏡 APARTMENT FOR RENT',
  selectLanguage: 'Select your language:\n1. Spanish\n2. English',
  rent: 'Rent',
  area: 'Size'
};

// Uso en Menu.js:
/*
export class Menu {
  constructor(language = 'es') {
    this.lang = language === 'en' ? EN : ES;
  }

  mainMenu() {
    return `${this.lang.menu} ...`;
  }
}
*/

/**
 * Extensión 6: Integración con Base de Datos (Firebase ejemplo)
 */

/*
// src/services/firebaseService.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  // ... más config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getAllProperties() {
  const querySnapshot = await getDocs(collection(db, "properties"));
  const properties = [];
  querySnapshot.forEach((doc) => {
    properties.push({ id: doc.id, ...doc.data() });
  });
  return properties;
}

// Uso en handlers.js:
// const properties = await getAllProperties();
// const property = properties.find(p => p.id === propertyId);
*/

/**
 * Extensión 7: Agendar Visitas (Mejorado)
 */

/*
// Agregar en sessionManager.js
export class SessionManager {
  // ... código existente

  // Agregar etapa para agendar visita
  startScheduleVisit(userId, propertyId) {
    const session = this.getSession(userId);
    Object.assign(session, {
      stage: 'scheduling',
      selectedPropertyId: propertyId,
      schedulingStep: 'name' // name -> phone -> date -> time -> confirm
    });
    this.sessions.set(userId, session);
  }
}

// En index.js, agregar manejador para scheduling:
/*
else if (session.stage === 'scheduling') {
  // Solicitar nombre, teléfono, fecha, hora
  // Guardar en base de datos
  // Notificar al asesor
}
*/
*/

/**
 * Extensión 8: Análisis de Comportamiento
 */

/*
// src/services/analytics.js
export class Analytics {
  static logUserInteraction(userId, propertyId, option) {
    const interaction = {
      timestamp: new Date(),
      userId,
      propertyId,
      option,
      userAgent: 'WhatsApp-Bot'
    };
    
    // Guardar en base de datos para análisis
    // db.collection('interactions').add(interaction);
  }

  static getUserBehavior(userId) {
    // Obtener histórico de interacciones del usuario
    // Mostrar qué opciones consulta más, qué inmuebles prefiere
  }
}

// Uso:
// Analytics.logUserInteraction(userId, propertyId, option);
*/

/**
 * Extensión 9: Notificaciones Proactivas
 */

/*
// src/services/notifications.js
export class Notifications {
  static async sendNewPropertyAlert(client, userId, propertyId) {
    // Notificar a usuarios cuando hay un inmueble nuevo
    await client.sendMessage(
      userId,
      `🆕 Nuevo inmueble disponible: ${propertyName}`
    );
  }

  static async sendPriceChange(client, userId, propertyId, oldPrice, newPrice) {
    // Notificar cambio de precio
    await client.sendMessage(
      userId,
      `💰 El precio cambió de $${oldPrice} a $${newPrice}`
    );
  }

  static async sendVisitReminder(client, userId, visitDate) {
    // Recordatorio de visita programada
    await client.sendMessage(
      userId,
      `📅 Te recordamos tu visita para ${visitDate}`
    );
  }
}
*/

/**
 * Extensión 10: Integración con Google Maps
 */

/*
// src/services/mapsService.js
import axios from 'axios';

export class MapsService {
  static getMapLink(address) {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/search/${encodedAddress}`;
  }

  static async getDistance(origin, destination) {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json`,
      {
        params: {
          origins: origin,
          destinations: destination,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    );
    return response.data.rows[0].elements[0];
  }
}

// Uso en handlers:
// const mapLink = MapsService.getMapLink(property.location);
// Enviar en el mensaje de ubicación
*/

/**
 * RESUMEN DE EXTENSIONES DISPONIBLES
 * 
 * ✅ Múltiples inmuebles: Cambiar stage a 'selectProperty'
 * ✅ Multiidioma: Usar archivos de lenguaje separados
 * ✅ Base de datos: Integrar Firebase o Firestore
 * ✅ Agendar visitas: Sistema de pasos (step-by-step)
 * ✅ Analítica: Registrar interacciones
 * ✅ Notificaciones: Alertas proactivas
 * ✅ Google Maps: Links y distancias
 * 
 * Para implementar cualquiera, copia el código y adapta a tu necesidad.
 */
