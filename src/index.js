/**
 * Archivo principal - Inicialización del bot
 */

import pkg from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = pkg;
import qrcode from 'qrcode-terminal';
import dotenv from 'dotenv';
import fs from 'fs';
import Menu from './menu.js';
import Handlers from './handlers.js';
import InputValidator from './utils/validation.js';
import { SessionManager } from './utils/sessionManager.js';

dotenv.config();

// Inicializar cliente
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'selling-bot'
    })
});

// Gestor de sesiones
const sessionManager = new SessionManager();

/**
 * Evento: QR generado para login
 */
client.on('qr', (qr) => {
    console.log('\n📱 Escanea este código QR con tu WhatsApp:');
    qrcode.generate(qr, { small: true });
    console.log('\n⏳ Esperando autenticación...\n');
});

/**
 * Evento: Cliente autenticado
 */
client.on('authenticated', () => {
    console.log('✅ Bot autenticado correctamente\n');
});

/**
 * Evento: Cliente listo
 */
client.on('ready', () => {
    console.log('🤖 Bot iniciado y listo para recibir mensajes');
    console.log('━'.repeat(50));
});

/**
 * Evento: Mensaje recibido
 */
client.on('message', async (message) => {
    try {
        const userId = message.from;
        const userInput = message.body.trim();

        // Obtener sesión del usuario
        const session = sessionManager.getSession(userId);

        console.log(`📨 Mensaje de ${userId}: ${userInput}`);

        // Lógica según etapa de sesión
        if (session.stage === 'welcome') {
            // Primera interacción: mostrar menú
            sessionManager.updateSession(userId, { stage: 'menu' });
            await message.reply(Menu.mainMenu());
        }
        else if (session.stage === 'menu') {
            // Usuario en menú principal
            if (!InputValidator.isValidMenuOption(userInput, 0, 11)) {
                await message.reply(Menu.invalidOptionMessage());
                return;
            }

            const option = parseInt(userInput);

            if (option === 0) {
                // Volver al menú
                await message.reply(Menu.mainMenu());
            }
            else if (option === 2) {
                // Opción de Ver fotos - mostrar submenu
                sessionManager.updateSession(userId, { stage: 'photos_menu', viewingOption: option });
                await message.reply(Menu.photosMenu());
            }
            else {
                // Procesar opciones 1, 3-10 (excepto 2 que tiene submenu)
                const response = processMenuOption(option);
                sessionManager.updateSession(userId, { viewingOption: option, stage: 'menu' });
                await message.reply(response);
                await message.reply(Menu.mainMenu());
            }
        }
        else if (session.stage === 'photos_menu') {
            // Usuario en menú de fotos
            if (!InputValidator.isValidMenuOption(userInput, 0, 9)) {
                await message.reply(Menu.invalidOptionMessage());
                return;
            }

            const option = parseInt(userInput);

            if (option === 0) {
                // Volver al menú principal
                sessionManager.updateSession(userId, { stage: 'menu' });
                await message.reply(Menu.mainMenu());
            }
            else {
                // Procesar opciones de fotos (1-9)
                const photoData = Handlers.getPhotosForSection(option);

                if (!photoData) {
                    await message.reply(Menu.invalidOptionMessage());
                    return;
                }

                // Enviar mensaje de texto
                await message.reply(photoData.text);

                // Enviar imágenes si existen
                if (photoData.images && photoData.images.length > 0) {
                    for (const imagePath of photoData.images) {
                        try {
                            const imageData = fs.readFileSync(imagePath);
                            const base64Data = imageData.toString('base64');
                            const ext = imagePath.split('.').pop().toLowerCase();
                            const mimeType = {
                                'jpg': 'image/jpeg',
                                'jpeg': 'image/jpeg',
                                'png': 'image/png',
                                'gif': 'image/gif',
                                'webp': 'image/webp'
                            }[ext] || 'image/jpeg';

                            const media = new MessageMedia(mimeType, base64Data);
                            await message.reply(media);
                        } catch (imageError) {
                            console.error('Error enviando imagen:', imageError);
                        }
                    }
                }

                // Volver a mostrar el menú de fotos
                await message.reply(Menu.photosMenu());
            }
        }
    }
    catch (error) {
        console.error('❌ Error procesando mensaje:', error);
        await message.reply(
            'Disculpa, hubo un error. Por favor, intenta nuevamente.'
        );
    }
});

/**
 * Procesa las opciones del menú (1-11)
 */
function processMenuOption(option) {
    const handlerMap = {
        1: () => Handlers.handleOption1(),
        2: () => Handlers.handleOption2(),
        3: () => Handlers.handleOption3(),
        4: () => Handlers.handleOption4(),
        5: () => Handlers.handleOption5(),
        6: () => Handlers.handleOption6(),
        7: () => Handlers.handleOption7(),
        8: () => Handlers.handleOption8(),
        9: () => Handlers.handleOption9(),
        10: () => Handlers.handleOption10(),
        11: () => Handlers.handleOption11()
    };

    const handler = handlerMap[option];
    return handler ? handler() : '❌ Opción no reconocida';
}

/**
 * Evento: Error de desconexión
 */
client.on('disconnected', (reason) => {
    console.log('⚠️  Bot desconectado:', reason);
    process.exit(1);
});

/**
 * Limpieza de sesiones antiguas cada 30 minutos
 */
setInterval(() => {
    sessionManager.cleanupSessions();
    console.log('🧹 Sesiones antiguas limpiadas');
}, 30 * 60 * 1000);

/**
 * Iniciar cliente
 */
client.initialize();

/**
 * Manejo de señales de salida
 */
process.on('SIGINT', () => {
    console.log('\n\n👋 Cerrando bot...');
    client.destroy();
    process.exit(0);
});

export { client, sessionManager };
