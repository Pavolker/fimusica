#!/usr/bin/env node

/**
 * Script para preparar a aplicação para deploy no Netlify
 * 
 * Este script:
 * 1. Atualiza o banco de dados de músicas
 * 2. Atualiza os capítulos do livro
 * 3. Executa o build de produção
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔧 Executando: ${command} ${args.join(' ')}\n`);
    
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Comando falhou com código: ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function prepareForDeployment() {
  try {
    console.log('🚀 Preparando aplicação para deploy no Netlify...\n');

    // 1. Atualizar banco de dados de músicas
    console.log('🎵 Atualizando banco de dados de músicas...');
    await runCommand('node', ['scripts/parseMdFiles.js']);

    // 2. Atualizar capítulos do livro
    console.log('📚 Atualizando capítulos do livro...');
    await runCommand('node', ['scripts/parseChapters.js']);

    // 3. Executar build de produção
    console.log('🏗️  Executando build de produção...');
    await runCommand('npm', ['run', 'build']);

    console.log('\n✅ Aplicação pronta para deploy!');
    console.log('📁 Os arquivos de build estão em: dist/');
    console.log('\n📋 Para deploy no Netlify:');
    console.log('   1. Faça push das alterações para seu repositório Git');
    console.log('   2. Conecte o repositório ao Netlify');
    console.log('   3. Configure as variáveis de ambiente no painel do Netlify');
    console.log('   4. O build será feito automaticamente com: npm run build');
    console.log('   5. Diretório de publicação: dist/');

  } catch (error) {
    console.error('\n❌ Erro durante a preparação para deploy:', error.message);
    process.exit(1);
  }
}

// Executar se este script for chamado diretamente
if (process.argv[1] && process.argv[1].endsWith('deploy.js')) {
  prepareForDeployment();
}

export default prepareForDeployment;