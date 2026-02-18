/**
 * Gestor de sesiones de usuario
 */

export class SessionManager {
    constructor() {
        this.sessions = new Map();
    }

    /**
     * Crea o obtiene una sesión
     */
    getSession(userId) {
        if (!this.sessions.has(userId)) {
            this.sessions.set(userId, {
                userId,
                createdAt: new Date(),
                lastInteraction: new Date(),
                stage: 'welcome', // welcome, menu, viewing
                viewingOption: null
            });
        }
        return this.sessions.get(userId);
    }

    /**
     * Actualiza la sesión
     */
    updateSession(userId, updates) {
        const session = this.getSession(userId);
        Object.assign(session, {
            ...updates,
            lastInteraction: new Date()
        });
        this.sessions.set(userId, session);
    }

    /**
     * Limpia sesiones antiguas (más de 1 hora)
     */
    cleanupSessions() {
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        for (const [userId, session] of this.sessions) {
            if (session.lastInteraction.getTime() < oneHourAgo) {
                this.sessions.delete(userId);
            }
        }
    }

    /**
     * Resetea sesión
     */
    resetSession(userId) {
        const session = this.getSession(userId);
        session.stage = 'welcome';
        session.viewingOption = null;
    }
}

export default SessionManager;
