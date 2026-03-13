import React, { useState, useEffect } from 'react';
import { CENARIOS } from '../constants';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { Camera, Save, RefreshCw, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

export default function Admin() {
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
        
        if (data?.role === 'admin' || session.user.email === 'andreyhenrzp@gmail.com') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const loadOverrides = async () => {
      const { data } = await supabase.from('scenarios').select('*');
      if (data) {
        const newOverrides: Record<string, string> = {};
        data.forEach((item: any) => {
          newOverrides[item.id] = item.previewUrl;
        });
        setOverrides(newOverrides);
      }

      const channel = supabase
        .channel('admin-scenarios')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'scenarios' }, async () => {
          const { data: newData } = await supabase.from('scenarios').select('*');
          if (newData) {
            const newOverrides: Record<string, string> = {};
            newData.forEach((item: any) => {
              newOverrides[item.id] = item.previewUrl;
            });
            setOverrides(newOverrides);
          }
        })
        .subscribe();
      
      return () => supabase.removeChannel(channel);
    };

    loadOverrides();
  }, [isAdmin]);

  const handleFileUpload = (scenarioId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        await saveOverride(scenarioId, base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveOverride = async (id: string, url: string) => {
    setIsSaving(id);
    try {
      const { error } = await supabase
        .from('scenarios')
        .upsert({
          id,
          previewUrl: url,
          updatedAt: new Date().toISOString()
        });
      
      if (error) throw error;
      toast.success(`Cenário ${id} atualizado!`);
    } catch (error) {
      handleSupabaseError(error, 'write', 'scenarios');
    } finally {
      setIsSaving(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="w-16 h-16 text-destructive" />
        <h2 className="text-2xl font-bold">Acesso Negado</h2>
        <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in-custom pb-20">
      <header>
        <h2 className="text-4xl font-serif font-bold">Painel Administrativo 👑</h2>
        <p className="text-muted-foreground">Gerencie as ilustrações dos cenários do estúdio.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CENARIOS.map((cenario) => {
          const currentUrl = overrides[cenario.id] || cenario.previewUrl;
          const isOverridden = !!overrides[cenario.id];

          return (
            <div key={cenario.id} className="glass-card rounded-3xl overflow-hidden border-white/5 flex flex-col">
              <div className="relative aspect-[3/4] group">
                <img 
                  src={currentUrl} 
                  alt={cenario.nome} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer bg-white text-black font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform">
                    <Upload className="w-4 h-4" />
                    Trocar Foto
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(cenario.id, e)}
                    />
                  </label>
                </div>
                {isOverridden && (
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-lg">{cenario.nome}</h4>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground bg-white/5 px-2 py-1 rounded">
                      {cenario.categoria}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 italic">
                    "{cenario.prompt}"
                  </p>
                </div>

                <div className="pt-4 flex gap-2">
                  {isSaving === cenario.id ? (
                    <button disabled className="flex-1 bg-primary/50 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Salvando...
                    </button>
                  ) : (
                    <label className="flex-1 cursor-pointer bg-primary text-primary-foreground font-bold py-2 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all text-sm">
                      <Camera className="w-4 h-4" />
                      Upload Arquivo
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(cenario.id, e)}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
