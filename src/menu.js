/**
 * Menú principal del bot
 */

export class Menu {
    static mainMenu() {
        return `
🏡 APARTAMENTO EN ARRIENDO
Suba Tibabuyes – Bogotá D.C.

Selecciona una opción escribiendo el número:

1️⃣  Conocer el valor
2️⃣  Ver fotos
3️⃣  Información general
4️⃣  Interiores
5️⃣  Zonas comunes
6️⃣  Atributos del sector
7️⃣  Ubicación
8️⃣  Agendar visita
9️⃣  Hablar con el dueño
🔟 Requisitos del arrendatario
0️⃣  Volver al menú principal

Escriba el número de su opción:`;
    }

    static welcomeMessage() {
        return `
Hola, tenemos un apartamento disponible en Suba Tibabuyes con excelentes características y ubicación estratégica.
¿Te gustaría conocer más detalles? Escribe cualquier cosa para continuar.`;
    }

    static invalidOptionMessage() {
        return `
⚠️  Opción no válida.
Por favor, escribe un número del 0 al 10 según el menú.`;
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
