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
9️⃣  Hablar con asesor
0️⃣  Volver al menú principal

Escriba el número de su opción:`;
    }

    static welcomeMessage() {
        return `
Hola, bienvenido a nuestro servicio de inmuebles.

Tenemos un apartamento disponible en Suba Tibabuyes con excelentes características y ubicación estratégica.

¿Te gustaría conocer más detalles? Escribe cualquier cosa para continuar.`;
    }

    static invalidOptionMessage() {
        return `
⚠️  Opción no válida.

Por favor, escribe un número del 0 al 9 según el menú.`;
    }

    static backToMenuMessage() {
        return `
Escribe 0 para volver al menú principal o cualquier otro número de opción.`;
    }
}

export default Menu;
