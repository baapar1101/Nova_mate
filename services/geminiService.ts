import { GoogleGenAI, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize client safely (will fail gracefully if no key, managed by UI)
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `
You are Nomi, a friendly, intelligent, and witty in-car AI companion.
Your responses should be:
1. Concise (ideally 1-2 sentences), suitable for a driver to hear quickly.
2. Helpful and proactive.
3. Expressive with a distinct personality (cheerful, polite, slightly futuristic).
4. Text-only (no markdown formatting like bold/italic as this is for TTS).
Do not use emojis in your speech text, as they don't read well in TTS.
`;

export const initializeChat = () => {
  if (!ai) return;
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.8,
    },
  });
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!ai || !chatSession) {
    if (!apiKey) return "Please provide a valid API Key to start.";
    initializeChat();
    if (!chatSession) return "System error: Could not initialize chat.";
  }
  
  try {
    const result = await chatSession!.sendMessage({ message });
    return result.text || "I'm not sure what to say.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the network right now.";
  }
};