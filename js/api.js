import { GoogleGenAI } from '@google/genai';

// Instanciamos el cliente en el frontend. En el entorno de AI Studio, 
// la clave es inyectada mediante Vite y el proxy intercepta la petición.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function sendMessageToApi(messages) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.1-pro-preview',
            contents: messages,
            config: {
                systemInstruction: "Eres 'TutorIA', un chatbot educativo amigable e interactivo. Responde a preguntas de los estudiantes de manera muy clara, empática y constructiva. Divide los conceptos complejos en analogías simples. Usa un tono animado y fomenta la curiosidad.",
                tools: [{ googleSearch: {} }],
                thinkingConfig: {
                    thinkingLevel: 'HIGH',
                }
            }
        });

        // La respuesta puede contener múltiples partes, y el Thinking añade razonamiento.
        // Solo necesitamos que sea extraído el final `.text` que omite los pensamientos según el SDK de '@google/genai'.
        return response.text;
    } catch (error) {
        console.error('Error al contactar con la API de Gemini:', error);
        throw error;
    }
}
