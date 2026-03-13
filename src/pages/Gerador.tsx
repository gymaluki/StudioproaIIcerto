import React, { useState, useEffect } from 'react';
import { CENARIOS } from '../constants';
import { Camera, Upload, Sparkles, ChevronRight, Download, AlertCircle, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { generateEnsaio } from '../services/gemini';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { useApiKey } from '../contexts/ApiKeyContext';

export default function Gerador() {
  const { apiKey } = useApiKey();
  const [categoria, setCategoria] = useState<'ensaio' | 'aniversario' | 'profissional'>('ensaio');
  const [cenarioSelecionado, setCenarioSelecionado] = useState(CENARIOS[0].id);
  const [image, setImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userApiKey, setUserApiKey] = useState<string | null>(null);
  const [isLoadingKey, setIsLoadingKey] = useState(true);
  const [dailyUsage, setDailyUsage] = useState(0);
  const [scenarios, setScenarios] = useState(CENARIOS);

  useEffect(() => {
    const loadApiKey = async () => {
      // Primeiro, tenta usar o apiKey do contexto
      if (apiKey) {
        setUserApiKey(apiKey);
        setIsLoadingKey(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsLoadingKey(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('gemini_api_key')
          .eq('user_id', session.user.id)
          .single();
        
        if (data) {
          setUserApiKey(data.gemini_api_key || null);
        }
      } catch (error) {
        console.error("Erro ao carregar API Key:", error);
      } finally {
        setIsLoadingKey(false);
      }
    };

    const loadScenarios = async () => {
      // Initial load
      const { data } = await supabase.from('scenarios').select('*');
      if (data) {
        const overrides: Record<string, string> = {};
        data.forEach((item: any) => {
          overrides[item.id] = item.previewUrl;
        });
        const updatedScenarios = CENARIOS.map(s => ({
          ...s,
          previewUrl: overrides[s.id] || s.previewUrl
        }));
        setScenarios(updatedScenarios);
      }

      // Real-time updates
      const channel = supabase
        .channel('scenarios-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'scenarios' }, async () => {
          const { data: newData } = await supabase.from('scenarios').select('*');
          if (newData) {
            const overrides: Record<string, string> = {};
            newData.forEach((item: any) => {
              overrides[item.id] = item.previewUrl;
            });
            const updatedScenarios = CENARIOS.map(s => ({
              ...s,
              previewUrl: overrides[s.id] || s.previewUrl
            }));
            setScenarios(updatedScenarios);
          }
        })
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    };

    const checkDailyUsage = () => {
      const today = new Date().toISOString().split('T')[0];
      const storedData = localStorage.getItem(`gemini_usage_${today}`);
      if (storedData) {
        setDailyUsage(parseInt(storedData));
      } else {
        // Clear old usage data
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('gemini_usage_')) localStorage.removeItem(key);
        });
        localStorage.setItem(`gemini_usage_${today}`, '0');
        setDailyUsage(0);
      }
    };

    loadApiKey();
    const cleanupScenarios = loadScenarios();
    checkDailyUsage();

    return () => {
      cleanupScenarios.then(cleanup => cleanup && cleanup());
    };
  }, [apiKey]);

  const cenariosFiltrados = scenarios.filter(c => c.categoria === categoria);
  const selectedCenario = scenarios.find(c => c.id === cenarioSelecionado);

  const incrementUsage = () => {
    const today = new Date().toISOString().split('T')[0];
    const newUsage = dailyUsage + 1;
    localStorage.setItem(`gemini_usage_${today}`, newUsage.toString());
    setDailyUsage(newUsage);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const [lastGeneratedSettings, setLastGeneratedSettings] = useState<{image: string, cenario: string} | null>(null);

  const handleGenerate = async () => {
    if (!userApiKey) {
      toast.error('API Key não encontrada. Configure sua chave nas configurações para gerar imagens.');
      return;
    }

    // Removed daily usage limit as requested
    /*
    if (dailyUsage >= 1500) {
      toast.error('Você atingiu o limite diário de 1500 gerações da API gratuita do Gemini.');
      return;
    }
    */

    if (!image) {
      toast.error('Por favor, faça upload de uma foto de referência.');
      return;
    }

    if (!selectedCenario) {
      toast.error('Por favor, escolha um cenário.');
      return;
    }

    // Prevent duplicate generation with same settings
    if (lastGeneratedSettings?.image === image && lastGeneratedSettings?.cenario === cenarioSelecionado) {
      toast.info('Você já gerou um ensaio com estas configurações. Tente mudar o cenário ou a foto.');
      return;
    }

    // Basic check for "missing photo" (invalid or too small data)
    if (image.length < 1000) {
      toast.error('A foto enviada parece estar corrompida ou é muito pequena. Tente outra foto.');
      return;
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('Você precisa estar logado para gerar ensaios.');
      return;
    }
    
    setIsGenerating(true);
    try {
      const result = await generateEnsaio(image, selectedCenario.prompt, userApiKey);
      
      if (!result) {
        throw new Error('A IA não retornou uma imagem. Tente novamente.');
      }

      setGeneratedImage(result);
      setLastGeneratedSettings({ image, cenario: cenarioSelecionado });
      incrementUsage();
      
      // Save to Supabase
      try {
        const { error: dbError } = await supabase
          .from('ensaios')
          .insert([
            {
              user_id: session.user.id,
              foto_original: image.substring(0, 800000),
              foto_gerada: result,
              status: 'completed',
              tipo: categoria,
              cenario: cenarioSelecionado
            }
          ]);
        
        if (dbError) throw dbError;
      } catch (fsError) {
        handleSupabaseError(fsError, 'create', 'ensaios');
      }

      toast.success('Ensaio gerado com sucesso!');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Erro ao gerar ensaio. Verifique sua API Key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `ensaio-${cenarioSelecionado}.png`;
    link.click();
  };

  return (
    <div className="space-y-8 fade-in-custom pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Gerador de Ensaios</h2>
          <p className="text-muted-foreground text-sm md:text-base">Escolha um cenário e transforme sua foto em um ensaio profissional.</p>
        </div>
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <div className="flex bg-card rounded-xl p-1 border border-border w-full md:w-auto overflow-x-auto">
            {(['ensaio', 'aniversario', 'profissional'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategoria(cat);
                  const firstInCat = scenarios.find(c => c.categoria === cat);
                  if (firstInCat) setCenarioSelecionado(firstInCat.id);
                }}
                className={cn(
                  "flex-1 md:flex-none px-3 md:px-6 py-2 rounded-lg text-xs md:text-sm font-bold capitalize transition-all whitespace-nowrap",
                  categoria === cat ? "bg-primary text-primary-foreground gold-glow" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {cat === 'ensaio' ? 'Ensaio' : cat === 'aniversario' ? 'Aniversário' : 'Profissional'}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Uso Diário:</span>
            <span className="text-[10px] font-bold text-primary">{dailyUsage} / 1500</span>
          </div>
        </div>
      </header>

      {!isLoadingKey && !userApiKey && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <p className="font-bold text-amber-500">API Key Necessária</p>
              <p className="text-sm text-muted-foreground">Você precisa configurar sua Gemini API Key gratuita para começar a gerar imagens.</p>
            </div>
          </div>
          <Link 
            to="/configuracoes" 
            className="bg-amber-500 text-white font-bold px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-amber-600 transition-all whitespace-nowrap"
          >
            <Settings className="w-4 h-4" />
            Configurar Agora
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Upload & Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              {generatedImage ? 'Resultado' : 'Foto de Referência'}
            </h3>
            
            <div className="relative aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-all overflow-hidden group">
              {generatedImage ? (
                <img src={generatedImage} alt="Resultado" className="w-full h-full object-cover animate-in zoom-in duration-500" />
              ) : image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">Clique para enviar</p>
                    <p className="text-sm text-muted-foreground">ou arraste sua foto aqui</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              )}
              
              {(image || generatedImage) && !isGenerating && (
                <button 
                  onClick={() => { setImage(null); setGeneratedImage(null); }}
                  className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-destructive rounded-full text-white transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {generatedImage ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setGeneratedImage(null)}
                  className="flex-1 bg-secondary text-foreground font-bold py-4 rounded-xl hover:bg-secondary/80 transition-all"
                >
                  Tentar Outro
                </button>
                <button
                  onClick={downloadImage}
                  className="flex-1 bg-primary text-primary-foreground font-bold py-4 rounded-xl gold-glow hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
              </div>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !image || !userApiKey}
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl gold-glow hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Gerar Ensaio Agora
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right: Scenarios Selection */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Escolha o Cenário
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {cenariosFiltrados.map((cenario) => (
                <button
                  key={cenario.id}
                  onClick={() => {
                    setCenarioSelecionado(cenario.id);
                    setGeneratedImage(null);
                  }}
                  className={cn(
                    "relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all group",
                    cenarioSelecionado === cenario.id ? "border-primary gold-glow scale-[1.02]" : "border-transparent opacity-80 hover:opacity-100"
                  )}
                >
                  <img 
                    src={cenario.previewUrl || `https://picsum.photos/seed/${cenario.id}/400/600`} 
                    alt={cenario.nome} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${cenario.id}/400/600`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-left">
                    <p className="text-[10px] md:text-xs font-bold text-white leading-tight drop-shadow-md">{cenario.nome}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
