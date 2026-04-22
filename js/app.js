import { ChatUI } from './ui.js';
import { sendMessageToApi } from './api.js';

class ChatApp {
    constructor() {
        this.ui = new ChatUI('chat-form', 'chat-input', 'chat-box', 'send-btn');
        this.messages = [];
        this.init();
    }

    init() {
        const welcomeText = '¡Hola! Soy TutorIA, tu asistente educativo. 🎓\\n¿En qué te puedo ayudar a aprender hoy? (historia, matemáticas, ciencia, etc.)';
        this.ui.addMessage(welcomeText, 'bot');
        this.messages.push({ role: 'model', parts: [{ text: welcomeText }] });

        this.ui.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        document.getElementById('clear-chat').addEventListener('click', () => {
             this.ui.clearBox();
             this.messages = [];
             this.ui.addMessage(welcomeText, 'bot');
             this.messages.push({ role: 'model', parts: [{ text: welcomeText }] });
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const userText = this.ui.getInputValue();
        if (!userText) return;

        // Mostrar mensaje del usuario
        this.ui.addMessage(userText, 'user');
        this.ui.clearInput();

        // Añadir a historial para la API
        this.messages.push({ role: 'user', parts: [{ text: userText }] });

        this.ui.showTypingIndicator();

        try {
            const reply = await sendMessageToApi(this.messages);
            this.ui.removeTypingIndicator();
            this.ui.addMessage(reply, 'bot');
            this.messages.push({ role: 'model', parts: [{ text: reply }] });
        } catch (err) {
            this.ui.removeTypingIndicator();
            this.ui.addMessage('Hubo un error de conexión al intentar responder. Por favor, asegúrate de haber configurado tu API Key en los ajustes y prueba nuevamente.', 'bot');
            this.messages.pop(); // Remove the failed message attempt from context
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});
