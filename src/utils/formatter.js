/**
 * Utilidades para formato de mensajes
 */

export class MessageFormatter {
    /**
     * Formatea moneda en COP
     * @param {number} amount - Monto
     * @returns {string} Monto formateado
     */
    static formatCOP(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Crea separador visual
     * @returns {string}
     */
    static separator() {
        return '━'.repeat(40);
    }

    /**
     * Crea título formateado
     * @param {string} title
     * @returns {string}
     */
    static title(title) {
        return `\n${this.separator()}\n${title}\n${this.separator()}\n`;
    }

    /**
     * Formatea área en metros cuadrados
     * @param {number} area
     * @returns {string}
     */
    static formatArea(area) {
        return `${area} m²`;
    }
}

export default MessageFormatter;
