import { GoogleGenAI } from "@google/genai";

const getAI = (userApiKey?: string) => {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key do Gemini não configurada. Por favor, adicione sua chave nas configurações.");
  }
  return new GoogleGenAI({ apiKey });
};

export async function generateEnsaio(base64Image: string, prompt: string, userApiKey?: string) {
  const ai = getAI(userApiKey);
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1],
            mimeType: 'image/jpeg',
          },
        },
        {
          text: `Transform this person in this photo into a professional photo shoot with the following theme: ${prompt}. Keep the person's facial features identical. The output should be a high-quality professional photograph.`,
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Falha ao gerar imagem. Verifique se sua API Key é válida e tem saldo.");
}

export async function restorePhoto(base64Image: string, mode: 'restore' | 'colorize', userApiKey?: string) {
  const ai = getAI(userApiKey);
  
  const instruction = mode === 'restore' 
    ? "Restore this old photo. Remove scratches, improve clarity, and enhance details while keeping it authentic."
    : "Colorize this black and white photo. Use realistic and vibrant colors that match the scene.";

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1],
            mimeType: 'image/jpeg',
          },
        },
        {
          text: instruction,
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Falha ao processar imagem. Verifique sua API Key.");
}
