/**
 * Manejadores de opciones del menú
 */

import { MessageFormatter } from './utils/formatter.js';
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
        return `
💰 VALOR DEL ARRIENDO

Canon mensual: ${MessageFormatter.formatCOP(property.rent)}

ℹ️  La administración está incluida en el valor.

Piso: ${property.floor}
Estrato: ${property.stratum}
Estado: ${property.status}
`;
    }

    /**
     * Opción 2: Ver fotos
     */
    static handleOption2() {
        const property = this.getMainProperty();
        let message = `
📸 FOTOS DEL APARTAMENTO

Aquí puedes ver las imágenes del inmueble:

`;
        // En una implementación real, se enviarían las imágenes
        property.images.forEach((image, index) => {
            message += `${index + 1}. ${image}\n`;
        });

        message += `
[En una aplicación completa, se enviarían las imágenes reales aquí]
`;
        return message;
    }

    /**
     * Opción 3: Información general
     */
    static handleOption3() {
        const property = this.getMainProperty();
        return `
ℹ️  INFORMACIÓN GENERAL

📍 Ubicación: ${property.location}
🏠 Área: ${MessageFormatter.formatArea(property.area)}
💰 Valor: ${MessageFormatter.formatCOP(property.rent)}
🏢 Piso: ${property.floor}
📊 Estrato: ${property.stratum}
✅ Estado: ${property.status}

${property.description}
`;
    }

    /**
     * Opción 4: Interiores
     */
    static handleOption4() {
        const property = this.getMainProperty();
        const { kitchen, flooring, bathrooms } = property.interiors;

        return `
🛋️  INTERIORES

• Cocina: ${kitchen}
• Pisos: ${flooring}
• Baños: ${bathrooms}

Todos los acabados son de primera calidad con materiales duraderos.
`;
    }

    /**
     * Opción 5: Zonas comunes
     */
    static handleOption5() {
        const property = this.getMainProperty();
        const amenities = property.amenities.building;

        let message = `
🏗️  ZONAS COMUNES DEL CONJUNTO

`;
        amenities.forEach((amenity, index) => {
            message += `${index + 1}. ${amenity}\n`;
        });

        message += `
El conjunto está completamente equipado para comodidad de los residentes.
`;
        return message;
    }

    /**
     * Opción 6: Atributos del sector
     */
    static handleOption6() {
        const property = this.getMainProperty();
        const sector = property.amenities.neighborhood;

        let message = `
🌆 ATRIBUTOS DEL SECTOR

El sector de Suba Tibabuyes es una zona estratégica con acceso a:

`;
        sector.forEach((item, index) => {
            message += `${index + 1}. ${item}\n`;
        });

        message += `
Excelente ubicación para familias y profesionales.
`;
        return message;
    }

    /**
     * Opción 7: Ubicación
     */
    static handleOption7() {
        const property = this.getMainProperty();
        return `
📍 UBICACIÓN

Dirección: ${property.location}

La zona de Suba Tibabuyes es conocida por:
• Seguridad y buena vigilancia
• Proximidad a centros comerciales
• Fácil acceso al transporte público
• Cerca a instituciones educativas de calidad
• Servicios médicos completos
https://maps.app.goo.gl/CJyyp5FLhJSBrS9v7
`;
    }

    /**
     * Opción 8: Agendar visita
     */
    static handleOption8() {
        return `
📅 AGENDAR VISITA

Para agendar una visita, por favor comparte:

1. Tu nombre completo
2. Número telefónico
3. Fecha y hora preferida

Nuestro equipo se contactará para confirmar tu cita.
`;
    }

    /**
     * Opción 9: Hablar con asesor
     */
    static handleOption9() {
        const property = this.getMainProperty();
        const { advisor, phone, email } = property.contact;

        return `
👤 CONTACTO CON ASESOR

Asesor: ${advisor}
📞 Teléfono: ${phone}
📧 Email: ${email}

Puedes contactarlo directamente para consultas especiales.
Estamos disponibles de lunes a viernes, 9 AM a 6 PM.
`;
    }
}

export default Handlers;
