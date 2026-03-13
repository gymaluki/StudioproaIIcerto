import React, { useEffect, useState } from 'react';
import { Download, Trash2, ExternalLink, ImageIcon } from 'lucide-react';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { toast } from 'sonner';

export default function Galeria() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPhotos = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('ensaios')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        handleSupabaseError(error, 'list', 'ensaios');
      } else {
        setPhotos(data || []);
      }
      setLoading(false);

      const channel = supabase
        .channel('user-ensaios')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'ensaios',
          filter: `user_id=eq.${session.user.id}`
        }, async () => {
          const { data: newData } = await supabase
            .from('ensaios')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });
          if (newData) setPhotos(newData);
        })
        .subscribe();
      
      return () => supabase.removeChannel(channel);
    };

    loadPhotos();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta foto?')) return;
    
    try {
      const { error } = await supabase
        .from('ensaios')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Foto excluída com sucesso!');
    } catch (error) {
      handleSupabaseError(error, 'delete', 'ensaios');
    }
  };

  const downloadImage = (url: string, id: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `ensaio-${id}.png`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in-custom">
      <header>
        <h2 className="text-4xl font-serif font-bold">Sua Galeria</h2>
        <p className="text-muted-foreground">Todas as suas criações em um só lugar.</p>
      </header>

      {photos.length === 0 ? (
        <div className="glass-card rounded-3xl p-20 text-center space-y-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <ImageIcon className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Sua galeria está vazia</h3>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Comece a gerar seus ensaios agora mesmo para vê-los aqui.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative glass-card rounded-2xl overflow-hidden border-white/5 hover:border-primary/30 transition-all">
              <div className="aspect-[3/4] overflow-hidden">
                <img 
                  src={photo.foto_gerada} 
                  alt="Gerada" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">{photo.tipo}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(photo.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => downloadImage(photo.foto_gerada, photo.id)}
                      className="p-2 bg-white/10 hover:bg-primary hover:text-primary-foreground rounded-lg transition-all"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(photo.id)}
                      className="p-2 bg-white/10 hover:bg-destructive hover:text-white rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

