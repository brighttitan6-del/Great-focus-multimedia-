import { GoogleGenAI } from "@google/genai";

// Initialize safely to prevent crash if env var is missing
const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error("Failed to initialize Gemini Client", error);
  }
}

export const generateCreativeAdvice = async (userPrompt: string): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key is missing or invalid.");
    return "I'm currently offline (API configuration missing). Please try again later.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: "You are a creative director at Great Focus Multimedia in Malawi. Your tone is professional, encouraging, and artistic. Advise clients on video concepts, branding ideas, or wedding themes. Keep responses concise (under 100 words) and encourage them to book a consultation.",
      }
    });

    return response.text || "I couldn't generate a response at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the creative brain right now.";
  }
};