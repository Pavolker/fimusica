# Scripts de Processamento de Dados

Este diretório contém scripts utilitários para processar e gerenciar o banco de dados de músicas do aplicativo.

## 📜 Scripts Disponíveis

### `parseMdFiles.js`
Processa todos os arquivos markdown da pasta `arquivo md/` e gera o arquivo `data/songs.ts` com o banco de dados completo.

**Como usar:**
```bash
node scripts/parseMdFiles.js
```

**O que faz:**
- Lê todos os arquivos `.md` da pasta `arquivo md/`
- Extrai informações como:
  - Ano (do nome do arquivo)
  - Título e autor
  - Links do YouTube
  - Texto analítico
- Infere o gênero musical baseado no conteúdo
- Gera métricas consistentes (Atração Musical, Introspecção, Complexidade)
- Cria o arquivo TypeScript `data/songs.ts`

### `showStats.js`
Exibe estatísticas sobre o banco de dados de músicas.

**Como usar:**
```bash
node scripts/showStats.js
```

**O que mostra:**
- Total de músicas
- Gêneros encontrados
- Distribuição por década

## 🔄 Atualizando o Banco de Dados

Se você adicionar novos arquivos markdown na pasta `arquivo md/`, basta executar:

```bash
npm run update-db
```

Ou manualmente:

```bash
node scripts/parseMdFiles.js
node scripts/showStats.js
```

## 📊 Estatísticas Atuais

- **Total de músicas**: 200
- **Gêneros**: 15 diferentes
- **Período**: De 1100 até 2020
- **Década com mais músicas**: 1970s (87 músicas)

## 🎯 Formato dos Arquivos Markdown

Os arquivos na pasta `arquivo md/` devem seguir o padrão:

```
YYYY - TÍTULO.md
```

Exemplo: `1971 - ELTON JOHN.md`

O conteúdo deve incluir:
- Texto analítico/descritivo
- Links do YouTube (formato: `https://youtu.be/...` ou `https://www.youtube.com/watch?v=...`)

## ⚙️ Configuração

Os scripts estão configurados para:
- Limitar textos analíticos a 1500 caracteres
- Gerar métricas baseadas em hash do título (valores consistentes)
- Inferir gêneros automaticamente baseado em palavras-chave
- Ordenar músicas por data (ano)
