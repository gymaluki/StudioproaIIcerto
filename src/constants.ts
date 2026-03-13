import { Cenario } from "./types";

// Limite da API Gemini Free Tier: 1500 requisições por dia
export const GEMINI_DAILY_LIMIT = 1500;

export const CENARIOS: Cenario[] = [
  // Ensaio Fotográfico
  {
    id: "praia-escura",
    nome: "Praia Escura 🌅",
    arquivo: "praia-escura.jpg",
    categoria: "ensaio",
    prompt: "Garota deitada na cama com lençóis de cetim rosa, segurando um telefone fixo rosa clássico, fundo roxo vibrante com estrelas brilhantes, iluminação suave e estética, visual sonhador",
    previewUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "foto-colorida",
    nome: "Foto Colorida 🍭",
    arquivo: "colorida.jpg",
    categoria: "ensaio",
    prompt: "Ambiente retrô rosa vibrante, cozinha estética, garota vestindo casaco branco felpudo com estrelas coloridas, segurando pirulito arco-íris grande, copos de bubble tea no balcão, cores saturadas, estilo anos 90/2000, iluminação pop",
    previewUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "cinematografica",
    nome: "Cinematográfica 🎞️",
    arquivo: "cinematografica.jpg",
    categoria: "ensaio",
    prompt: "Estilo cinematográfico profissional, garota segurando buquê de flores vermelhas (dálias), fundo com trem em movimento desfocado, iluminação de fim de tarde, visual vintage, alta resolução, grão de filme sutil, profundidade de campo rasa",
    previewUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "foto-espelho",
    nome: "Foto no Espelho 🪞",
    arquivo: "espelho.jpg",
    categoria: "ensaio",
    prompt: "Selfie no espelho oval com moldura clássica, garota segurando câmera vintage prateada em frente ao rosto, vestindo suéter de tricô branco, quarto aconchegante ao fundo, iluminação natural suave vinda da janela",
    previewUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "preto-branco",
    nome: "Preto & Branco 📸",
    arquivo: "pb-estetico.jpg",
    categoria: "ensaio",
    prompt: "Retrato estético em preto e branco cinematográfico, alto contraste, garota vestindo sobretudo escuro, sombras de persiana dramáticas no rosto e fundo, pose editorial, visual de filme noir moderno",
    previewUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=800&auto=format&fit=crop"
  },
  // Aniversário
  {
    id: "baloes-lilas",
    nome: "Balões & Flores Lilás 🎈",
    arquivo: "aniver-lilas.jpg",
    categoria: "aniversario",
    prompt: "Cenário de aniversário festivo, arco de balões lilás, rosa e flores brancas, garota vestindo blazer rosa e jeans, segurando balões prateados número '26', globo de discoteca no chão, fundo branco limpo",
    previewUrl: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "velas-pedraria",
    nome: "Velas com Pedraria ✨",
    arquivo: "aniver-velas.jpg",
    categoria: "aniversario",
    prompt: "Close-up artístico, garota segurando velas número '26' cravejadas com pedrarias rosa e pérolas, chamas acesas, fundo preto profundo, iluminação dramática focada nas mãos e rosto",
    previewUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "glamour-preto",
    nome: "Glamour Preto & Dourado 🖤",
    arquivo: "aniver-preto.jpg",
    categoria: "aniversario",
    prompt: "Garota ajoelhada em estúdio cercada por balões pretos e dourados no chão, segurando mini bolo preto luxuoso com velas '26', vestindo vestido preto brilhante, iluminação de holofote circular focada",
    previewUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "rose-confetes",
    nome: "Rosé & Confetes 🥂",
    arquivo: "aniver-rose.jpg",
    categoria: "aniversario",
    prompt: "Garota sentada na cama vestindo camisa branca oversized, segurando balões rosé gold número '26', fundo decorado com luzes de fada e confetes dourados, atmosfera de festa em casa elegante",
    previewUrl: "https://images.unsplash.com/photo-1533294160622-d5fece3e080d?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "bolo-faiscas",
    nome: "Bolo com Faíscas 🎇",
    arquivo: "aniver-faiscas.jpg",
    categoria: "aniversario",
    prompt: "Celebração de aniversário à noite, garota sorrindo atrás de um bolo branco decorado com rosas, dois sparklers de faíscas acesos nas laterais, fundo escuro com luzes bokeh quentes, clima mágico",
    previewUrl: "https://images.unsplash.com/photo-1533227268408-a774ad203c03?q=80&w=800&auto=format&fit=crop"
  },
  // Profissional
  {
    id: "poltrona-elegante",
    nome: "Poltrona Elegante 🪑",
    arquivo: "prof-poltrona.jpg",
    categoria: "profissional",
    prompt: "Retrato executivo sofisticado, garota sentada em poltrona de couro marrom clássica, vestindo terno creme elegante, mão no queixo, fundo marrom quente, iluminação suave de luxo",
    previewUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "banco-alto",
    nome: "Banco Alto Estúdio 🖤",
    arquivo: "prof-banco.jpg",
    categoria: "profissional",
    prompt: "Retrato corporativo moderno, garota sentada em banco alto de estúdio, vestindo terno completo branco impecável, batom vermelho vibrante, fundo cinza escuro sólido, iluminação profissional de três pontos",
    previewUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "cadeira-pb",
    nome: "Cadeira P&B Moderna 🎬",
    arquivo: "prof-cadeira.jpg",
    categoria: "profissional",
    prompt: "Fotografia P&B artística, garota sentada em cadeira de metal dobrável, vestindo blazer preto e camiseta listrada, fundo branco infinito, estilo minimalista, pose descontraída mas profissional",
    previewUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "retrato-sofisticado",
    nome: "Retrato Sofisticado 💎",
    arquivo: "prof-focado.jpg",
    categoria: "profissional",
    prompt: "Close-up profissional de rosto, garota com mãos cruzadas sob o queixo, vestindo blazer branco, relógio de pulso prateado, olhar confiante para a câmera, fundo neutro, pele perfeita",
    previewUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "editorial-fashion",
    nome: "Editorial Fashion 👠",
    arquivo: "prof-magazine.jpg",
    categoria: "profissional",
    prompt: "Garota caminhando em estúdio de moda, vestindo blazer risca de giz preto e calça branca, segurando revista de moda, pés descalços, fundo branco, estilo editorial fashion business",
    previewUrl: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=800&auto=format&fit=crop"
  }
];
