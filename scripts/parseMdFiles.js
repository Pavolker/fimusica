import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MD_DIR = path.join(__dirname, '../arquivo md');
const OUTPUT_FILE = path.join(__dirname, '../data/songs.ts');

// Função para extrair informações do nome do arquivo
function parseFileName(fileName) {
    // Remove a extensão .md
    const nameWithoutExt = fileName.replace('.md', '');

    // Extrai o ano (primeiros 4 dígitos)
    const yearMatch = nameWithoutExt.match(/^(\d{4})/);
    const year = yearMatch ? yearMatch[1] : '0000';

    // Extrai o título (tudo após o ano e o hífen)
    const titleMatch = nameWithoutExt.match(/^\d{4}\s*-\s*(.+)$/);
    const title = titleMatch ? titleMatch[1].trim() : nameWithoutExt;

    return { year, title };
}

// Função para extrair links do YouTube do conteúdo
function extractYouTubeLinks(content) {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/g;
    const links = [];
    let match;

    while ((match = youtubeRegex.exec(content)) !== null) {
        links.push(`https://www.youtube.com/watch?v=${match[1]}`);
    }

    return links;
}

// Função para limpar o texto analítico (remove links e espaços extras)
function cleanAnalyticalText(content) {
    // Remove links do YouTube
    let cleaned = content.replace(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]+/g, '');

    // Remove linhas vazias múltiplas
    cleaned = cleaned.replace(/\n\s*\n\s*/g, '\n\n');

    // Remove espaços no início e fim
    cleaned = cleaned.trim();

    // Limita o tamanho para evitar textos muito longos
    if (cleaned.length > 1500) {
        cleaned = cleaned.substring(0, 1500) + '...';
    }

    return cleaned;
}

// Função para inferir gênero baseado no título/conteúdo
function inferGenre(title, content) {
    const lowerTitle = title.toLowerCase();
    const lowerContent = content.toLowerCase();

    if (lowerContent.includes('jazz') || lowerTitle.includes('jazz')) return 'Jazz';
    if (lowerContent.includes('rock') || lowerTitle.includes('rock')) return 'Rock';
    if (lowerContent.includes('clássica') || lowerContent.includes('sinfonia') || lowerContent.includes('beethoven') || lowerContent.includes('bach')) return 'Clássica';
    if (lowerContent.includes('bossa') || lowerTitle.includes('jobim')) return 'Bossa Nova';
    if (lowerContent.includes('samba')) return 'Samba';
    if (lowerContent.includes('mpb')) return 'MPB';
    if (lowerContent.includes('pop')) return 'Pop';
    if (lowerContent.includes('folk')) return 'Folk';
    if (lowerContent.includes('blues')) return 'Blues';
    if (lowerContent.includes('soul')) return 'Soul';
    if (lowerContent.includes('hip hop') || lowerContent.includes('rap')) return 'Hip Hop';
    if (lowerContent.includes('eletrônica') || lowerContent.includes('electronic')) return 'Eletrônica';
    if (lowerContent.includes('tango')) return 'Tango';
    if (lowerContent.includes('mantra') || lowerContent.includes('sânscrito')) return 'World Music';

    return 'Diversos';
}

// Função para gerar métricas aleatórias mas consistentes (baseado no hash do título)
function generateMetrics(title) {
    // Gera um hash simples do título para ter valores consistentes
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        hash = ((hash << 5) - hash) + title.charCodeAt(i);
        hash = hash & hash;
    }

    // Usa o hash para gerar valores de 1 a 3
    const atracao = (Math.abs(hash) % 3) + 1;
    const intro = (Math.abs(hash >> 8) % 3) + 1;
    const complex = (Math.abs(hash >> 16) % 3) + 1;

    return { atracao, intro, complex };
}

// Função principal
function processMdFiles() {
    console.log('🎵 Processando arquivos markdown...\n');

    const files = fs.readdirSync(MD_DIR).filter(f => f.endsWith('.md'));
    console.log(`📁 Encontrados ${files.length} arquivos\n`);

    const songs = [];

    files.forEach((fileName, index) => {
        const filePath = path.join(MD_DIR, fileName);
        const content = fs.readFileSync(filePath, 'utf-8');

        const { year, title } = parseFileName(fileName);
        const youtubeLinks = extractYouTubeLinks(content);
        const analyticalText = cleanAnalyticalText(content);
        const genre = inferGenre(title, content);
        const metrics = generateMetrics(title);

        // Extrai autor do título se possível (geralmente está após o hífen)
        let autor = title;
        if (title.includes('-')) {
            const parts = title.split('-');
            autor = parts[parts.length - 1].trim();
        }

        const song = {
            id: (index + 1).toString(),
            data: `${year}-01-01`,
            titulo: title,
            autor: autor,
            genero: genre,
            atracaoMusical: metrics.atracao,
            grauIntrospeccao: metrics.intro,
            complexidadeEmocional: metrics.complex,
            youtubeLink: youtubeLinks[0] || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            youtubeLinks: youtubeLinks, // Store all YouTube links
            textoAnalitico: analyticalText || 'Análise em desenvolvimento.'
        };

        songs.push(song);
    });

    // Ordena por data (ano)
    songs.sort((a, b) => a.data.localeCompare(b.data));

    // Gera o arquivo TypeScript
    generateTypeScriptFile(songs);

    console.log(`\n✅ Processamento concluído!`);
    console.log(`📊 Total de músicas: ${songs.length}`);
    console.log(`📝 Arquivo gerado: ${OUTPUT_FILE}`);
}

function generateTypeScriptFile(songs) {
    let tsContent = `import { Song } from '../types';

// Banco de dados gerado automaticamente a partir dos arquivos markdown
// Total de músicas: ${songs.length}
// Gerado em: ${new Date().toISOString()}

const createSong = (
  id: string,
  data: string,
  titulo: string,
  autor: string,
  genero: string,
  atracao: 1 | 2 | 3,
  intro: 1 | 2 | 3,
  complex: 1 | 2 | 3,
  youtube: string,
  youtubeLinks: string[],
  texto: string
): Song => ({
  id,
  data,
  titulo,
  autor,
  genero,
  atracaoMusical: atracao,
  grauIntrospeccao: intro,
  complexidadeEmocional: complex,
  grauSignificacao: atracao + intro + complex,
  youtubeLink: youtube,
  youtubeLinks: youtubeLinks,
  textoAnalitico: texto
});

export const SONGS_DB: Song[] = [
`;

    songs.forEach((song, index) => {
        const escapedText = song.textoAnalitico.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');

        // Convert youtubeLinks array to a string representation
        const youtubeLinksStr = JSON.stringify(song.youtubeLinks || []);
        
        tsContent += `  createSong(
    "${song.id}",
    "${song.data}",
    "${song.titulo.replace(/"/g, '\\"')}",
    "${song.autor.replace(/"/g, '\\"')}",
    "${song.genero}",
    ${song.atracaoMusical}, ${song.grauIntrospeccao}, ${song.complexidadeEmocional},
    "${song.youtubeLink}",
    ${youtubeLinksStr},
    "${escapedText}"
  )${index < songs.length - 1 ? ',' : ''}`;
    });

    tsContent += `];
`;

    fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf-8');
}

// Executa o script
try {
    processMdFiles();
} catch (error) {
    console.error('❌ Erro ao processar arquivos:', error);
    process.exit(1);
}
