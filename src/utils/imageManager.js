/**
 * Gestor de imágenes del apartamento
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_BASE_PATH = path.join(__dirname, '../../images');

export class ImageManager {
    /**
     * Obtiene las imágenes de una sección
     */
    static getImagesForSection(section) {
        try {
            const sectionPath = path.join(IMAGES_BASE_PATH, section);

            // Validar que la carpeta existe
            if (!fs.existsSync(sectionPath)) {
                return [];
            }

            // Leer archivos de la carpeta
            const files = fs.readdirSync(sectionPath)
                .filter(file => {
                    const ext = path.extname(file).toLowerCase();
                    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
                })
                .map(file => path.join(sectionPath, file));

            return files;
        } catch (error) {
            console.error(`Error leyendo imágenes de ${section}:`, error);
            return [];
        }
    }

    /**
     * Obtiene la ruta completa de una imagen
     */
    static getImagePath(section, filename) {
        const imagePath = path.join(IMAGES_BASE_PATH, section, filename);

        // Validar que el archivo existe y está dentro de la carpeta permitida
        if (fs.existsSync(imagePath) && imagePath.startsWith(IMAGES_BASE_PATH)) {
            return imagePath;
        }

        return null;
    }

    /**
     * Obtiene información sobre las imágenes de una sección
     */
    static getSectionInfo(section) {
        const images = this.getImagesForSection(section);

        return {
            section,
            totalImages: images.length,
            images: images.map(img => path.basename(img))
        };
    }

    /**
     * Mapeo de secciones a rutas de carpetas
     */
    static getSectionPath(sectionNumber) {
        const sectionMap = {
            1: 'sala',
            2: 'cocina',
            3: 'cuarto-principal',
            4: 'baño-principal',
            5: 'baño-secundario',
            6: 'cuartos-extras',
            7: 'pasillo',
            8: 'zonas-comunes'
        };

        return sectionMap[sectionNumber] || null;
    }

    /**
     * Obtiene el nombre descriptivo de una sección
     */
    static getSectionName(sectionNumber) {
        const nameMap = {
            1: 'Sala',
            2: 'Cocina',
            3: 'Cuarto principal',
            4: 'Baño principal',
            5: 'Baño secundario',
            6: 'Cuartos extras',
            7: 'Pasillo',
            8: 'Zonas comunes'
        };

        return nameMap[sectionNumber] || 'Sección desconocida';
    }
}

export default ImageManager;
