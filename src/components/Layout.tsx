import React, { useEffect, useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Camera, 
  ImagePlus, 
  ImageIcon, 
  GraduationCap, 
  DollarSign,
  ShieldCheck,
  Settings, 
  LogOut,
  User
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Camera, label: 'Gerador IA', path: '/gerador' },
  { icon: ImagePlus, label: 'Restauração', path: '/restauracao' },
  { icon: ImageIcon, label: 'Galeria', path: '/galeria' },
  { icon: GraduationCap, label: 'Treinamento', path: '/treinamento' },
  { icon: DollarSign, label: 'Ganhar Dinheiro', path: '/ganhar-dinheiro' },
  { icon: Settings, label: 'Configurações', path: '/configuracoes' },
];

const adminItems = [
  { icon: ShieldCheck, label: 'Admin', path: '/admin' },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
        // Fetch profile
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (data) {
            setProfile(data);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logout realizado com sucesso!');
      navigate('/auth');
    } catch (error) {
      toast.error('Erro ao sair.');
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-sidebar border-r border-border flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-serif font-bold text-primary tracking-tighter">
            STUDIO PRO AI
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-primary-foreground gold-glow" 
                    : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "group-hover:text-primary")} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
          
          {((profile?.role === 'admin') || (user?.email?.toLowerCase() === 'andreyhenrzp@gmail.com')) && adminItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group border border-primary/20 bg-primary/5",
                  isActive 
                    ? "bg-primary text-primary-foreground gold-glow" 
                    : "hover:bg-primary/10 text-primary hover:text-primary"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-primary")} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-4">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full" />
              ) : (
                <User className="w-5 h-5 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{profile?.display_name || user?.displayName || 'Usuário'}</p>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{profile?.role || 'User'}</p>
            </div>
          </div>
          
          <button 
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-sidebar border-b border-border p-4 flex items-center justify-between">
        <h1 className="text-xl font-serif font-bold text-primary tracking-tighter">
          STUDIO PRO AI
        </h1>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full" />
            ) : (
              <User className="w-4 h-4 text-primary" />
            )}
          </div>
          <button onClick={handleLogout} className="text-muted-foreground">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background/50 backdrop-blur-sm pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar/80 backdrop-blur-lg border-t border-border px-2 py-3 flex justify-around items-center z-50">
        {[...navItems, ...(((profile?.role === 'admin') || (user?.email?.toLowerCase() === 'andreyhenrzp@gmail.com')) ? adminItems : [])].map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                isActive ? "text-primary scale-110" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

