/**
 * Configuración de Puppeteer para whatsapp-web.js
 */
module.exports = {
    // Usar Chromium en lugar de descargar Chrome
    executablePath: '/usr/bin/chromium',

    // Configuración para ejecutarse en Docker/contenedor
    skipChromeDownload: true,

    // Args por defecto para Chromium
    defaultViewport: null,

    // Configuración de lanzamiento
    launchArgs: [
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
};
