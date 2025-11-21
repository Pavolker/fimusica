export interface Song {
  id: string;
  data: string; // Date string
  titulo: string;
  autor: string;
  genero: string;
  atracaoMusical: 1 | 2 | 3;
  grauIntrospeccao: 1 | 2 | 3;
  complexidadeEmocional: 1 | 2 | 3;
  grauSignificacao: number; // Calculated as sum of previous 3
  youtubeLink: string;
  youtubeLinks?: string[]; // Array of all YouTube links for this song
  textoAnalitico: string;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  isThinking?: boolean;
}

export enum SortOption {
  DATE_DESC = 'Mais Recente',
  TITLE_ASC = 'Título (A-Z)',
  SIGNIFICATION_DESC = 'Maior Significação',
  COMPLEXITY_DESC = 'Maior Complexidade'
}