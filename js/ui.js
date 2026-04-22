export class ChatUI {
    constructor(formId, inputId, chatBoxId, btnId) {
        this.form = document.getElementById(formId);
        this.input = document.getElementById(inputId);
        this.chatBox = document.getElementById(chatBoxId);
        this.btn = document.getElementById(btnId);
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.input.addEventListener('input', () => {
            this.btn.disabled = this.input.value.trim().length === 0;
        });
    }

    getInputValue() {
        return this.input.value.trim();
    }
    
    clearInput() {
        this.input.value = '';
        this.btn.disabled = true;
    }

    addMessage(text, sender) {
        const wrapper = document.createElement('div');
        wrapper.className = `message-wrapper ${sender}`;
        
        const msgBubble = document.createElement('div');
        msgBubble.className = `message ${sender}`;
        
        if (sender === 'bot') {
            msgBubble.innerHTML = this.parseSimpleMarkdown(text);
        } else {
            msgBubble.textContent = text;
        }

        wrapper.appendChild(msgBubble);
        this.chatBox.appendChild(wrapper);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        this.removeTypingIndicator();

        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper bot typing-indicator-wrapper';
        wrapper.id = 'typing-indicator';

        const bubble = document.createElement('div');
        bubble.className = 'message bot typing-indicator';
        
        bubble.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;

        wrapper.appendChild(bubble);
        this.chatBox.appendChild(wrapper);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const el = document.getElementById('typing-indicator');
        if (el) el.remove();
    }

    scrollToBottom() {
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
    }
    
    clearBox() {
        this.chatBox.innerHTML = '';
    }

    parseSimpleMarkdown(text) {
        // Very basic markdown parser for paragraphs, bold, and italics.
        let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        const paragraphs = html.split('\n').filter(p => p.trim() !== '');
        return paragraphs.map(p => `<p>${p}</p>`).join('');
    }
}
