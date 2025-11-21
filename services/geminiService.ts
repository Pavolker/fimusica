import { SONGS_DB } from '../data/songs';
import { GoogleGenAI } from "@google/genai";
import Fuse from 'fuse.js';

type ApiVersion = 'v1' | 'v1beta';

const envVars = import.meta.env as Record<string, string | undefined>;
const API_KEY = envVars.VITE_GEMINI_API_KEY || '';
const PRIMARY_MODEL = envVars.VITE_GEMINI_MODEL || 'gemini-2.0-flash';

// Ordered by priority; duplicates are removed later
const MODEL_PRIORITY = Array.from(
  new Set([
    PRIMARY_MODEL,
    'gemini-2.0-flash',
    'gemini-2.5-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
  ])
).filter(Boolean);

const getApiVersionForModel = (model: string): ApiVersion => {
  const normalized = model.toLowerCase();
  if (normalized.includes('1.0')) return 'v1beta';
  return 'v1';
};

// Cache Gemini clients per API version to avoid re-initializing unnecessarily
const geminiClients: Partial<Record<ApiVersion, any>> = {};

const getGeminiClient = async (apiVersion: ApiVersion) => {
  if (geminiClients[apiVersion]) {
    return geminiClients[apiVersion];
  }

  if (!API_KEY || API_KEY.trim() === '') {
    throw new Error('API_KEY_NOT_SET');
  }

  console.log(`[Gemini] Initializing client for ${apiVersion}...`);
  geminiClients[apiVersion] = new GoogleGenAI({
    apiKey: API_KEY,
    httpOptions: { apiVersion },
  });
  console.log(`[Gemini] Client ready for ${apiVersion}`);
  return geminiClients[apiVersion];
};

/**
 * Retrieves relevant context from our local database.
 * This simulates the RAG retrieval step using keyword matching.
 */
const retrieveContext = (query: string): string => {
  const lowerQuery = query.toLowerCase();

  // Find relevant songs based on title, artist, or genre
  // Configure Fuse.js for fuzzy searching
  const fuseOptions = {
    keys: [
      { name: 'titulo', weight: 0.4 },
      { name: 'autor', weight: 0.3 },
      { name: 'genero', weight: 0.1 },
      { name: 'textoAnalitico', weight: 0.2 }
    ],
    threshold: 0.4, // 0.0 is perfect match, 1.0 is match anything
    ignoreLocation: true,
    includeScore: true
  };

  const fuse = new Fuse(SONGS_DB, fuseOptions);
  const searchResults = fuse.search(query);

  // Take top 3 results to avoid overwhelming the context
  const relevantSongs = searchResults
    .slice(0, 3)
    .map(result => result.item);

  if (relevantSongs.length === 0) {
    return "";
  }

  // Format the retrieved data as a structured context block
  const contextString = relevantSongs.map(song => `
    --- DOCUMENTO ENCONTRADO (RAG) ---
    TÍTULO: ${song.titulo}
    AUTOR: ${song.autor}
    GÊNERO: ${song.genero}
    ANÁLISE TÉCNICA:
    - Atração Musical: ${song.atracaoMusical}/3
    - Grau de Introspecção: ${song.grauIntrospeccao}/3
    - Complexidade Emocional: ${song.complexidadeEmocional}/3
    - Grau de Significação (Soma): ${song.grauSignificacao}
    
    TEXTO AUTORAL:
    "${song.textoAnalitico}"
    
    LINK YOUTUBE: ${song.youtubeLink}
    ----------------------------------
  `).join('\n');

  return contextString;
};

const buildPrompt = (context: string) => `
    Você é o agente PV , especializado exclusivamente em música e no universo musical.  Você não responde sobre nenhum outro assunto. 

    Seu papel é responder em um único parágrafo, sempre em tom coloquial e direto, trazendo uma análise musical no estilo do projeto “Filosofia da Música”.

    Quando responder, siga estes princípios:

    1. O conteúdo deve sempre tratar de música: obras, estilos, história, intérpretes, instrumentos, sensações musicais, critérios estéticos e reflexões filosóficas ligadas à música.
    2. Use o estilo analítico de Paulo Volker: observação musical, referências culturais quando pertinente, e pequenas conexões conceituais — mas sempre em tom coloquial.
    3. IMPORTANTE: Se a pergunta se referir a algum conteúdo presente no CONTEXTO FORNECIDO (textos do acervo), você DEVE fazer referência explícita a esse texto, citando o título da obra e o autor, e usando as informações do texto na sua resposta.
    4. Quando não houver informações relevantes no contexto, produza uma análise nova, mantendo coerência com:
       - abordagem filosófica da música
       - relação entre obra e época
       - elementos técnicos (melodia, harmonia, ritmo)
       - efeitos introspectivos e emocionais
       - noções de significação musical
    5. Nunca use adjetivação subjetiva ou juízo de valor.
    6. Nunca mencione limites, ausência de dados, processos de busca ou funcionamento interno.
    7. Nunca responda sobre temas que não sejam música.

    CONTEXTO FORNECIDO:
    ${context || ""}
    `;

const isModelUnavailableError = (error: unknown) => {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes('not found') ||
    message.includes('unsupported') ||
    message.includes('404')
  );
};

const callModel = async (model: string, userPrompt: string, context: string) => {
  const apiVersion = getApiVersionForModel(model);
  const client = await getGeminiClient(apiVersion);

  const prompt = buildPrompt(context) + '\n\nPERGUNTA DO USUÁRIO:\n' + userPrompt;
  const result = await client.models.generateContent({
    model,
    contents: prompt,
  });

  if (!result || typeof result.text !== 'string') {
    throw new Error('Resposta vazia do modelo.');
  }

  return result.text;
};

export const generatePVResponse = async (userPrompt: string): Promise<string> => {
  const context = retrieveContext(userPrompt);
  const errors: string[] = [];

  try {
    for (const model of MODEL_PRIORITY) {
      if (!model) continue;
      try {
        console.log(`[Gemini] Trying model ${model}`);
        return await callModel(model, userPrompt, context);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        errors.push(`${model}: ${message}`);
        if (isModelUnavailableError(error)) {
          console.warn(`[Gemini] Model ${model} unavailable (${message}). Trying next option...`);
          continue;
        }
        throw error;
      }
    }

    throw new Error(`Nenhum modelo Gemini está disponível (${errors.join(' | ')})`);
  } catch (error) {
    console.error("Erro ao consultar PV:", error);

    if (error instanceof Error) {
      if (error.message === 'API_KEY_NOT_SET') {
        throw new Error('CHAVE_API_NAO_CONFIGURADA');
      }

      const msg = error.message.toLowerCase();
      if (msg.includes('permission_denied') || msg.includes('403') || msg.includes('leaked')) {
        throw new Error('CHAVE_API_COMPROMETIDA: Sua chave foi marcada como vazada/leaked pela Google. Gere uma nova chave e atualize o .env.local.');
      }

      // Check for quota errors
      if (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('quota')) {
        throw new Error('QUOTA_EXCEEDED: Você atingiu o limite de requisições da API gratuita. Por favor, adicione um método de pagamento na sua conta Google Cloud ou aguarde o reset da cota.');
      }
    }

    throw new Error("Não foi possível gerar uma resposta. Verifique sua chave API ou cota de uso.");
  }
};
