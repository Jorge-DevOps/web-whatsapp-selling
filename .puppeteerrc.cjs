/**
 * Configuración de Puppeteer para whatsapp-web.js
 */
module.exports = {
  // Usar Chromium en lugar de descargar Chrome
  executablePath: '/usr/bin/chromium-browser',
  
  // Configuración para ejecutarse en Docker/contenedor
  skipChromeDownload: true,
  
  // Args por defecto para Chromium
  defaultViewport: null,
  
  // Configuración de lanzamiento
  launchArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-gpu',
    '--single-process',
    '--no-first-run',
    '--no-default-browser-check'
  ]
};
