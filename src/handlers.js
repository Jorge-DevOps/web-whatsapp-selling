/**
 * Manejadores de opciones del menú
 */

import { MessageFormatter } from './utils/formatter.js';
import { ImageManager } from './utils/imageManager.js';
import propertyData from './data/property.json' with { type: 'json' };

export class Handlers {

    /**
     * Obtiene la propiedad principal
     */
    static getMainProperty() {
        return propertyData.properties[0];
    }

    /**
     * Opción 1: Conocer el valor
     */
    static handleOption1() {
        const property = this.getMainProperty();
        return (
            `💰 *VALOR DEL ARRIENDO*

🏷️ Canon mensual: *${MessageFormatter.formatCOP(property.rent)}*

ℹ️ *La administración está incluida*

🏢 Piso: ${property.floor}
📊 Estrato: ${property.stratum}
✅ Estado: ${property.status}`
        );
    }

    /**
     * Opción 2: Ver fotos
     */
    static handleOption2() {
        return null; // Muestra submenu de fotos
    }

    /**
     * Opción 3: Información general
     */
    static handleOption3() {
        const property = this.getMainProperty();
        return (
            `ℹ️ *INFORMACIÓN GENERAL*

📍 Ubicación: ${property.location}
🏠 Área: ${MessageFormatter.formatArea(property.area)}
💰 Valor: ${MessageFormatter.formatCOP(property.rent)}
🏢 Piso: ${property.floor}
📊 Estrato: ${property.stratum}
✅ Estado: ${property.status}

📝 ${property.description}`
        );
    }

    /**
     * Opción 4: Interiores
     */
    static handleOption4() {
        const { kitchen, flooring, bathrooms } = this.getMainProperty().interiors;

        return (
            `🛋️ *INTERIORES*

🍳 Cocina: ${kitchen}
🪵 Pisos: ${flooring}
🚿 Baños: ${bathrooms}`
        );
    }

    /**
     * Opción 5: Zonas comunes
     */
    static handleOption5() {
        const amenities = this.getMainProperty().amenities.building;

        let message = `🏗️ *ZONAS COMUNES DEL CONJUNTO*\n\n`;

        amenities.forEach((amenity, index) => {
            message += `✅ ${index + 1}. ${amenity}\n`;
        });

        message += `\n🌿 Pensado para la comodidad y bienestar de los residentes`;
        return message;
    }

    /**
     * Opción 6: Atributos del sector
     */
    static handleOption6() {
        const sector = this.getMainProperty().amenities.neighborhood;

        let message = `🌆 *ATRIBUTOS DEL SECTOR*\n\n📌 La zona cuenta con:\n\n`;

        sector.forEach((item, index) => {
            message += `📍 ${index + 1}. ${item}\n`;
        });

        message += `\n👨‍👩‍👧‍👦 Ideal para familias y profesionales`;
        return message;
    }

    /**
     * Opción 7: Ubicación
     */
    static handleOption7() {
        const property = this.getMainProperty();
        return (
            `📍 *UBICACIÓN DEL INMUEBLE*

🏠 Dirección: ${property.location}

🔐 Seguridad y vigilancia
🛍️ Cercanía a centros comerciales
🚌 Acceso a transporte público
🏫 Instituciones educativas cercanas
🏥 Servicios médicos disponibles

🗺️ Ver en Google Maps:
https://maps.app.goo.gl/CJyyp5FLhJSBrS9v7`
        );
    }

    /**
     * Opción 8: Agendar visita
     */
    static handleOption8() {
        return (
            `📅 *AGENDAR VISITA*

Para programar una visita, envíanos:

👤 Nombre completo  
📞 Número telefónico  
🕒 Fecha y hora preferida  

✅ Te confirmaremos tu cita`
        );
    }

    /**
     * Opción 9: Hablar con asesor
     */
    static handleOption9() {
        return (
            `👤 *CONTACTO CON EL DUEÑO*

📝 Por favor, envía tu pregunta o consulta para el dueño del inmueble.

🕘 *Horario de atención:*
Domingo a domingo | 9:00 AM – 8:00 PM

✅ Te responderemos lo antes posible`
        );
    }

    /**
     * Opción 10: Requisitos del arrendatario
     */
    static handleOption10() {
        return (
            `🛡️ *REQUISITOS PARA ARRENDAR EL INMUEBLE*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*🏠 SEGURO DE ARRENDAMIENTO (OBLIGATORIO)*

✅ Estudio y aprobación por aseguradora
✅ Cubre canon de arrendamiento
✅ Cubre posibles daños al inmueble
✅ Respalda el proceso legal en caso de incumplimiento

⚠️ *Sin aprobación del seguro no es posible continuar con el proceso.*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*📄 DOCUMENTOS BÁSICOS*

🪪 Copia de la cédula de ciudadanía (ambas caras)
📞 Referencias personales y laborales (mínimo 2)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*💼 SI ES EMPLEADO*

💼 Carta laboral (cargo, tipo de contrato, antigüedad y salario)
💸 Últimos 2–3 desprendibles de nómina
🧾 Extractos bancarios (últimos 2–3 meses)
📞 Referencia personal (nombre y teléfono)
📞 Referencia laboral o comercial

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*🏢 SI ES INDEPENDIENTE*

🧾 RUT
📊 Certificación de ingresos (firmada por contador)
🧮 Estados financieros (si aplica)
💸 Extractos bancarios (últimos 3–6 meses)
🧾 Declaración de renta (si declara)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✍️ *Autorización para tratamiento de datos personales*`
        );
    }

    /**
     * Opción 11: Iniciar proceso de arrendamiento
     */
    static handleOption11() {
        return (
            `📋 *INICIAR PROCESO DE ARRENDAMIENTO*

Para comenzar el proceso de arrendamiento, necesitamos que proporciones:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*🏠 SEGURO DE ARRENDAMIENTO*

✅ Estudio y aprobación del seguro de arrendamiento (OBLIGATORIO)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*📄 DOCUMENTOS DE IDENTIDAD*

🪪 Cédula de ciudadanía (copias ambas caras)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*📞 REFERENCIAS*

👥 Referencias personales (mínimo 2)
   - Nombre completo
   - Teléfono de contacto

👔 Referencias laborales (mínimo 2)
   - Nombre completo
   - Teléfono de contacto

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*💼 SI SOS EMPLEADO*

💼 Carta laboral (cargo, tipo de contrato, antigüedad y salario)
💸 Últimos 3 desprendibles de nómina
🧾 Extractos bancarios (últimos 3 meses)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✉️ *Por favor, envía los documentos digitalizados (PDF o imágenes claras)*

📧 Nuestro equipo procesará tu solicitud lo antes posible.

🕘 Tiempo estimado de respuesta: 3-5 días hábiles`
        );
    }

    /**
     * Submenú de fotos
     */
    static getPhotosForSection(sectionNumber) {
        const sectionPath = ImageManager.getSectionPath(sectionNumber);
        const sectionName = ImageManager.getSectionName(sectionNumber);

        if (!sectionPath) return null;

        const images = ImageManager.getImagesForSection(sectionPath);

        if (images.length === 0) {
            return {
                text: `📸 *${sectionName.toUpperCase()}*\n\n⚠️ Aún no hay imágenes disponibles.`,
                images: []
            };
        }

        return {
            text: `📸 *${sectionName.toUpperCase()}*\n\n📤 Enviando ${images.length} foto(s)...`,
            images
        };
    }
}

export default Handlers;
