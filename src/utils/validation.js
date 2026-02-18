/**
 * Validación de entradas del usuario
 */

export class InputValidator {
    /**
     * Valida que la entrada sea un número entre rango especificado
     * @param {string} input - Entrada del usuario
     * @param {number} min - Número mínimo
     * @param {number} max - Número máximo
     * @returns {boolean} True si es válido
     */
    static isValidMenuOption(input, min = 0, max = 9) {
        const num = parseInt(input.trim());
        return !isNaN(num) && num >= min && num <= max;
    }

    /**
     * Normaliza la entrada del usuario
     * @param {string} input - Entrada del usuario
     * @returns {string} Entrada normalizada
     */
    static normalizeInput(input) {
        return input.trim().toLowerCase();
    }

    /**
     * Valida formato de teléfono (básico)
     * @param {string} phone - Número telefónico
     * @returns {boolean} True si es válido
     */
    static isValidPhone(phone) {
        return /^\+?[\d\s\-()]{7,}$/.test(phone);
    }

    /**
     * Valida formato de email
     * @param {string} email - Email
     * @returns {boolean} True si es válido
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

export default InputValidator;
