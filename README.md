<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Filosofia da Música - Edição Digital Interativa

Este aplicativo apresenta uma curadoria de **200 obras musicais** analisadas por Paulo Volker através de métricas exclusivas como Atração Musical, Introspecção e Complexidade Emocional.

## 🎵 Características

- **200 músicas catalogadas** (de 1822 até 2020)
- **15 gêneros musicais** diferentes
- **19 capítulos do livro** disponíveis para leitura
- **Análises filosóficas** detalhadas
- **Agente PV**: IA com RAG (Retrieval-Augmented Generation) usando Gemini
- **Busca avançada** com fuzzy search (tolera erros de digitação)
- **Interface moderna** com React + TypeScript + Vite

## 🚀 Executar Localmente

**Pré-requisitos:** Node.js 20+

1. Instalar dependências:
   ```bash
   npm install
   ```

2. Configurar a chave API do Gemini no servidor (Netlify):
   - Em produção, adicione `GOOGLE_API_KEY` no painel do Netlify (Site > Site configuration > Environment variables).
   - Em desenvolvimento local com funções, instale o Netlify CLI: `npm i -g netlify-cli` e use `netlify dev`.
   - Obtenha sua chave em: https://aistudio.google.com/apikey

3. Executar localmente com funções:
   ```bash
   netlify dev
   ```
   
   > Alternativa sem funções: `npm run dev` executa apenas o frontend. As chamadas a `/.netlify/functions/gemini` não estarão disponíveis.

## 🌐 Deploy no Netlify

1. Faça login na sua conta do Netlify (https://netlify.com)
2. Clique em "Novo site a partir do Git"
3. Conecte seu repositório Git (GitHub, GitLab ou Bitbucket)
4. Configure as seguintes opções de build:
   - Comando de build: `npm run build`
   - Diretório de publicação: `dist`
5. Adicione a variável de ambiente:
   - `GOOGLE_API_KEY` com sua chave da API do Google Gemini (servidor)
6. Clique em "Deploy site"

O site será automaticamente reconstruído a cada push no repositório.

## 📊 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run update-db` - Atualiza o banco de músicas a partir dos arquivos markdown
- `npm run update-chapters` - Atualiza os capítulos do livro
- `npm run stats` - Exibe estatísticas do banco de dados

## 📁 Estrutura do Projeto

```
├── arquivo md/          # 200 arquivos markdown com análises musicais
├── biblioteca/          # 19 capítulos do livro em markdown
├── components/          # Componentes React
├── data/               # Banco de dados (gerado automaticamente)
│   ├── songs.ts        # 200 músicas
│   └── chapters.ts     # 19 capítulos
├── pages/              # Páginas da aplicação
│   ├── Home.tsx        # Página inicial com busca
│   ├── Explore.tsx     # Explorar 200 músicas
│   ├── Conceitos.tsx   # Explicação das métricas
│   ├── AgentMelos.tsx  # Chat com IA (Agente PV)
│   └── Biblioteca.tsx  # Leitura dos capítulos
├── scripts/            # Scripts de processamento de dados
├── netlify/functions/  # Funções serverless (Gemini)
│   └── gemini.ts       # Endpoint que chama a API Gemini com chave segura
└── services/           # Integração cliente com função serverless
```

## 🔄 Atualizando o Banco de Dados

### Músicas

Para adicionar novas músicas, adicione arquivos `.md` na pasta `arquivo md/` seguindo o formato:

```
YYYY - TÍTULO.md
```

Depois execute:

```bash
npm run update-db
```

### Capítulos do Livro

Para atualizar os capítulos, edite os arquivos `.md` na pasta `biblioteca/` e execute:

```bash
npm run update-chapters
```

Veja mais detalhes em [`scripts/README.md`](scripts/README.md).

## 🤖 Agente PV

O Agente PV (Paulo Volker) é um assistente de IA que:

- Acessa o acervo de 200 músicas analisadas
- Responde perguntas sobre obras, conceitos e análises
- Mantém o estilo filosófico e analítico de Paulo Volker
- Usa RAG para fornecer respostas baseadas no acervo

## 📖 Páginas Disponíveis

- `/` - Página inicial com busca e citações
- `/explore` - Explorar as 200 músicas com filtros
- `/conceitos` - Explicação das métricas de análise
- `/melos` - Chat com o Agente PV
- `/biblioteca` - Leitura dos 19 capítulos do livro
