import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.API_KEY,
  });

  const { prompt } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    res.status(200).json({ text: response.text });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}
