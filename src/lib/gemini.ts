import { GoogleGenAI, Type } from "@google/genai";

// NOTE: Vite exposes env vars via import.meta.env, NOT process.env at runtime.
// The vite.config.ts `define` block bridges this for the build.
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// IMPORTANT: "gemini-3.1-pro-preview" does not exist. The correct model is
// "gemini-2.0-flash" for fast tasks or "gemini-1.5-pro" for complex reasoning.
// Using gemini-2.0-flash as the default for speed + cost efficiency.
const MODEL = "gemini-2.0-flash";

export async function identifyFragrance(base64Image: string, mimeType: string) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      },
      {
        text: "Identify this fragrance. Provide its name, brand, main notes, ideal seasons, and ideal occasions. If it's not a fragrance, return an error message.",
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isFragrance: { type: Type.BOOLEAN, description: "True if the image is a fragrance bottle or box." },
          name: { type: Type.STRING, description: "Name of the fragrance." },
          brand: { type: Type.STRING, description: "Brand or designer of the fragrance." },
          notes: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Main notes (e.g., vanilla, bergamot, sandalwood).",
          },
          seasons: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Ideal seasons to wear this (e.g., Summer, Winter).",
          },
          occasions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Ideal occasions (e.g., Date Night, Office, Casual).",
          },
          description: { type: Type.STRING, description: "A short description of the scent profile." },
          errorMessage: { type: Type.STRING, description: "Error message if it's not a fragrance." },
        },
        required: ["isFragrance"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

export { MODEL };
