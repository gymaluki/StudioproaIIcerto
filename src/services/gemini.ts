export async function generateEnsaio(base64Image: string, prompt: string, userApiKey?: string) {
  if (!userApiKey) {
    throw new Error("API Key do Gemini não configurada. Por favor, adicione sua chave nas configurações.");
  }

  try {
    // Remove o prefixo "data:image/jpeg;base64," se existir
    const imageData = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${userApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageData,
                }
              },
              {
                text: `Transform this person in this photo into a professional photo shoot with the following theme: ${prompt}. Keep the person's facial features identical and natural. The output should be a high-quality professional photograph that looks realistic.`
              }
            ]
          }],
          generationConfig: {
            temperature: 1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || 'Erro desconhecido';
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Procura por inlineData (imagem gerada)
    const imagePart = data.candidates?.[0]?.content?.parts?.find((part: any) => part.inlineData);
    if (imagePart?.inlineData?.data) {
      return `data:image/png;base64,${imagePart.inlineData.data}`;
    }

    // Se não tiver imagem, tenta retornar texto
    const textPart = data.candidates?.[0]?.content?.parts?.find((part: any) => part.text);
    if (textPart?.text) {
      throw new Error(textPart.text);
    }

    throw new Error("Nenhuma imagem foi gerada. Tente novamente com uma foto diferente.");
  } catch (error: any) {
    console.error("Erro ao gerar ensaio:", error);
    throw new Error(error.message || "Falha ao gerar ensaio. Verifique sua API Key e limite.");
  }
}

export async function restorePhoto(base64Image: string, mode: 'restore' | 'colorize', userApiKey?: string) {
  if (!userApiKey) {
    throw new Error("API Key do Gemini não configurada. Por favor, adicione sua chave nas configurações.");
  }

  try {
    const imageData = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

    const instruction = mode === 'restore' 
      ? "Restore this old photo. Remove scratches, improve clarity, and enhance details while keeping it authentic and realistic."
      : "Colorize this black and white photo. Use realistic and vibrant colors that match the scene naturally.";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${userApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageData,
                }
              },
              {
                text: instruction
              }
            ]
          }],
          generationConfig: {
            temperature: 1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || 'Erro desconhecido';
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Procura por inlineData (imagem gerada)
    const imagePart = data.candidates?.[0]?.content?.parts?.find((part: any) => part.inlineData);
    if (imagePart?.inlineData?.data) {
      return `data:image/png;base64,${imagePart.inlineData.data}`;
    }

    // Se não tiver imagem, tenta retornar texto
    const textPart = data.candidates?.[0]?.content?.parts?.find((part: any) => part.text);
    if (textPart?.text) {
      throw new Error(textPart.text);
    }

    throw new Error("Nenhuma imagem foi processada. Tente novamente com uma foto diferente.");
  } catch (error: any) {
    console.error("Erro ao processar foto:", error);
    throw new Error(error.message || "Falha ao processar imagem. Verifique sua API Key e limite.");
  }
}
