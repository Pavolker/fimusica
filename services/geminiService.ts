import { SONGS_DB } from '../data/songs';

// Initialize Gemini Client - lazy load to avoid import issues
let genAI: any = null;
let initialized = false;

const initializeGemini = async () => {
  if (initialized) return;
  
  try {
    // The API key is injected by Vite at build time
    const apiKey = (import.meta.env as any).VITE_GEMINI_API_KEY || '';
    
    console.log('Initializing Gemini with API key:', apiKey ? 'Present (' + apiKey.length + ' chars)' : 'Not set');
    
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('API_KEY_NOT_SET');
    }
    
    // Dynamic import - the correct export is GoogleGenAI
    const { GoogleGenAI } = await import("@google/genai");
    
    if (!GoogleGenAI) {
      throw new Error('GoogleGenAI class not found in module');
    }
    
    genAI = new GoogleGenAI({ apiKey });
    initialized = true;
    console.log('Gemini model initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Gemini:', error);
    throw error;
  }
};

/**
 * Retrieves relevant context from our local database.
 * This simulates the RAG retrieval step using keyword matching.
 */
const retrieveContext = (query: string): string => {
  const lowerQuery = query.toLowerCase();

  // Find relevant songs based on title, artist, or genre
  const relevantSongs = SONGS_DB.filter(song =>
    song.titulo.toLowerCase().includes(lowerQuery) ||
    song.autor.toLowerCase().includes(lowerQuery) ||
    song.genero.toLowerCase().includes(lowerQuery)
  );

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

export const generatePVResponse = async (userPrompt: string): Promise<string> => {
  try {
    // Initialize Gemini if not already done
    await initializeGemini();
    
    // 1. Retrieval Step
    const context = retrieveContext(userPrompt);

    // 2. System Prompt Construction
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

    // 3. Call Gemini API
    if (!genAI) {
      throw new Error("Gemini not initialized");
    }
    
    const result = await genAI.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: systemInstruction + '\n\nPERGUNTA DO USUÁRIO:\n' + userPrompt
            }
          ]
        }
      ]
    });
    
    return result.text;

  } catch (error) {
    console.error("Erro ao consultar PV:", error);
    
    if (error instanceof Error) {
      if (error.message === 'API_KEY_NOT_SET') {
        throw new Error('CHAVE_API_NAO_CONFIGURADA');
      }
      
      // Check for quota errors
      if (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('quota')) {
        throw new Error('QUOTA_EXCEEDED: Você atingiu o limite de requisições da API gratuita. Por favor, adicione um método de pagamento na sua conta Google Cloud ou aguarde o reset da cota.');
      }
    }
    
    throw new Error("Não foi possível gerar uma resposta. Verifique sua chave API ou cota de uso.");
  }
};
