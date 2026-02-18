/**
 * EJEMPLOS DE USO - Casos de prueba y flujos reales
 * 
 * Este archivo documenta flujos de conversación esperados
 */

/**
 * EJEMPLO 1: Usuario consultando valor del inmueble
 * 
 * Flujo: Bienvenida → Selecciona opción 1 → Ve valor → Vuelve al menú
 */
const EJEMPLO_1 = {
  usuario: "Hola, quiero saber el precio",
  
  flujo: [
    {
      step: 1,
      usuario_escribe: "Hola",
      bot_responde: `
Hola, bienvenido a nuestro servicio de inmuebles.

Tenemos un apartamento disponible en Suba Tibabuyes con excelentes características y ubicación estratégica.

¿Te gustaría conocer más detalles? Escribe cualquier cosa para continuar.
      `,
      sesion_actualiza: { stage: "menu" }
    },
    {
      step: 2,
      usuario_escribe: "1",
      bot_responde: `
💰 VALOR DEL ARRIENDO

Canon mensual: $ 1.400.000

ℹ️  La administración está incluida en el valor.

Piso: 5
Estrato: 3
Estado: Listo para habitar
      `,
      sesion_actualiza: { viewingOption: 1 }
    },
    {
      step: 3,
      usuario_escribe: "0",
      bot_responde: `
🏡 APARTAMENTO EN ARRIENDO
Suba Tibabuyes – Bogotá D.C.

1️⃣  Conocer el valor
...
      `
    }
  ]
};

/**
 * EJEMPLO 2: Usuario explorando múltiples secciones
 * 
 * Flujo: Información general → Interiores → Zonas comunes → Contacto asesor
 */
const EJEMPLO_2 = {
  usuario: "Quiero detalles completos del apartamento",
  
  flujo: [
    {
      step: 1,
      usuario_escribe: "3",
      bot_responde: `
ℹ️  INFORMACIÓN GENERAL

📍 Ubicación: Suba Tibabuyes – Bogotá D.C.
🏠 Área: 54 m²
💰 Valor: $ 1.400.000
🏢 Piso: 5
📊 Estrato: 3
✅ Estado: Listo para habitar

Moderno apartamento en zona céntrica con excelente ubicación y acceso a servicios.
      `
    },
    {
      step: 2,
      usuario_escribe: "4",
      bot_responde: `
🛋️  INTERIORES

• Cocina: Cocina integral moderna
• Pisos: Piso en baldosa de primera calidad
• Baños: Enchapado en áreas húmedas

Todos los acabados son de primera calidad con materiales duraderos.
      `
    },
    {
      step: 3,
      usuario_escribe: "5",
      bot_responde: `
🏗️  ZONAS COMUNES DEL CONJUNTO

1. Portería 24 horas
2. Lobby de acceso
3. Parqueadero inteligente con control de acceso
4. Zonas verdes y de esparcimiento
5. Salón comunal completamente equipado
6. Zona infantil segura

El conjunto está completamente equipado para comodidad de los residentes.
      `
    },
    {
      step: 4,
      usuario_escribe: "9",
      bot_responde: `
👤 CONTACTO CON ASESOR

Asesor: Carlos Mendez
📞 Teléfono: +57 300 123 4567
📧 Email: carlos@realestate.com

Puedes contactarlo directamente para consultas especiales.
Estamos disponibles de lunes a viernes, 9 AM a 6 PM.
      `
    }
  ]
};

/**
 * EJEMPLO 3: Usuario con entrada inválida
 * 
 * Flujo: Intenta opción inválida → Recibe error → Intenta nuevamente
 */
const EJEMPLO_3 = {
  usuario: "No sé cómo usar el bot",
  
  flujo: [
    {
      step: 1,
      usuario_escribe: "abc",
      bot_responde: `
⚠️  Opción no válida.

Por favor, escribe un número del 0 al 9 según el menú.
      `
    },
    {
      step: 2,
      usuario_escribe: "10",
      bot_responde: `
⚠️  Opción no válida.

Por favor, escribe un número del 0 al 9 según el menú.
      `
    },
    {
      step: 3,
      usuario_escribe: "2",
      bot_responde: `
📸 FOTOS DEL APARTAMENTO

Aquí puedes ver las imágenes del inmueble:

1. images/apartment-01.jpg
2. images/apartment-02.jpg
3. images/apartment-03.jpg
4. images/apartment-04.jpg

[En una aplicación completa, se enviarían las imágenes reales aquí]
      `
    }
  ]
};

/**
 * EJEMPLO 4: Usuario agendando visita
 * 
 * Flujo: Selecciona opción 8 → Proporciona datos → Confirmación
 * 
 * Nota: En versión actual solo muestra instrucciones.
 *       Se puede extender para capturar datos.
 */
const EJEMPLO_4 = {
  usuario: "Me interesa visitar el apartamento",
  
  flujo: [
    {
      step: 1,
      usuario_escribe: "8",
      bot_responde: `
📅 AGENDAR VISITA

Para agendar una visita, por favor comparte:

1. Tu nombre completo
2. Número telefónico
3. Fecha y hora preferida

Nuestro equipo se contactará para confirmar tu cita.
      `
    },
    {
      nota: "En versión mejorada, el bot capturaría estos datos y los guardaría"
    }
  ]
};

/**
 * EJEMPLO 5: Usuario consultando sector y ubicación
 * 
 * Flujo: Atributos del sector → Ubicación → Contacto
 */
const EJEMPLO_5 = {
  usuario: "¿Cómo es la zona?",
  
  flujo: [
    {
      step: 1,
      usuario_escribe: "6",
      bot_responde: `
🌆 ATRIBUTOS DEL SECTOR

El sector de Suba Tibabuyes es una zona estratégica con acceso a:

1. Cerca a colegios de calidad
2. Supermercados y centros comerciales
3. Acceso a transporte público (SITP, Transmilenio)
4. Clínicas y hospitales cercanos
5. Zona comercial variada
6. Parques y espacios recreativos

Excelente ubicación para familias y profesionales.
      `
    },
    {
      step: 2,
      usuario_escribe: "7",
      bot_responde: `
📍 UBICACIÓN

Dirección: Suba Tibabuyes – Bogotá D.C.

La zona de Suba Tibabuyes es conocida por:
• Seguridad y buena vigilancia
• Proximidad a centros comerciales
• Fácil acceso al transporte público
• Cerca a instituciones educativas de calidad
• Servicios médicos completos

[En una versión completa se podría incluir Google Maps Link]
      `
    }
  ]
};

/**
 * EJEMPLO 6: Conversación completa (usuario muy interesado)
 * 
 * Flujo: Completo desde bienvenida hasta contactar asesor
 */
const EJEMPLO_6 = {
  descripcion: "Usuario interesado en todos los detalles",
  
  conversacion: [
    { usuario: "Hola", bot: "Bienvenida + Menú" },
    { usuario: "1", bot: "Valor del arriendo" },
    { usuario: "0", bot: "Menú principal" },
    { usuario: "3", bot: "Información general" },
    { usuario: "0", bot: "Menú principal" },
    { usuario: "4", bot: "Interiores" },
    { usuario: "5", bot: "Zonas comunes" },
    { usuario: "6", bot: "Atributos del sector" },
    { usuario: "7", bot: "Ubicación" },
    { usuario: "9", bot: "Contacto del asesor" },
    { usuario: "Llama al asesor", bot: "Conversación privada" }
  ]
};

/**
 * EJEMPLO 7: Manejo de errores
 */
const EJEMPLO_7 = {
  titulo: "Casos de error esperados",
  
  casos: [
    {
      entrada: "asdf",
      respuesta: "Opción no válida"
    },
    {
      entrada: "100",
      respuesta: "Opción no válida"
    },
    {
      entrada: "-1",
      respuesta: "Opción no válida"
    },
    {
      entrada: "   1   ",
      respuesta: "Procesado como opción 1 (normalizado)"
    },
    {
      entrada: "1.5",
      respuesta: "Opción no válida (no es entero)"
    }
  ]
};

/**
 * EJEMPLO 8: Sesiones múltiples simultáneas
 * 
 * Dos usuarios conversando al mismo tiempo sin interferencias
 */
const EJEMPLO_8 = {
  descripcion: "Dos usuarios en sesiones independientes",
  
  usuario_1: {
    numero: "+57 300 1111111",
    conversacion: [
      "1", // Pregunta valor
      "0", // Vuelve al menú
      "9"  // Contacta asesor
    ]
  },
  usuario_2: {
    numero: "+57 300 2222222",
    conversacion: [
      "3", // Información general
      "4", // Interiores
      "5", // Zonas comunes
      "8"  // Agendar visita
    ]
  },
  resultado: "Cada usuario recibe respuestas correctas según su flujo"
};

/**
 * EJEMPLO 9: Caso de uso empresarial
 * 
 * Inmobiliaria recibe múltiples consultas a lo largo del día
 */
const EJEMPLO_9 = {
  descripcion: "Volumen de tráfico esperado",
  
  horario: [
    { hora: "09:00-10:00", usuarios: 5, consultas_comunes: ["1", "3"] },
    { hora: "10:00-12:00", usuarios: 12, consultas_comunes: ["1", "3", "4", "5"] },
    { hora: "12:00-14:00", usuarios: 3, consultas_comunes: ["9"] },
    { hora: "14:00-17:00", usuarios: 8, consultas_comunes: ["3", "6", "7"] },
    { hora: "17:00-19:00", usuarios: 15, consultas_comunes: ["1", "8", "9"] }
  ],
  
  metricas: {
    usuarios_unicos_por_dia: 40,
    mensajes_por_dia: 150,
    conversion_a_visita: "15%"
  }
};

/**
 * EJEMPLO 10: Flujo de un cliente finalmente interesado
 */
const EJEMPLO_10 = {
  descripcion: "Usuario que termina contactando",
  
  timeline: [
    {
      tiempo: "14:32",
      evento: "Usuario envía 'Hola'",
      accion: "Recibe bienvenida"
    },
    {
      tiempo: "14:33",
      evento: "Opción 1 (precio)",
      accion: "Ve canon $ 1.400.000"
    },
    {
      tiempo: "14:34",
      evento: "Opción 3 (info general)",
      accion: "Lee descripción completa"
    },
    {
      tiempo: "14:35",
      evento: "Opción 4 y 5 (interiores y zonas)",
      accion: "Muy satisfecho con amenidades"
    },
    {
      tiempo: "14:37",
      evento: "Opción 9 (contacto)",
      accion: "Obtiene número del asesor"
    },
    {
      tiempo: "14:38",
      evento: "Usuario llama a Carlos",
      accion: "Acuerdan visita para mañana"
    },
    {
      resultado: "✅ CONVERSIÓN"
    }
  ]
};

/**
 * RESUMEN DE EJEMPLOS
 * 
 * Estos casos muestran:
 * 
 * ✓ Flujos felices (usuario obtiene info que necesita)
 * ✓ Manejo de errores (entrada inválida)
 * ✓ Sesiones múltiples (sin conflictos)
 * ✓ Conversaciones largas (usuario muy interesado)
 * ✓ Conversiones reales (usuario compra/visita)
 * 
 * Usar como guía para testing y troubleshooting
 */

export {
  EJEMPLO_1,
  EJEMPLO_2,
  EJEMPLO_3,
  EJEMPLO_4,
  EJEMPLO_5,
  EJEMPLO_6,
  EJEMPLO_7,
  EJEMPLO_8,
  EJEMPLO_9,
  EJEMPLO_10
};
