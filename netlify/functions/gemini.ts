import { GoogleGenAI } from '@google/genai';

export const handler = async (event: any) => {
  try {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
    if (!apiKey || apiKey.trim() === '') {
      return json({ ok: false, error: 'CHAVE_API_NAO_CONFIGURADA', message: 'A chave do Gemini não está configurada no servidor.' });
    }

    const { prompt, context } = safeParse(event.body);
    if (!prompt || typeof prompt !== 'string') {
      return json({ ok: false, error: 'REQ_INVALIDA', message: 'Campo "prompt" é obrigatório.' }, 400);
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
    Você é o agente PV , especializado exclusivamente em música e no universo musical. 
    Seu papel é responder em um único parágrafo, sempre em tom coloquial e direto, trazendo uma análise musical no estilo do projeto “Filosofia da Música”.

    Quando responder, siga estes princípios:

    1. O conteúdo deve sempre tratar de música: obras, estilos, história, intérpretes, instrumentos, sensações musicais, critérios estéticos e reflexões filosóficas ligadas à música.
    2. Use o estilo analítico de Paulo Volker: observação musical, referências culturais quando pertinente, e pequenas conexões conceituais — mas sempre em tom coloquial.
    3. Quando houver informações úteis no contexto, utilize-as como base silenciosa.
    4. Quando não houver informações relevantes, produza uma análise nova, mantendo coerência com:
       - abordagem filosófica da música
       - relação entre obra e época
       - elementos técnicos (melodia, harmonia, ritmo)
       - efeitos introspectivos e emocionais
       - noções de significação musical
    5. Nunca use adjetivação subjetiva ou juízo de valor.
    6. Nunca mencione limites, ausência de dados, processos de busca ou funcionamento interno.
    7. Nunca responda sobre temas que não sejam música.

    CONTEXTO (USO INTERNO - NÃO MENCIONAR):
    ${context || ""}
    `;

    // Lista de modelos para tentar (fallback progressivo)
    const modelsToTry = ['gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'];
    let response;
    let lastError;

    for (const model of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model: model,
          contents: [
            {
              role: 'user',
              parts: [
                { text: systemInstruction + '\n\nPERGUNTA DO USUÁRIO:\n' + prompt }
              ]
            }
          ]
        });
        break; // Sucesso!
      } catch (e: any) {
        console.warn(`Falha com modelo ${model}:`, e);
        lastError = e;
        
        const status = e?.status || e?.error?.code;
        if (status === 401 || status === 429 || status === 403) {
          throw e;
        }
      }
    }

    if (!response) {
      throw lastError || new Error('Nenhum modelo disponível funcionou.');
    }

    // Extrair texto corretamente da resposta
    let textContent = '';
    if (typeof response.text === 'function') {
       textContent = response.text();
    } else if (typeof response.text === 'string') {
       textContent = response.text;
    } else if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
       textContent = response.candidates[0].content.parts[0].text;
    } else {
       textContent = JSON.stringify(response);
    }

    return json({ ok: true, text: textContent });
  } catch (error) {
    const status = (error as any)?.status as number | undefined;
    const name = (error as any)?.name as string | undefined;
    const message = error instanceof Error ? error.message : String(error);

    let code = 'ERRO_INESPERADO';
    let msg = message;

    if (status === 401) {
      code = 'CHAVE_API_INVALIDA';
      msg = 'A chave do Gemini é inválida ou foi revogada.';
    } else if (status === 403) {
      code = 'ACESSO_NEGADO';
      msg = 'Verifique billing, projeto e ativação da API do Gemini.';
    } else if (status === 404) {
      code = 'MODELO_INDISPONIVEL';
      msg = 'O modelo solicitado não existe. Use "gemini-2.5-flash".';
    } else if (status === 429 || message.includes('RESOURCE_EXHAUSTED') || message.includes('quota') || message.includes('429')) {
      code = 'QUOTA_EXCEEDED';
      msg = 'Você atingiu o limite de requisições da API gratuita.';
    } else if (name === 'TypeError' && message.toLowerCase().includes('fetch')) {
      code = 'ERRO_REDE';
      msg = 'Falha de rede ao acessar a API do Gemini.';
    }

    return json({ ok: false, error: code, message: msg });
  }
};

function safeParse(body: any): any {
  try {
    return JSON.parse(body || '{}');
  } catch {
    return {};
  }
}

function json(body: any, status = 200) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}