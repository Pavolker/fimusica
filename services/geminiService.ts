import { SONGS_DB } from '../data/songs';

// Initialize Gemini Client - lazy load to avoid import issues
let genAI: any = null;
let initialized = false;

const initializeGemini = async () => {
  if (initialized) return;

  try {
    // The API key is injected by Vite at build time
    const apiKey = (import.meta.env as any).VITE_GEMINI_API_KEY || '';

    console.log('Initializing Gemini with API key:', apiKey ? 'Present' : 'Not set');

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

import { checkAndIncrementUsage } from './usageService';

// ... existing imports ...

export const generatePVResponse = async (userPrompt: string): Promise<string> => {
  try {
    // Em desenvolvimento, pular verificação de limites para agilidade
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (!isDevelopment) {
      // Check usage limits first (apenas em produção)
      // Timeout de 2s para não travar o agente se o Firebase estiver lento/offline
      const usagePromise = checkAndIncrementUsage();
      const timeoutPromise = new Promise<{ allowed: boolean }>((resolve) => 
        setTimeout(() => resolve({ allowed: true }), 2000)
      );

      const usageCheck = await Promise.race([usagePromise, timeoutPromise]);

      if (!usageCheck.allowed) {
        throw new Error('LIMIT_REACHED');
      }
    }

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
    // Em desenvolvimento, usar API diretamente; em produção, usar função serverless
    
    if (isDevelopment) {
      // Modo desenvolvimento: usar API diretamente no navegador
      const browserApiKey = (import.meta.env as any).VITE_GEMINI_API_KEY || '';
      if (!browserApiKey) {
        throw { error: 'CHAVE_API_NAO_CONFIGURADA', message: 'API key não encontrada em .env.local' };
      }
      
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: browserApiKey });
        
        // Lista de modelos para tentar (fallback progressivo)
        // Voltando gemini-2.0-flash-exp para o topo pois é o único que funcionou no seu ambiente
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
                    { text: systemInstruction + '\n\nPERGUNTA DO USUÁRIO:\n' + userPrompt }
                  ]
                }
              ]
            });
            break; // Sucesso!
          } catch (e: any) {
            console.warn(`Falha com modelo ${model}:`, e);
            lastError = e;
            
            // Se for erro de autenticação ou cota, não adianta tentar outros
            const status = e?.status || e?.error?.code;
            if (status === 401 || status === 429 || status === 403) {
              throw e;
            }
            // Se for 404 (Not Found), tenta o próximo
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
        
        return textContent;
      } catch (devError) {
        console.error('Erro na chamada direta da API:', devError);
        throw devError;
      }
    } else {
      // Modo produção: usar função serverless
      const resp = await fetch('/.netlify/functions/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt, context: context })
      });

      const data = await resp.json();
      if (!resp.ok || !data.ok) {
        const code = data.error || 'ERRO_INESPERADO';
        const msg = data.message || '';
        throw new Error(`${code}: ${msg}`.trim());
      }

      return data.text;
    }

  } catch (error) {
    console.error("Erro ao consultar PV:", error);

    const status = (error as any)?.status as number | undefined;
    const name = (error as any)?.name as string | undefined;
    const message = error instanceof Error ? error.message : String(error);

    // Erro de chave ausente
    if (error instanceof Error && error.message === 'API_KEY_NOT_SET') {
      throw new Error('CHAVE_API_NAO_CONFIGURADA');
    }

    // Mapeamento por status (ApiError do SDK)
    if (status === 401) {
      throw new Error('CHAVE_API_INVALIDA: A chave do Gemini é inválida ou foi revogada. Gere uma nova em https://aistudio.google.com/apikey e atualize VITE_GEMINI_API_KEY.');
    }
    if (status === 403) {
      throw new Error('ACESSO_NEGADO: Verifique billing/projeto/ativação da API do Gemini. Permissões insuficientes ou billing inativo.');
    }
    if (status === 404) {
      throw new Error('MODELO_INDISPONIVEL: O modelo solicitado não existe ou foi descontinuado. Tente "gemini-1.5-flash-002".');
    }
    if (status === 429 || (message.includes('429') || message.includes('RESOURCE_EXHAUSTED') || message.includes('quota'))) {
      throw new Error('QUOTA_EXCEEDED: Você atingiu o limite de requisições da API gratuita. Adicione método de pagamento ou aguarde o reset da cota.');
    }

    // Erros de rede/CORS (ambiente web)
    if (name === 'TypeError' && message.toLowerCase().includes('fetch')) {
      throw new Error('ERRO_REDE: Falha de rede ou CORS ao acessar a API do Gemini. Verifique conectividade e configurações de domínio/headers.');
    }

    // Fallback genérico
    throw new Error(`ERRO_INESPERADO: Não foi possível gerar uma resposta. Detalhes: ${message}`);
  }
};
