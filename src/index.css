@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Playfair Display", serif;

  --color-background: hsl(0 0% 7.1%);
  --color-foreground: hsl(40 10% 90%);
  
  --color-primary: hsl(43 50% 48%);
  --color-primary-foreground: hsl(0 0% 5%);
  
  --color-secondary: hsl(0 0% 14%);
  --color-secondary-foreground: hsl(40 10% 90%);
  
  --color-muted: hsl(0 0% 16%);
  --color-muted-foreground: hsl(0 0% 55%);
  
  --color-accent: hsl(43 40% 38%);
  --color-accent-foreground: hsl(40 10% 90%);
  
  --color-card: hsl(0 0% 10%);
  --color-card-foreground: hsl(40 10% 90%);
  
  --color-border: hsl(0 0% 18%);
  --color-input: hsl(0 0% 18%);
  --color-ring: hsl(43 50% 48%);

  --color-destructive: hsl(0 62.8% 50%);
  --color-destructive-foreground: hsl(40 10% 90%);

  --radius-lg: 0.75rem;
  --radius-md: calc(0.75rem - 2px);
  --radius-sm: calc(0.75rem - 4px);
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground font-sans;
  }
  h1, h2, h3, h4, h5, h6 {
    @apply font-serif;
  }
}

@layer components {
  .glass-card {
    @apply bg-card/50 backdrop-blur-md border border-white/10 shadow-xl;
  }
  
  .gold-glow {
    @apply shadow-[0_0_15px_rgba(184,134,11,0.3)];
  }
  
  .shimmer {
    @apply relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent;
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }

  .fade-in-custom {
    animation: fadeIn 0.7s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}
