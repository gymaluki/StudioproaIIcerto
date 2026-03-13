import React, { useState, useEffect } from 'react';
import { Key, Shield, HelpCircle, ExternalLink, Save, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { useApiKey } from '../contexts/ApiKeyContext';

export default function Configuracoes() {
  const { apiKey, setApiKey, isLoading: contextLoading } = useApiKey();
  const [localApiKey, setLocalApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    setLocalApiKey(apiKey);
  }, [apiKey]);

  useEffect(() => {
    const loadUserInfo = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserEmail(session.user.email || null);
      }
    };

    loadUserInfo();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          gemini_api_key: localApiKey
        })
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      
      // Atualiza o contexto global
      setApiKey(localApiKey);
      
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      handleSupabaseError(error, 'update', 'profiles');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 fade-in-custom max-w-4xl pb-20">
      <header>
        <h2 className="text-4xl font-serif font-bold">Configurações</h2>
        <p className="text-muted-foreground">Gerencie sua conta e chaves de acesso para o estúdio.</p>
      </header>

      <div className="space-y-8">
        {/* Tutorial Section */}
        <section className="glass-card p-8 rounded-3xl space-y-6 border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3">
            <Info className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-primary">Tutorial: Como obter sua API Key Gratuita</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">1</div>
              <p className="text-sm font-medium">Acesse o Google AI Studio</p>
              <p className="text-xs text-muted-foreground">Clique no botão abaixo para abrir o portal oficial de desenvolvedores do Google.</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">2</div>
              <p className="text-sm font-medium">Crie sua API Key</p>
              <p className="text-xs text-muted-foreground">Clique em "Create API key" e selecione um projeto (ou crie um novo gratuitamente).</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">3</div>
              <p className="text-sm font-medium">Cole e Salve aqui</p>
              <p className="text-xs text-muted-foreground">Copie a chave gerada e cole no campo abaixo. Agora você pode gerar até 1500 imagens grátis!</p>
            </div>
          </div>

          <div className="pt-4">
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl gold-glow hover:opacity-90 transition-all"
            >
              Abrir Google AI Studio <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* API Key Section */}
        <section className="glass-card p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Key className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">Configuração da API</h3>
            </div>
            {localApiKey ? (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> Conectado
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">
                <AlertCircle className="w-3 h-3" /> Necessário
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">Sua Gemini API Key</label>
              <div className="relative">
                <input
                  type="password"
                  value={localApiKey}
                  onChange={(e) => setLocalApiKey(e.target.value)}
                  disabled={isLoading || contextLoading}
                  className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all disabled:opacity-50"
                  placeholder={contextLoading ? "Carregando..." : "Cole sua chave (AIza...)"}
                />
              </div>
              <p className="text-[10px] text-muted-foreground ml-1 italic">
                * Sua chave é armazenada de forma segura e usada apenas para suas gerações pessoais.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSaving || isLoading || contextLoading}
              className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-xl gold-glow hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Salvar Configurações
            </button>
          </form>
        </section>

        {/* Security Section */}
        <section className="glass-card p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold">Informações da Conta</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Email</p>
              <p className="font-medium">{userEmail || 'Não identificado'}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Plano</p>
              <p className="font-medium text-primary">Gratuito (Gemini Free Tier)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
