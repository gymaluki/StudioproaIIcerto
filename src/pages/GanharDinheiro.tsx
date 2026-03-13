import React from 'react';
import { DollarSign, TrendingUp, Users, Target, Rocket, ArrowRight } from 'lucide-react';

const strategies = [
  {
    title: "Venda de Ensaios Individuais",
    description: "Cobre entre R$ 47 e R$ 97 por um pacote de 10 a 30 fotos geradas por IA. O custo para você é zero!",
    icon: DollarSign,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    title: "Gestão de Perfil (Social Media)",
    description: "Ofereça um serviço mensal para influenciadores, criando fotos editoriais constantes para o feed deles.",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Anúncios de Alta Conversão",
    description: "Use as fotos geradas para criar criativos de anúncios que chamam a atenção e convertem mais.",
    icon: Target,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Escala com Afiliados",
    description: "Crie uma rede de parceiros que vendem seus ensaios em troca de uma comissão por venda.",
    icon: Rocket,
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  }
];

export default function GanharDinheiro() {
  return (
    <div className="space-y-8 fade-in-custom pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-serif font-bold">Ganhar Dinheiro Online 💰</h2>
          <p className="text-muted-foreground">Transforme sua criatividade em lucro real com o STUDIO PRO AI.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {strategies.map((item, i) => (
          <div key={i} className="glass-card p-8 rounded-3xl space-y-4 border-white/5 hover:border-primary/30 transition-all group">
            <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <item.icon className={`w-7 h-7 ${item.color}`} />
            </div>
            <h3 className="text-2xl font-bold">{item.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {item.description}
            </p>
            <div className="pt-4">
              <button className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                Ver Estratégia Detalhada <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-3xl p-8 md:p-12 bg-gradient-to-br from-primary/20 via-transparent to-transparent border-primary/20 space-y-8">
        <div className="max-w-2xl space-y-4">
          <h3 className="text-3xl font-serif font-bold flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            Plano de Ação: R$ 5.000/mês
          </h3>
          <p className="text-muted-foreground text-lg">
            Siga este passo a passo simples para começar a faturar seus primeiros R$ 5.000 online usando nossa tecnologia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="text-4xl font-serif font-bold text-primary/30">01</div>
            <h4 className="text-xl font-bold">Crie seu Portfólio</h4>
            <p className="text-sm text-muted-foreground">Gere 5 ensaios de alta qualidade em diferentes categorias para mostrar o que a IA é capaz de fazer.</p>
          </div>
          <div className="space-y-3">
            <div className="text-4xl font-serif font-bold text-primary/30">02</div>
            <h4 className="text-xl font-bold">Aborde Clientes</h4>
            <p className="text-sm text-muted-foreground">Use nossos scripts de vendas para abordar potenciais clientes no Instagram e WhatsApp.</p>
          </div>
          <div className="space-y-3">
            <div className="text-4xl font-serif font-bold text-primary/30">03</div>
            <h4 className="text-xl font-bold">Entregue e Escale</h4>
            <p className="text-sm text-muted-foreground">Entregue as fotos em menos de 24h e peça depoimentos para atrair novos clientes organicamente.</p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Potencial de Lucro</p>
                <p className="text-2xl font-serif font-bold">R$ 150 - R$ 450 / dia</p>
              </div>
            </div>
            <button className="w-full md:w-auto bg-primary text-primary-foreground font-bold px-10 py-4 rounded-xl gold-glow hover:opacity-90 transition-all">
              Começar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
