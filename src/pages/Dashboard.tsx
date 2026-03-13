import React, { useEffect, useState } from 'react';
import { Camera, Sparkles, Trophy, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEnsaios: 0,
    totalRestauracoes: 0,
    plan: 'Básico',
    dailyUsage: 0
  });
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      setDisplayName(session.user.user_metadata?.full_name?.split(' ')[0] || 'Criativo');

      // Load daily usage from localStorage
      const today = new Date().toISOString().split('T')[0];
      const storedUsage = localStorage.getItem(`gemini_usage_${today}`);
      const usage = storedUsage ? parseInt(storedUsage) : 0;

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, display_name')
        .eq('user_id', session.user.id)
        .single();
      
      if (profile) {
        setStats(prev => ({ ...prev, plan: profile.role || 'Básico', dailyUsage: usage }));
        if (profile.display_name) {
          setDisplayName(profile.display_name.split(' ')[0]);
        }
      }

      // Count ensaios
      const { data: ensaiosData } = await supabase
        .from('ensaios')
        .select('tipo')
        .eq('user_id', session.user.id);
      
      if (ensaiosData) {
        const ensaios = ensaiosData.filter(item => item.tipo !== 'restauracao').length;
        const restauracoes = ensaiosData.filter(item => item.tipo === 'restauracao').length;
        setStats(prev => ({
          ...prev,
          totalEnsaios: ensaios,
          totalRestauracoes: restauracoes,
          dailyUsage: usage
        }));
      }
      setLoading(false);
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-8 fade-in-custom">
      <header>
        <h2 className="text-3xl font-serif font-bold">Olá, {displayName}!</h2>
        <p className="text-muted-foreground">Bem-vindo ao seu estúdio fotográfico com IA.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-4 border-white/5 hover:border-primary/30 transition-all group">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Camera className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Ensaios</h3>
          <p className="text-4xl font-serif font-bold">{loading ? '...' : stats.totalEnsaios}</p>
        </div>
        
        <div className="glass-card p-6 rounded-2xl space-y-4 border-white/5 hover:border-primary/30 transition-all group">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Restaurações</h3>
          <p className="text-4xl font-serif font-bold">{loading ? '...' : stats.totalRestauracoes}</p>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-4 border-white/5 hover:border-primary/30 transition-all group">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Uso Diário</h3>
          <div className="space-y-1">
            <p className="text-4xl font-serif font-bold">{loading ? '...' : stats.dailyUsage}</p>
            <p className="text-xs text-muted-foreground">gerações hoje</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-4 border-white/5 hover:border-primary/30 transition-all group">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Plano</h3>
          <p className="text-xl font-serif font-bold text-primary uppercase tracking-wider">
            {loading ? '...' : stats.plan}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-3xl p-8 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Atividade Recente
          </h3>
          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 rounded-2xl" />)}
              </div>
            ) : stats.totalEnsaios + stats.totalRestauracoes === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                Nenhuma atividade recente encontrada.
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                Suas criações aparecerão aqui em breve.
              </div>
            )}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8 space-y-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <h3 className="text-xl font-bold">Dica do Dia</h3>
          <p className="text-muted-foreground leading-relaxed">
            "Para melhores resultados em ensaios profissionais, use fotos de rosto com iluminação frontal e fundo neutro."
          </p>
          <button className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl gold-glow hover:opacity-90 transition-all">
            Ver Tutoriais
          </button>
        </div>
      </div>
    </div>
  );
}

