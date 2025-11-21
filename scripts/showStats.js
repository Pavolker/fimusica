import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importa o banco de dados gerado
const songsFilePath = path.join(__dirname, '../data/songs.ts');
const content = fs.readFileSync(songsFilePath, 'utf-8');

// Extrai estatísticas básicas do arquivo
const totalSongs = (content.match(/createSong\(/g) || []).length;
const genres = new Set();
const decades = {};

// Regex para extrair gêneros
const genreMatches = content.matchAll(/"([^"]+)",\s*\d+,\s*\d+,\s*\d+,/g);
for (const match of genreMatches) {
    genres.add(match[1]);
}

// Regex para extrair anos
const yearMatches = content.matchAll(/"(\d{4})-\d{2}-\d{2}"/g);
for (const match of yearMatches) {
    const year = parseInt(match[1]);
    const decade = Math.floor(year / 10) * 10;
    decades[decade] = (decades[decade] || 0) + 1;
}

console.log('\n📊 ESTATÍSTICAS DO BANCO DE DADOS DE MÚSICAS\n');
console.log('═'.repeat(50));
console.log(`\n🎵 Total de músicas: ${totalSongs}`);
console.log(`\n🎭 Gêneros encontrados (${genres.size}):`);
[...genres].sort().forEach(genre => {
    console.log(`   • ${genre}`);
});

console.log(`\n📅 Distribuição por década:`);
Object.keys(decades).sort().forEach(decade => {
    const bar = '█'.repeat(Math.ceil(decades[decade] / 5));
    console.log(`   ${decade}s: ${bar} (${decades[decade]} músicas)`);
});

console.log('\n' + '═'.repeat(50));
console.log('✅ Banco de dados pronto para uso!\n');
