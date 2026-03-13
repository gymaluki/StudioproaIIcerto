export interface Ensaio {
  id: string;
  user_id: string;
  foto_original: string;
  foto_gerada: string;
  status: 'pending' | 'completed' | 'failed';
  tipo: 'ensaio' | 'aniversario' | 'profissional';
  cenario: string;
  created_at: any;
  updated_at: any;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  display_name: string;
  created_at: any;
  updated_at: any;
}

export interface UserApiKey {
  id: string;
  user_id: string;
  api_key_encrypted: string;
  provider: string;
  created_at: any;
  updated_at: any;
}

export interface Cenario {
  id: string;
  nome: string;
  arquivo: string;
  prompt: string;
  categoria: 'ensaio' | 'aniversario' | 'profissional';
  previewUrl?: string;
}
