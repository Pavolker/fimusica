import http from 'http';
import { GoogleGenAI } from '@google/genai';

const PORT = process.env.PORT ? Number(process.env.PORT) : 8888;

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/.netlify/functions/gemini') {
    try {
      let body = '';
      req.on('data', chunk => body += chunk);
      await new Promise(resolve => req.on('end', resolve));

      let data = {};
      try { data = JSON.parse(body || '{}'); } catch {}

      const prompt = data.prompt;
      const context = data.context || '';

      if (!apiKey || !apiKey.trim()) {
        return json(res, 200, { ok: false, error: 'CHAVE_API_NAO_CONFIGURADA', message: 'A chave do Gemini não está configurada no servidor.' });
      }
      if (!prompt || typeof prompt !== 'string') {
        return json(res, 400, { ok: false, error: 'REQ_INVALIDA', message: 'Campo "prompt" é obrigatório.' });
      }

      const systemInstruction = `
      Você é o agente PV (Paulo Volker), responsável por fornecer análises musicais baseadas no projeto "Filosofia da Música", de Paulo Volker.
      Seu papel é utilizar o contexto fornecido (simulando Google File Search) antes de gerar qualquer resposta.

      CONTEXTO FORNECIDO (RAG):
      ${context || "Nenhum documento específico encontrado. Responda com base no conhecimento geral sobre música e filosofia."}
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

      return json(res, 200, { ok: true, text: response.text });
    } catch (error) {
      const status = error?.status;
      const name = error?.name;
      const message = error instanceof Error ? error.message : String(error);
      let code = 'ERRO_INESPERADO';
      let msg = message;
      if (status === 401) { code = 'CHAVE_API_INVALIDA'; msg = 'A chave do Gemini é inválida ou foi revogada.'; }
      else if (status === 403) { code = 'ACESSO_NEGADO'; msg = 'Verifique billing, projeto e ativação da API do Gemini.'; }
      else if (status === 404) { code = 'MODELO_INDISPONIVEL'; msg = 'O modelo solicitado não existe. Use "gemini-2.5-flash".'; }
      else if (status === 429 || message.includes('RESOURCE_EXHAUSTED') || message.includes('quota') || message.includes('429')) { code = 'QUOTA_EXCEEDED'; msg = 'Você atingiu o limite de requisições da API gratuita.'; }
      else if (name === 'TypeError' && message.toLowerCase().includes('fetch')) { code = 'ERRO_REDE'; msg = 'Falha de rede ao acessar a API do Gemini.'; }
      return json(res, 200, { ok: false, error: code, message: msg });
    }
  } else {
    json(res, 404, { ok: false, error: 'NOT_FOUND' });
  }
});

server.listen(PORT, () => {
  console.log(`[dev-server] listening on http://localhost:${PORT}/.netlify/functions/gemini`);
});