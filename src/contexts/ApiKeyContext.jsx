import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, handleSupabaseError } from '../lib/supabase';

// Cria o contexto
const ApiKeyContext = createContext();

// Componente que fornece a API key pra toda a aplicação
export function ApiKeyProvider({ children }) {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadApiKey = async () => {
      try {
        // Primeiro, tenta pegar do localStorage (mais rápido)
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) {
          setApiKey(savedKey);
        }

        // Depois, sincroniza com o Supabase
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data, error } = await supabase
            .from('profiles')
            .select('gemini_api_key')
            .eq('user_id', session.user.id)
            .single();
          
          if (data?.gemini_api_key) {
            setApiKey(data.gemini_api_key);
            // Salva no localStorage também
            localStorage.setItem('gemini_api_key', data.gemini_api_key);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar API key:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadApiKey();
  }, []);

  const updateApiKey = (newKey) => {
    setApiKey(newKey);
    // Salva localmente
    localStorage.setItem('gemini_api_key', newKey);
  };

  const clearApiKey = () => {
    setApiKey('');
    localStorage.removeItem('gemini_api_key');
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey: updateApiKey, clearApiKey, isLoading }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

// Hook customizado pra usar a API key em qualquer componente
export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey deve ser usado dentro de ApiKeyProvider');
  }
  return context;
}
