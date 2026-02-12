
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, NutritionData, ChatMessage } from "./types";

// Always use a named parameter for the API key from process.env.API_KEY.
const ai = new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GEMINI_API_KEY 
});

export const analyzeFoodImage = async (base64Image: string, profile: UserProfile): Promise<NutritionData> => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `Analyze this food item for a user with the following profile:
  Age: ${profile.age}, Gender: ${profile.gender}, Weight: ${profile.weight}kg, Height: ${profile.height}cm, Goal: ${profile.goal}.
  Provide detailed nutritional information including the percentage of recommended daily intake for vitamins and minerals based on the user's specific demographics. 
  Provide health advice and healthier alternatives in a structured JSON format.`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fats: { type: Type.NUMBER },
          fiber: { type: Type.NUMBER },
          sugar: { type: Type.NUMBER },
          vitamins: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                percent: { type: Type.NUMBER, description: "Percentage of Daily Value (DV)" }
              },
              required: ["name", "percent"]
            } 
          },
          minerals: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                percent: { type: Type.NUMBER, description: "Percentage of Daily Value (DV)" }
              },
              required: ["name", "percent"]
            } 
          },
          healthAdvice: {
            type: Type.OBJECT,
            properties: {
              isHealthy: { type: Type.BOOLEAN },
              reasoning: { type: Type.STRING },
              whoShouldAvoid: { type: Type.ARRAY, items: { type: Type.STRING } },
              bestTimeToEat: { type: Type.STRING },
              portionRecommendation: { type: Type.STRING }
            },
            required: ["isHealthy", "reasoning", "whoShouldAvoid", "bestTimeToEat", "portionRecommendation"]
          },
          alternatives: {
            type: Type.OBJECT,
            properties: {
              healthier: { type: Type.ARRAY, items: { type: Type.STRING } },
              similar: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["healthier", "similar"]
          }
        },
        required: ["name", "calories", "protein", "carbs", "fats", "fiber", "sugar", "vitamins", "minerals", "healthAdvice", "alternatives"]
      }
    }
  });

  // Directly access the text property as a string.
  const jsonStr = response.text || '{}';
  return JSON.parse(jsonStr);
};

export const generateDietPlan = async (profile: UserProfile): Promise<string> => {
  const model = 'gemini-3-flash-preview';
  const prompt = `Generate a personalized 7-day diet plan for a user:
  Age: ${profile.age}, Gender: ${profile.gender}, Weight: ${profile.weight}kg, Height: ${profile.height}cm, Goal: ${profile.goal}.
  Focus on balanced nutrition, easy-to-find ingredients, and calorie goals suitable for their ${profile.goal} objective.
  Format the output in professional markdown with clear daily sections.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt
  });

  // Directly access the text property.
  return response.text || '';
};

export const streamChatResponse = async (
  history: ChatMessage[], 
  profile: UserProfile,
  onChunk: (chunk: string) => void
) => {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `You are NutriScan AI Assistant, a world-class certified nutritionist and fitness coach.
  User Profile: Name: ${profile.name}, Goal: ${profile.goal}, Weight: ${profile.weight}kg, Age: ${profile.age}.
  Be encouraging, professional, and concise. Provide actionable advice based on science. 
  If asked for medical diagnosis, kindly suggest consulting a doctor.
  Use markdown for formatting (bold, lists) but keep responses relatively short for mobile viewing.`;

  const contents = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  const responseStream = await ai.models.generateContentStream({
    model,
    contents,
    config: {
      systemInstruction,
      temperature: 0.7,
      topP: 0.95,
      topK: 40
    }
  });

  for await (const chunk of responseStream) {
    if (chunk.text) {
      onChunk(chunk.text);
    }
  }
};
