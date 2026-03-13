import React from 'react';
import { MessageSquare, Phone, Copy, CheckCircle2, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

const scripts = [
  {
    title: "Abordagem Inicial (WhatsApp)",
    content: "Olá! Vi que você tem interesse em um ensaio fotográfico profissional. Sabia que agora você pode ter fotos de estúdio sem sair de casa usando nossa IA? Posso te explicar como funciona?",
    icon: MessageSquare
  },
  {
    title: "Quebra de Objeção (Preço)",
    content: "Entendo perfeitamente. Um ensaio presencial custaria cerca de R$500 a R$1.500. Com nossa tecnologia, você consegue o mesmo resultado editorial por apenas R$47. É uma economia de mais de 90%!",
    icon: Phone
  },
  {
    title: "Fechamento Gold",
    content: "O pacote Gold é o nosso mais completo. Além de 50 fotos em qualquer cenário, você ainda ganha o bônus de restauração de 5 fotos antigas da sua família. Vamos garantir sua vaga hoje?",
    icon: CheckCircle2
  }
];

export default function Treinamento() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Script copiado para a área de transferência!');
  };

  return (
    <div className="space-y-8 fade-in-custom">
      <header className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-4xl font-serif font-bold">Treinamento & Scripts</h2>
          <p className="text-muted-foreground">Aprenda a vender seus ensaios e faturar alto com IA.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border-primary/20 bg-primary/5">
          <h3 className="text-lg font-bold text-primary mb-2">Básico</h3>
          <p className="text-3xl font-serif font-bold mb-4">R$ 47</p>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>• 10 Fotos Geradas</li>
            <li>• Cenários Básicos</li>
            <li>• Suporte via Email</li>
          </ul>
        </div>
        <div className="glass-card p-6 rounded-2xl border-primary/40 bg-primary/10 scale-105 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Mais Vendido</div>
          <h3 className="text-lg font-bold text-primary mb-2">Premium</h3>
          <p className="text-3xl font-serif font-bold mb-4">R$ 97</p>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>• 30 Fotos Geradas</li>
            <li>• Todos os Cenários</li>
            <li>• Restauração Ilimitada</li>
          </ul>
        </div>
        <div className="glass-card p-6 rounded-2xl border-primary/20 bg-primary/5">
          <h3 className="text-lg font-bold text-primary mb-2">Gold</h3>
          <p className="text-3xl font-serif font-bold mb-4">R$ 197</p>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>• Fotos Ilimitadas</li>
            <li>• Acesso Vitalício</li>
            <li>• Mentoria de Vendas</li>
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-serif font-bold">Scripts de Vendas</h3>
        <div className="grid grid-cols-1 gap-4">
          {scripts.map((script, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                <script.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="font-bold">{script.title}</h4>
                <p className="text-muted-foreground text-sm italic">"{script.content}"</p>
              </div>
              <button 
                onClick={() => copyToClipboard(script.content)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-primary hover:text-primary-foreground rounded-lg transition-all text-sm font-bold"
              >
                <Copy className="w-4 h-4" />
                Copiar Script
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
