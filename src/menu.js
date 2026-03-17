/**
 * Menú principal del bot
 */

export class Menu {
    static mainMenu() {
        return `
🧵✨ *HILOS MAGICOS* ✨🧵
📋 PROCESO DE SELECCIÓN - MODISTERÍA

Selecciona una opción escribiendo el número:

1️⃣  Iniciar postulación
0️⃣  Ver menú principal

Escriba el número de su opción:`;
    }

    static welcomeMessage() {
        return `
🧵✨ *Bienvenido a Hilos Magicos* ✨🧵

📍 Ubicado en Centro comercial Cedritos calle 151
🏆 Más de 30 años ofreciendo servicios de modistería, confección y arreglos a medida
🗺️ Maps:
https://www.google.com/maps/place/Hilos+M%C3%A1gicos/data=!4m2!3m1!1s0x0:0xe0fd35da96254df3?sa=X&ved=1t:2428&ictx=111

👋 Escribe cualquier cosa para continuar.`;
    }

    static invalidOptionMessage() {
        return `
⚠️  Opción no válida.
Por favor, escribe 1 para iniciar la postulación o 0 para volver al menú.`;
    }

    static backToMenuMessage() {
        return `
Escribe 0 para volver al menú principal o cualquier otro número de opción.`;
    }

    static photosMenu() {
        return `
📸 VER FOTOS POR ÁREA

Selecciona una opción escribiendo el número:

1️⃣  Sala
2️⃣  Cocina
3️⃣  Cuarto principal
4️⃣  Baño principal
5️⃣  Baño secundario
6️⃣  Cuartos extras
7️⃣  Pasillo
8️⃣  Zonas comunes
0️⃣  Volver al menú principal

Escriba el número de su opción:`;
    }
}

export default Menu;
