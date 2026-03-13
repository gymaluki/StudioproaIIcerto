import React, { useState, useEffect } from 'react';
import { Upload, ImagePlus, Sparkles, Wand2, Palette, Download, RefreshCw, AlertCircle, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { restorePhoto } from '../services/gemini';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { Link } from 'react-router-dom';

export default function Restauracao() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'restore' | 'colorize'>('restore');
  const [userApiKey, setUserApiKey] = useState<string | null>(null);
  const [isLoadingKey, setIsLoadingKey] = useState(true);
  const [dailyUsage, setDailyUsage] = useState(0);

  useEffect(() => {
    const loadApiKey = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

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

    const checkDailyUsage = () => {
      const today = new Date().toISOString().split('T')[0];
      const storedData = localStorage.getItem(`gemini_usage_${today}`);
      if (storedData) {
        setDailyUsage(parseInt(storedData));
      } else {
        localStorage.setItem(`gemini_usage_${today}`, '0');
        setDailyUsage(0);
      }
    };

    loadApiKey();
    checkDailyUsage();
  }, []);

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
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!userApiKey) {
      toast.error('API Key não encontrada. Configure sua chave nas configurações para processar imagens.');
      return;
    }

    if (dailyUsage >= 1500) {
      toast.error('Você atingiu o limite diário de 1500 gerações da API gratuita do Gemini.');
      return;
    }

    if (!image) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('Você precisa estar logado para processar fotos.');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await restorePhoto(image, mode, userApiKey);
      setProcessedImage(result);
      incrementUsage();
      
      // Save to Supabase
      try {
        const { error } = await supabase
          .from('ensaios')
          .insert({
            user_id: session.user.id,
            foto_original: image.substring(0, 100000),
            foto_gerada: result,
            status: 'completed',
            tipo: 'restauracao',
            cenario: mode
          });
        
        if (error) throw error;
      } catch (fsError) {
        handleSupabaseError(fsError, 'create', 'ensaios');
      }

      toast.success(mode === 'restore' ? 'Foto restaurada!' : 'Foto colorizada!');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Erro ao processar imagem. Verifique sua API Key.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `restaurada-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="space-y-8 fade-in-custom">
      <header>
        <h2 className="text-4xl font-serif font-bold">Restauração de Fotos</h2>
        <p className="text-muted-foreground">Dê vida nova a fotos antigas, riscadas ou em preto e branco.</p>
      </header>

      {!isLoadingKey && !userApiKey && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <p className="font-bold text-amber-500">API Key Necessária</p>
              <p className="text-sm text-muted-foreground">Você precisa configurar sua Gemini API Key gratuita para começar a processar imagens.</p>
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

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => { setMode('restore'); setProcessedImage(null); }}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
              mode === 'restore' ? "bg-primary text-primary-foreground gold-glow" : "bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            <Wand2 className="w-5 h-5" />
            Restaurar Nitidez
          </button>
          <button
            onClick={() => { setMode('colorize'); setProcessedImage(null); }}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
              mode === 'colorize' ? "bg-primary text-primary-foreground gold-glow" : "bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            <Palette className="w-5 h-5" />
            Colorizar P&B
          </button>
        </div>

        <div className="glass-card rounded-3xl p-6 md:p-10 space-y-8">
          <div className={cn(
            "relative flex flex-col items-center justify-center w-full aspect-video rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-all overflow-hidden group",
            (image || processedImage) && "border-none"
          )}>
            {processedImage ? (
              <div className="relative w-full h-full flex items-center justify-center bg-black/20">
                <img src={processedImage} alt="Resultado" className="max-w-full max-h-full object-contain" />
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest gold-glow">
                  Depois
                </div>
              </div>
            ) : image ? (
              <div className="relative w-full h-full flex items-center justify-center bg-black/20">
                <img src={image} alt="Preview" className="max-w-full max-h-full object-contain" />
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Antes
                </div>
              </div>
            ) : (
              <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-8 text-center space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <ImagePlus className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">Arraste sua foto antiga aqui</p>
                  <p className="text-muted-foreground">Formatos aceitos: JPG, PNG, WEBP</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            )}
          </div>

          <div className="flex gap-4">
            {processedImage ? (
              <>
                <button
                  onClick={() => { setImage(null); setProcessedImage(null); }}
                  className="flex-1 bg-secondary text-foreground font-bold py-4 rounded-xl hover:bg-secondary/80 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Nova Foto
                </button>
                <button
                  onClick={downloadImage}
                  className="flex-1 bg-primary text-primary-foreground font-bold py-4 rounded-xl gold-glow hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Baixar Foto
                </button>
              </>
            ) : (
              <button
                onClick={handleProcess}
                disabled={!image || isProcessing || !userApiKey}
                className="w-full bg-primary text-primary-foreground font-bold py-5 rounded-2xl gold-glow hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-3 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    {mode === 'restore' ? 'Restaurar Foto Agora' : 'Colorizar Foto Agora'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

