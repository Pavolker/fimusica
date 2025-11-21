import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BIBLIOTECA_DIR = path.join(__dirname, '../biblioteca');
const OUTPUT_FILE = path.join(__dirname, '../data/chapters.ts');

function parseChapterFile(fileName, content) {
    // Extrai o número do capítulo do nome do arquivo
    const numberMatch = fileName.match(/^(\d+)-/);
    const id = numberMatch ? parseInt(numberMatch[1]) : 0;

    // Extrai o título (primeira linha ou do nome do arquivo)
    const lines = content.split('\n').filter(line => line.trim());
    const title = lines[0] ? lines[0].replace(/^\d+-?\s*/, '').trim() : fileName.replace('.md', '');

    // O conteúdo é tudo após a primeira linha
    const text = lines.slice(1).join('\n').trim();

    return {
        id,
        title,
        content: text
    };
}

function generateChaptersFile() {
    console.log('📚 Processando arquivos da biblioteca...\n');

    const files = fs.readdirSync(BIBLIOTECA_DIR)
        .filter(f => f.endsWith('.md'))
        .sort((a, b) => {
            const aNum = parseInt(a.match(/^(\d+)/)?.[1] || '0');
            const bNum = parseInt(b.match(/^(\d+)/)?.[1] || '0');
            return aNum - bNum;
        });

    console.log(`📁 Encontrados ${files.length} capítulos\n`);

    const chapters = files.map(fileName => {
        const filePath = path.join(BIBLIOTECA_DIR, fileName);
        const content = fs.readFileSync(filePath, 'utf-8');
        return parseChapterFile(fileName, content);
    });

    // Gera o arquivo TypeScript
    let tsContent = `// Capítulos da biblioteca - Gerado automaticamente
// Total: ${chapters.length} capítulos
// Gerado em: ${new Date().toISOString()}

export interface Chapter {
  id: number;
  title: string;
  content: string;
}

export const CHAPTERS: Chapter[] = [
`;

    chapters.forEach((chapter, index) => {
        const escapedContent = chapter.content
            .replace(/\\/g, '\\\\')
            .replace(/`/g, '\\`')
            .replace(/\$/g, '\\$');

        tsContent += `  {
    id: ${chapter.id},
    title: \`${chapter.title.replace(/`/g, '\\`')}\`,
    content: \`${escapedContent}\`
  }${index < chapters.length - 1 ? ',' : ''}
`;
    });

    tsContent += `];
`;

    fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf-8');

    console.log(`\n✅ Processamento concluído!`);
    console.log(`📊 Total de capítulos: ${chapters.length}`);
    console.log(`📝 Arquivo gerado: ${OUTPUT_FILE}`);

    // Mostra resumo
    console.log(`\n📖 Capítulos processados:`);
    chapters.forEach(ch => {
        console.log(`   ${ch.id}. ${ch.title}`);
    });
}

try {
    generateChaptersFile();
} catch (error) {
    console.error('❌ Erro ao processar arquivos:', error);
    process.exit(1);
}
