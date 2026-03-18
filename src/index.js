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

// Set para rastrear chats que están siendo manejados por humanos
const humanChats = new Set();

// Caché de números bloqueados en memoria
let blockedNumbersCache = [];

/**
 * Carga la blocklist del archivo y la almacena en caché
 */
function reloadBlockedNumbers() {
    try {
        const blockedConfig = JSON.parse(fs.readFileSync('./src/data/blockedNumbers.json', 'utf8'));
        blockedNumbersCache = blockedConfig.blockedNumbers || [];
        console.log(`✅ Blocklist cargada: ${blockedNumbersCache.length} números bloqueados`);
        return blockedNumbersCache;
    } catch (error) {
        console.log('⚠️  No se pudo cargar lista de números bloqueados');
        blockedNumbersCache = [];
        return [];
    }
}
function loadAdminConfig() {
    try {
        return JSON.parse(fs.readFileSync('./src/data/adminConfig.json', 'utf8'));
    } catch (error) {
        console.log('⚠️  No se pudo cargar configuración de admin');
        return null;
    }
}

/**
 * Verifica si un número es el administrador
 */
function isAdmin(phoneNumber) {
    const adminConfig = loadAdminConfig();
    if (!adminConfig) return false;
    return phoneNumber.includes(adminConfig.adminPhoneNumber.replace(/\s+/g, '')) ||
        adminConfig.adminPhoneNumber.includes(phoneNumber.replace(/\s+/g, ''));
}

/**
 * Carga la lista de números bloqueados desde el archivo de configuración
 */
function loadBlockedNumbers() {
    return blockedNumbersCache;
}

/**
 * Extrae y normaliza el número telefónico del userId de WhatsApp
 * Convierte: 4080604839952@lid → +57 408 0604839952
 * O: +57 3058158944 → +57 305 8158944
 */
function normalizeUserId(userId) {
    // Extraer solo la parte numérica (remover @lid, @s.whatsapp.net, etc)
    let numberOnly = userId.replace(/@.*$/, '').replace(/\s+/g, '');

    // Si no tiene +, agregar +57
    if (!numberOnly.startsWith('+')) {
        numberOnly = '+57' + numberOnly;
    }

    // Formatear como +57 XXX XXXXXXX
    const match = numberOnly.match(/(\+\d{2})(\d{3})(\d{7})/);
    if (match) {
        return `${match[1]} ${match[2]} ${match[3]}`;
    }

    return numberOnly;
}

/**
 * Normaliza un número telefónico al formato +57 XXX XXXXXXX
 */
function normalizePhoneNumber(phoneNumber) {
    let clean = phoneNumber.trim().replace(/\s+/g, '');

    // Si no tiene +, agregar +57
    if (!clean.startsWith('+')) {
        clean = '+57' + clean;
    }

    // Formatear como +57 XXX XXXXXXX
    const match = clean.match(/(\+\d{2})(\d{3})(\d{7})/);
    if (match) {
        return `${match[1]} ${match[2]} ${match[3]}`;
    }

    return clean;
}

/**
 * Agrega un número a la lista de bloqueados
 */
function addToBlockedNumbers(phoneNumber) {
    try {
        const blockedConfig = JSON.parse(fs.readFileSync('./src/data/blockedNumbers.json', 'utf8'));

        // Normalizar el número
        const normalizedNumber = normalizePhoneNumber(phoneNumber);

        // Evitar duplicados (comparar sin espacios)
        const cleanForComparison = normalizedNumber.replace(/\s+/g, '');
        const isDuplicate = blockedConfig.blockedNumbers.some(num =>
            num.replace(/\s+/g, '') === cleanForComparison
        );

        if (!isDuplicate) {
            blockedConfig.blockedNumbers.push(normalizedNumber);
            fs.writeFileSync('./src/data/blockedNumbers.json', JSON.stringify(blockedConfig, null, 2));
            // Actualizar caché
            blockedNumbersCache.push(normalizedNumber);
            return { success: true, number: normalizedNumber };
        }
        return { success: false, number: normalizedNumber, reason: 'duplicate' };
    } catch (error) {
        console.error('Error agregando número a bloqueados:', error);
        return { success: false, reason: 'error' };
    }
}

/**
 * Remueve un número de la lista de bloqueados
 */
function removeFromBlockedNumbers(phoneNumber) {
    try {
        const blockedConfig = JSON.parse(fs.readFileSync('./src/data/blockedNumbers.json', 'utf8'));
        const normalizedNumber = normalizePhoneNumber(phoneNumber);
        const cleanForComparison = normalizedNumber.replace(/\s+/g, '');
        const initialLength = blockedConfig.blockedNumbers.length;

        blockedConfig.blockedNumbers = blockedConfig.blockedNumbers.filter(num =>
            num.replace(/\s+/g, '') !== cleanForComparison
        );

        if (blockedConfig.blockedNumbers.length < initialLength) {
            fs.writeFileSync('./src/data/blockedNumbers.json', JSON.stringify(blockedConfig, null, 2));
            // Actualizar caché
            blockedNumbersCache = blockedNumbersCache.filter(num =>
                num.replace(/\s+/g, '') !== cleanForComparison
            );
            return { success: true, number: normalizedNumber };
        }
        return { success: false, number: normalizedNumber, reason: 'not_found' };
    } catch (error) {
        console.error('Error removiendo número de bloqueados:', error);
        return { success: false, reason: 'error' };
    }
}

/**
 * Obtiene la lista actual de números bloqueados
 */
function getBlockedNumbers() {
    return blockedNumbersCache;
}

/**
 * Verifica si un número está en la lista de bloqueados
 */
function isNumberBlocked(phoneNumber) {
    // Normalizar el phoneNumber en caso de que venga en formato userId de WhatsApp
    const normalizedPhone = normalizeUserId(phoneNumber);
    const cleanPhone = normalizedPhone.replace(/\s+/g, '');

    const blockedNumbers = loadBlockedNumbers();
    return blockedNumbers.some(blocked => {
        const cleanBlocked = blocked.replace(/\s+/g, '');
        return cleanPhone.includes(cleanBlocked) || cleanBlocked.includes(cleanPhone);
    });
}

/**
 * Procesa comandos de administrador
 */
async function processAdminCommand(message, userInput, userId) {
    const command = userInput.toLowerCase().trim();

    // Comando: /bloquear +57 XXX XXXXXXX
    if (command.startsWith('/bloquear ')) {
        const phoneNumber = userInput.substring(9).trim();
        if (phoneNumber) {
            const result = addToBlockedNumbers(phoneNumber);
            if (result.success) {
                await message.reply(`✅ *Número agregado a la blacklist*\n\n${result.number}`);
            } else if (result.reason === 'duplicate') {
                await message.reply(`⚠️  Este número ya estaba en la blacklist\n\n${result.number}`);
            } else {
                await message.reply(`❌ Error al agregar el número`);
            }
        } else {
            await message.reply('❌ Uso: /bloquear +57 XXX XXXXXXX');
        }
        return true;
    }

    // Comando: /desbloquear +57 XXX XXXXXXX
    if (command.startsWith('/desbloquear ')) {
        const phoneNumber = userInput.substring(13).trim();
        if (phoneNumber) {
            const result = removeFromBlockedNumbers(phoneNumber);
            if (result.success) {
                await message.reply(`✅ *Número removido de la blacklist*\n\n${result.number}`);
            } else if (result.reason === 'not_found') {
                await message.reply(`⚠️  Este número no estaba en la blacklist`);
            } else {
                await message.reply(`❌ Error al remover el número`);
            }
        } else {
            await message.reply('❌ Uso: /desbloquear +57 XXX XXXXXXX');
        }
        return true;
    }

    // Comando: /listar
    if (command === '/listar') {
        const blockedNumbers = getBlockedNumbers();
        if (blockedNumbers.length > 0) {
            const list = blockedNumbers.map((num, i) => `${i + 1}. ${num}`).join('\n');
            await message.reply(`📋 *Números bloqueados:*\n\n${list}`);
        } else {
            await message.reply('📋 No hay números bloqueados');
        }
        return true;
    }

    return false;
}

/**
 * Detecta si el mensaje contiene información de un anuncio
 * Busca patrones como MC (Metrocuadrado), URL de anuncios, etc.
 */
function extractAnnouncementInfo(message) {
    // Buscar ID de Metrocuadrado (patrón: MC + números)
    const mcIdMatch = message.match(/MC\d+/);
    if (mcIdMatch) {
        return {
            type: 'metrocuadrado',
            id: mcIdMatch[0],
            fullMessage: message
        };
    }

    // Buscar URLs de Metrocuadrado
    if (message.includes('metrocuadrado.com')) {
        return {
            type: 'metrocuadrado_url',
            fullMessage: message
        };
    }

    return null;
}

const CANDIDATE_INTERVIEW_STEPS = {
    FULL_NAME: 'full_name',
    RESUME: 'resume',
    MODISTERIA_YEARS: 'modisteria_years',
    MAQUINA_PLANA_YEARS: 'maquina_plana_years',
    FILETEADORA_YEARS: 'fileteadora_years',
    COLLARIN_YEARS: 'collarin_years',
    SALARY_EXPECTATION: 'salary_expectation',
    COMPLETED: 'completed'
};

function createEmptyCandidateProfile() {
    return {
        fullName: '',
        resumeReceived: false,
        resumeFileName: '',
        modisteriaYears: '',
        maquinaPlanaYears: '',
        fileteadoraYears: '',
        collarinYears: '',
        salaryExpectation: ''
    };
}

function getCandidateQuestion(step) {
    const questions = {
        [CANDIDATE_INTERVIEW_STEPS.FULL_NAME]: '1. ¿Cuál es tu nombre completo?',
        [CANDIDATE_INTERVIEW_STEPS.RESUME]: '2. Por favor, sube tu hoja de vida en PDF o documento (DOC/DOCX).',
        [CANDIDATE_INTERVIEW_STEPS.MODISTERIA_YEARS]: '3. ¿Cuántos años de experiencia tienes en modistería? (Solo número, ej: 2)',
        [CANDIDATE_INTERVIEW_STEPS.MAQUINA_PLANA_YEARS]: '4. ¿Cuántos años de experiencia tienes manejando máquina plana? (Solo número, ej: 2)',
        [CANDIDATE_INTERVIEW_STEPS.FILETEADORA_YEARS]: '5. ¿Cuántos años de experiencia tienes manejando máquina fileteadora? (Solo número, ej: 2)',
        [CANDIDATE_INTERVIEW_STEPS.COLLARIN_YEARS]: '6. ¿Cuántos años de experiencia tienes manejando máquina collarín? (Solo número, ej: 2)',
        [CANDIDATE_INTERVIEW_STEPS.SALARY_EXPECTATION]: '7. ¿Cuál es tu expectativa salarial mensual? (Ej: $2.000.000 COP)'
    };

    return questions[step] || '';
}

function getNextInterviewStep(currentStep) {
    const order = [
        CANDIDATE_INTERVIEW_STEPS.FULL_NAME,
        CANDIDATE_INTERVIEW_STEPS.RESUME,
        CANDIDATE_INTERVIEW_STEPS.MODISTERIA_YEARS,
        CANDIDATE_INTERVIEW_STEPS.MAQUINA_PLANA_YEARS,
        CANDIDATE_INTERVIEW_STEPS.FILETEADORA_YEARS,
        CANDIDATE_INTERVIEW_STEPS.COLLARIN_YEARS,
        CANDIDATE_INTERVIEW_STEPS.SALARY_EXPECTATION
    ];

    const currentIndex = order.indexOf(currentStep);
    if (currentIndex === -1 || currentIndex === order.length - 1) {
        return CANDIDATE_INTERVIEW_STEPS.COMPLETED;
    }

    return order[currentIndex + 1];
}

function getMissingCandidateField(profile) {
    if (!profile.fullName) return CANDIDATE_INTERVIEW_STEPS.FULL_NAME;
    if (!profile.resumeReceived) return CANDIDATE_INTERVIEW_STEPS.RESUME;
    if (profile.modisteriaYears === '') return CANDIDATE_INTERVIEW_STEPS.MODISTERIA_YEARS;
    if (profile.maquinaPlanaYears === '') return CANDIDATE_INTERVIEW_STEPS.MAQUINA_PLANA_YEARS;
    if (profile.fileteadoraYears === '') return CANDIDATE_INTERVIEW_STEPS.FILETEADORA_YEARS;
    if (profile.collarinYears === '') return CANDIDATE_INTERVIEW_STEPS.COLLARIN_YEARS;
    if (!profile.salaryExpectation) return CANDIDATE_INTERVIEW_STEPS.SALARY_EXPECTATION;
    return null;
}

function buildCandidateSummary(profile) {
    return (
        `Resumen del candidato:\n\n` +
        `Nombre: ${profile.fullName}\n` +
        `Hoja de vida recibida: ${profile.resumeReceived ? 'Sí' : 'No'}\n` +
        `Experiencia en modistería: ${profile.modisteriaYears}\n` +
        `Experiencia máquina plana: ${profile.maquinaPlanaYears}\n` +
        `Experiencia máquina fileteadora: ${profile.fileteadoraYears}\n` +
        `Experiencia máquina collarín: ${profile.collarinYears}\n` +
        `Expectativa salarial: ${profile.salaryExpectation}`
    );
}

function getRetryMessageForStep(step) {
    const messages = {
        [CANDIDATE_INTERVIEW_STEPS.FULL_NAME]:
            'Por favor, ingresa tu nombre completo para continuar.',
        [CANDIDATE_INTERVIEW_STEPS.RESUME]:
            'Necesito que subas tu hoja de vida en PDF o documento (DOC/DOCX) para continuar.',
        [CANDIDATE_INTERVIEW_STEPS.MODISTERIA_YEARS]:
            'Dato no válido. Ingresa solo números en años de experiencia (ej: 2, 5, 10).',
        [CANDIDATE_INTERVIEW_STEPS.MAQUINA_PLANA_YEARS]:
            'Dato no válido. Ingresa solo números en años de experiencia (ej: 2, 5, 10).',
        [CANDIDATE_INTERVIEW_STEPS.FILETEADORA_YEARS]:
            'Dato no válido. Ingresa solo números en años de experiencia (ej: 2, 5, 10).',
        [CANDIDATE_INTERVIEW_STEPS.COLLARIN_YEARS]:
            'Dato no válido. Ingresa solo números en años de experiencia (ej: 2, 5, 10).',
        [CANDIDATE_INTERVIEW_STEPS.SALARY_EXPECTATION]:
            'Dato no válido. Ingresa un valor mensual en moneda local (ej: $2.000.000 COP).'
    };

    return messages[step] || 'La información no es válida. Intenta nuevamente.';
}

// Inicializar cliente
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'selling-bot'
    }),
    puppeteer: {
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--no-first-run',
            '--no-default-browser-check',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-software-rasterizer',
            '--disable-web-security',
            '--disable-features=TranslateUI'
        ]
    }
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

    // Cargar la lista de números bloqueados al iniciar
    reloadBlockedNumbers();
});

/**
 * Evento: Cliente desconectado
 */
client.on('disconnected', (reason) => {
    console.log(`⚠️  Bot desconectado: ${reason}`);
});

/**
 * Evento: Error del cliente
 */
client.on('error', (error) => {
    console.error('❌ Error del cliente:', error);
    if (error.message && error.message.includes('SIGTERM')) {
        console.log('📴 Recibida señal de cierre');
        process.exit(0);
    }
});

/**
 * Evento: Mensaje recibido
 */
client.on('message', async (message) => {
    try {
        const userId = message.from;
        const userInput = message.body.trim();

        // Verificar si el número está bloqueado
        if (isNumberBlocked(userId)) {
            console.log(`🚫 Número bloqueado: ${userId} - Ignorando mensaje`);
            return;
        }

        // Verificar si el chat está en modo humano (opción 9)
        if (humanChats.has(userId)) {
            console.log(`👤 Chat ${userId} está en modo humano - Ignorando mensaje del bot`);
            return;
        }

        // Verificar si es admin y procesar comandos especiales
        if (isAdmin(userId)) {
            if (userInput.startsWith('/')) {
                const isAdminCommand = await processAdminCommand(message, userInput, userId);
                if (isAdminCommand) {
                    return;
                }
            }
        }

        // Obtener sesión del usuario
        const session = sessionManager.getSession(userId);

        // Guardar el número telefónico real en la sesión si no lo tiene
        if (!session.phoneNumber) {
            try {
                // Obtener el contacto para extraer el número telefónico real
                const contact = await message.getContact();
                let phoneNumber = contact.number; // Formato: XXXXXXXXXX o +XXXXXXXXXXX

                // Normalizar el número
                if (phoneNumber) {
                    // Remover caracteres especiales
                    phoneNumber = phoneNumber.replace(/\D/g, '');
                    // Agregar +57 si no tiene código de país
                    if (!phoneNumber.startsWith('57')) {
                        phoneNumber = '57' + phoneNumber;
                    }
                    // Formatear como +57 XXX XXXXXXX
                    const match = phoneNumber.match(/(\d{2})(\d{3})(\d{7})/);
                    if (match) {
                        phoneNumber = `+${match[1]} ${match[2]} ${match[3]}`;
                    } else {
                        phoneNumber = '+' + phoneNumber;
                    }
                } else {
                    // Si no podemos obtener el número del contacto, usar el userId normalizado
                    phoneNumber = normalizeUserId(userId);
                }

                sessionManager.updateSession(userId, { phoneNumber });
            } catch (error) {
                console.log(`⚠️  No se pudo obtener número de contacto para ${userId}, usando ID normalizado`);
                const phoneNumber = normalizeUserId(userId);
                sessionManager.updateSession(userId, { phoneNumber });
            }
        }

        console.log(`📨 Mensaje de ${userId}: ${userInput}`);

        // Detectar información de anuncios - ANTES de validar números
        const announcementInfo = extractAnnouncementInfo(userInput);
        if (announcementInfo) {
            sessionManager.updateSession(userId, {
                currentAnnouncement: announcementInfo,
                stage: 'menu'
            });
            console.log(`🏠 Anuncio detectado:`, announcementInfo);
            await message.reply(
                `✅ *Anuncio detectado: ${announcementInfo.id || 'Metrocuadrado'}*\n\n` +
                `Te mostraremos toda la información disponible sobre esta propiedad.\n\n`
            );
            await message.reply(Menu.mainMenu());
            return;
        }

        // Lógica según etapa de sesión
        if (session.stage === 'welcome') {
            // Primera interacción: mostrar menú
            sessionManager.updateSession(userId, { stage: 'menu' });
            await message.reply(Menu.welcomeMessage());
            await message.reply(Menu.mainMenu());
        }
        else if (session.stage === 'menu') {
            // Usuario en menú principal
            if (!InputValidator.isValidMenuOption(userInput, 0, 1)) {
                await message.reply(Menu.invalidOptionMessage());
                return;
            }

            const option = parseInt(userInput);

            if (option === 0) {
                // Volver al menú
                await message.reply(Menu.mainMenu());
            }
            else {
                // Procesar opción 1: iniciar postulación
                const response = processMenuOption(option);

                if (option === 1) {
                    sessionManager.updateSession(userId, {
                        viewingOption: option,
                        stage: 'candidate_interview',
                        interviewStep: CANDIDATE_INTERVIEW_STEPS.FULL_NAME,
                        candidateProfile: createEmptyCandidateProfile()
                    });
                } else {
                    sessionManager.updateSession(userId, { viewingOption: option, stage: 'menu' });
                }

                await message.reply(response);

                if (option === 1) {
                    await message.reply(getCandidateQuestion(CANDIDATE_INTERVIEW_STEPS.FULL_NAME));
                }

                if (option !== 1) {
                    await message.reply(Menu.mainMenu());
                }
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
        else if (session.stage === 'candidate_interview') {
            // Entrevista guiada: una sola pregunta por turno
            if (userInput === '0') {
                sessionManager.updateSession(userId, {
                    stage: 'menu',
                    interviewStep: null,
                    candidateProfile: null
                });
                await message.reply(Menu.mainMenu());
                return;
            }

            let candidateProfile = session.candidateProfile || createEmptyCandidateProfile();
            let interviewStep = session.interviewStep || CANDIDATE_INTERVIEW_STEPS.FULL_NAME;

            if (interviewStep === CANDIDATE_INTERVIEW_STEPS.FULL_NAME) {
                const fullName = userInput.replace(/\s+/g, ' ').trim();
                if (!fullName || fullName.split(' ').length < 2) {
                    await message.reply(getRetryMessageForStep(CANDIDATE_INTERVIEW_STEPS.FULL_NAME));
                    await message.reply(getCandidateQuestion(CANDIDATE_INTERVIEW_STEPS.FULL_NAME));
                    return;
                }

                candidateProfile.fullName = fullName;
                interviewStep = getNextInterviewStep(interviewStep);
                sessionManager.updateSession(userId, { candidateProfile, interviewStep });
                await message.reply(getCandidateQuestion(interviewStep));
                return;
            }

            if (interviewStep === CANDIDATE_INTERVIEW_STEPS.RESUME) {
                if (!message.hasMedia) {
                    await message.reply(getRetryMessageForStep(CANDIDATE_INTERVIEW_STEPS.RESUME));
                    await message.reply(getCandidateQuestion(CANDIDATE_INTERVIEW_STEPS.RESUME));
                    return;
                }

                try {
                    const media = await message.downloadMedia();
                    const isValidResume = InputValidator.isValidResumeDocument(media.mimetype, media.filename || '');

                    if (!isValidResume) {
                        await message.reply('El archivo recibido no es válido. Solo se aceptan PDF, DOC o DOCX.');
                        await message.reply(getCandidateQuestion(CANDIDATE_INTERVIEW_STEPS.RESUME));
                        return;
                    }

                    candidateProfile.resumeReceived = true;
                    candidateProfile.resumeFileName = media.filename || 'Documento sin nombre';

                    console.log(`📎 Hoja de vida recibida de ${userId}:`, {
                        mimetype: media.mimetype,
                        size: media.data.length,
                        filename: media.filename
                    });

                    interviewStep = getNextInterviewStep(interviewStep);
                    sessionManager.updateSession(userId, { candidateProfile, interviewStep });
                    await message.reply(getCandidateQuestion(interviewStep));
                    return;
                } catch (downloadError) {
                    console.error('Error descargando hoja de vida:', downloadError);
                    await message.reply('No pude procesar el archivo. Intenta subir nuevamente tu hoja de vida en PDF o documento.');
                    await message.reply(getCandidateQuestion(CANDIDATE_INTERVIEW_STEPS.RESUME));
                    return;
                }
            }

            if (interviewStep === CANDIDATE_INTERVIEW_STEPS.MODISTERIA_YEARS) {
                if (!InputValidator.isValidYearsExperience(userInput)) {
                    await message.reply(getRetryMessageForStep(CANDIDATE_INTERVIEW_STEPS.MODISTERIA_YEARS));
                    await message.reply(getCandidateQuestion(CANDIDATE_INTERVIEW_STEPS.MODISTERIA_YEARS));
                    return;
                }

                candidateProfile.modisteriaYears = userInput.trim();
                interviewStep = getNextInterviewStep(interviewStep);
                sessionManager.updateSession(userId, { candidateProfile, interviewStep });
                await message.reply(getCandidateQuestion(interviewStep));
                return;
            }

            if (interviewStep === CANDIDATE_INTERVIEW_STEPS.MAQUINA_PLANA_YEARS) {
                if (!InputValidator.isValidYearsExperience(userInput)) {
                    await message.reply(getRetryMessageForStep(CANDIDATE_INTERVIEW_STEPS.MAQUINA_PLANA_YEARS));
                    await message.reply(getCandidateQuestion(CANDIDATE_INTERVIEW_STEPS.MAQUINA_PLANA_YEARS));
                    return;
                }

                candidateProfile.maquinaPlanaYears = userInput.trim();
                interviewStep = getNextInterviewStep(interviewStep);
                sessionManager.updateSession(userId, { candidateProfile, interviewStep });
                await message.reply(getCandidateQuestion(interviewStep));
                return;
            }

            if (interviewStep === CANDIDATE_INTERVIEW_STEPS.FILETEADORA_YEARS) {
                if (!InputValidator.isValidYearsExperience(userInput)) {
                    await message.reply(getRetryMessageForStep(CANDIDATE_INTERVIEW_STEPS.FILETEADORA_YEARS));
                    await message.reply(getCandidateQuestion(CANDIDATE_INTERVIEW_STEPS.FILETEADORA_YEARS));
                    return;
                }

                candidateProfile.fileteadoraYears = userInput.trim();
                interviewStep = getNextInterviewStep(interviewStep);
                sessionManager.updateSession(userId, { candidateProfile, interviewStep });
                await message.reply(getCandidateQuestion(interviewStep));
                return;
            }

            if (interviewStep === CANDIDATE_INTERVIEW_STEPS.COLLARIN_YEARS) {
                if (!InputValidator.isValidYearsExperience(userInput)) {
                    await message.reply(getRetryMessageForStep(CANDIDATE_INTERVIEW_STEPS.COLLARIN_YEARS));
                    await message.reply(getCandidateQuestion(CANDIDATE_INTERVIEW_STEPS.COLLARIN_YEARS));
                    return;
                }

                candidateProfile.collarinYears = userInput.trim();
                interviewStep = getNextInterviewStep(interviewStep);
                sessionManager.updateSession(userId, { candidateProfile, interviewStep });
                await message.reply(getCandidateQuestion(interviewStep));
                return;
            }

            if (interviewStep === CANDIDATE_INTERVIEW_STEPS.SALARY_EXPECTATION) {
                if (!InputValidator.isValidMonthlySalary(userInput)) {
                    await message.reply(getRetryMessageForStep(CANDIDATE_INTERVIEW_STEPS.SALARY_EXPECTATION));
                    await message.reply(getCandidateQuestion(CANDIDATE_INTERVIEW_STEPS.SALARY_EXPECTATION));
                    return;
                }

                candidateProfile.salaryExpectation = userInput.trim();

                const missingField = getMissingCandidateField(candidateProfile);
                if (missingField) {
                    sessionManager.updateSession(userId, { candidateProfile, interviewStep: missingField });
                    await message.reply('Aún falta información para completar tu postulación.');
                    await message.reply(getCandidateQuestion(missingField));
                    return;
                }

                const summary = buildCandidateSummary(candidateProfile);

                sessionManager.updateSession(userId, {
                    candidateProfile,
                    interviewStep: CANDIDATE_INTERVIEW_STEPS.COMPLETED,
                    stage: 'menu'
                });

                await message.reply(summary);
                await message.reply('Gracias por compartir tu información. Se revisará tu perfil y si cumple con los requisitos del cargo nos estaremos comunicando contigo.');
                return;
            }

            await message.reply('No entendí tu respuesta. Continuemos con la entrevista.');
            await message.reply(getCandidateQuestion(interviewStep));
        }
        else if (session.stage === 'scheduling_visit') {
            // Usuario en proceso de agendar visita (opción 8)
            if (userInput === '0') {
                // Volver al menú principal
                sessionManager.updateSession(userId, { stage: 'menu' });
                await message.reply(Menu.mainMenu());
            }
            else if (userInput.trim()) {
                // Recibir información de la visita
                console.log(`📅 Información de visita de ${userId}:`, userInput);

                // Guardar información en la sesión
                if (!session.visitInfo) {
                    session.visitInfo = [];
                }
                session.visitInfo.push(userInput);
                sessionManager.updateSession(userId, { visitInfo: session.visitInfo });

                await message.reply(
                    `✅ *Información recibida*\n\n` +
                    `"${userInput}"\n\n` +
                    `Puedes enviar más información (teléfono, fecha, hora, etc.) o escribe *0* para volver al menú principal.`
                );
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
 * Procesa las opciones del menú
 */
function processMenuOption(option) {
    const handlerMap = {
        1: () => Handlers.handleOption1()
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
(async () => {
    try {
        console.log('🚀 Iniciando bot...');
        await client.initialize();
    } catch (error) {
        console.error('❌ Error al inicializar el cliente:', error);
        process.exit(1);
    }
})();

/**
 * Manejo de señales de salida
 */
process.on('SIGINT', () => {
    console.log('\n\n👋 Cerrando bot...');
    client.destroy();
    process.exit(0);
});

export { client, sessionManager };
