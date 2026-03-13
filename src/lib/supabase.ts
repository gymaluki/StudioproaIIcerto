import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type OperationType = 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';

export const handleSupabaseError = (error: any, operation: OperationType, table: string) => {
  console.error(`Supabase Error [${operation}] on table [${table}]:`, error);
  throw error;
};
