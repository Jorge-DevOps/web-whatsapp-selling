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

    /**
     * Valida años de experiencia como entero positivo o cero
     * @param {string} input - Entrada del usuario
     * @returns {boolean} True si es válido
     */
    static isValidYearsExperience(input) {
        return /^\d+$/.test((input || '').trim());
    }

    /**
     * Valida expectativa salarial mensual en formato moneda local
     * Acepta formatos como: 2500000, 2.500.000, $2,500,000, COP 2500000
     * @param {string} input - Entrada del usuario
     * @returns {boolean} True si es válido
     */
    static isValidMonthlySalary(input) {
        const value = (input || '').trim();
        if (!value) return false;

        // Permite prefijo de moneda y separadores comunes de miles/decimales
        return /^(?:[A-Za-z]{2,4}\s*)?(?:[$€£]\s*)?\d[\d\s.,]*$/.test(value);
    }

    /**
     * Valida que la hoja de vida sea PDF o documento Word
     * @param {string} mimetype - Mimetype del archivo
     * @param {string} filename - Nombre del archivo
     * @returns {boolean} True si es válido
     */
    static isValidResumeDocument(mimetype, filename = '') {
        const allowedMimeTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (allowedMimeTypes.includes(mimetype)) return true;

        const lowerName = (filename || '').toLowerCase();
        return lowerName.endsWith('.pdf') || lowerName.endsWith('.doc') || lowerName.endsWith('.docx');
    }
}

export default InputValidator;
