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
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: 'image/jpeg',
            },
          },
          {
            text: `Você é um editor de fotos profissional. Analise esta foto e descreva como ela ficaria em um ensaio fotográfico profissional com o seguinte tema: "${prompt}". 

Importante: Mantenha as características faciais da pessoa IDÊNTICAS. Descreva apenas como a foto seria editada/transformada mantendo a identidade da pessoa.

Responda de forma breve e profissional.`,
          },
        ],
      },
    });

    // Extrair o texto da resposta
    const textContent = response.candidates?.[0]?.content?.parts?.find((part: any) => part.text);
    if (textContent && textContent.text) {
      return textContent.text;
    }

    throw new Error("Nenhuma resposta gerada. Tente novamente.");
  } catch (error: any) {
    console.error("Erro ao gerar ensaio:", error);
    throw new Error(error.message || "Falha ao gerar ensaio. Verifique sua API Key e limite.");
  }
}

export async function restorePhoto(base64Image: string, mode: 'restore' | 'colorize', userApiKey?: string) {
  const ai = getAI(userApiKey);
  
  const instruction = mode === 'restore' 
    ? "Analise esta foto antiga e descreva os passos profissionais para restaurá-la: remover arranhões, melhorar claridade e realçar detalhes mantendo autenticidade."
    : "Analise esta foto em preto e branco e descreva como colorizá-la com cores realistas e vibrantes que correspondam à cena.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
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

    const textContent = response.candidates?.[0]?.content?.parts?.find((part: any) => part.text);
    if (textContent && textContent.text) {
      return textContent.text;
    }

    throw new Error("Nenhuma resposta gerada. Tente novamente.");
  } catch (error: any) {
    console.error("Erro ao processar foto:", error);
    throw new Error(error.message || "Falha ao processar imagem. Verifique sua API Key.");
  }
}
