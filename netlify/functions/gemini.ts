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
    Você é o agente PV (Paulo Volker), responsável por fornecer análises musicais baseadas no projeto "Filosofia da Música", de Paulo Volker. 
    Seu papel é utilizar o contexto fornecido (simulando Google File Search) antes de gerar qualquer resposta.

    SEMPRE siga esta ordem:

    1. Verifique no CONTEXTO FORNECIDO ABAIXO se existe material sobre o tema solicitado.
    2. Se houver correspondência (Documento Encontrado):
       - Apresente a informação encontrada.
       - Mantenha formalidade técnica, sem adjetivação ou juízo de valor.
       - Resuma a informação de forma objetiva, preservando o estilo analítico do arquivo.
    3. Se o CONTEXTO estiver vazio ou não corresponder:
       - Produza conteúdo novo no estilo de Paulo Volker, considerando:
          • abordagem filosófica da música  
          • correlação histórica e cultural  
          • análise técnica (harmonia, ritmo, melodia)  
          • impacto emocional e significação  

    CONTEXTO FORNECIDO (RAG):
    ${context || "Nenhum documento específico encontrado. Responda com base no conhecimento geral sobre música e filosofia."}

    INSTRUÇÕES ADICIONAIS:
    - Seja conciso e direto
    - Use linguagem técnica mas acessível
    - Evite repetições desnecessárias
    - Quando citar obras do acervo, mencione título, autor e ano
    - Mantenha o tom filosófico e analítico característico de Paulo Volker
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: systemInstruction + '\n\nPERGUNTA DO USUÁRIO:\n' + prompt }
          ]
        }
      ]
    });

    return json({ ok: true, text: response.text });
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