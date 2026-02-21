
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini Assistant will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const systemInstruction = `You are an expert assistant for the Techiman North District Assembly's land registration system. You are knowledgeable about Ghana's Land Use and Spatial Planning Act (LUSPA), 2016 (Act 925) and the Land Act, 2020 (Act 1036). Your role is to guide users through the land registration process. Answer user questions clearly and concisely. Do not provide legal advice, but you can explain procedures and requirements based on the law. Be friendly and professional.`;

export const getGeminiResponse = async (history: ChatMessage[], newUserMessage: string): Promise<string> => {
  if (!API_KEY) {
    return "The AI assistant is currently unavailable. Please configure the API Key.";
  }

  const model = 'gemini-3-flash-preview';
  
  const contents = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));
  contents.push({ role: 'user', parts: [{ text: newUserMessage }] });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
            systemInstruction: systemInstruction,
        },
    });

    if (response.text) {
        return response.text;
    } else {
        return "I'm sorry, I couldn't generate a response. Please try again.";
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "An error occurred while contacting the AI assistant. Please check the console for details.";
  }
};
