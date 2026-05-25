import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Terminal, Code2, Zap, BookOpen, Trophy, Sun, Moon, User, LogOut, ChevronDown, Award } from 'lucide-react';
import Home from './pages/Home';
import Challenges from './pages/Challenges';
import GlobalAssistant from './components/GlobalAssistant';
import Roadmap from './pages/Roadmap';
import TopicDetail from './pages/TopicDetail';
import ConceptDetail from './pages/ConceptDetail';
import { useEffect, useState, useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import AuthModal from './components/AuthModal';function AppContent() {
  const { pathname } = useLocation();
  const { user, setAuthModalOpen, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background border-b border-surfaceBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-primary/10 p-2 rounded-md group-hover:bg-primary/20 transition-all border border-primary/20">
                <Terminal className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tighter text-textMain leading-none">DEV EMPIRE</span>
                <span className="text-[9px] font-bold tracking-[0.2em] text-accent uppercase mt-0.5">Learning Ecosystem</span>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-6">
              <Link to="/roadmap" className="hidden sm:flex items-center gap-2 text-xs text-textMuted hover:text-textMain font-bold tracking-widest uppercase transition-all">
                <BookOpen className="w-3.5 h-3.5" />
                Roadmaps
              </Link>
              <Link to="/challenges" className="hidden sm:flex items-center gap-2 text-xs text-textMuted hover:text-textMain font-bold tracking-widest uppercase transition-all">
                <Trophy className="w-3.5 h-3.5" />
                Challenges
              </Link>
              <Link to="/" className="hidden sm:flex items-center gap-2 text-xs text-textMuted hover:text-textMain font-bold tracking-widest uppercase transition-all">
                <Code2 className="w-3.5 h-3.5" />
                Playground
              </Link>
              <div className="w-px h-6 bg-surfaceBorder hidden sm:block" />
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md surface border border-surfaceBorder text-textMuted hover:text-textMain transition-all cursor-pointer flex items-center justify-center"
                aria-label="Toggle light/dark theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4" />}
              </button>

              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="px-4 py-2 bg-surface border border-surfaceBorder rounded-md text-textMain hover:border-primary/50 transition-all font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black uppercase text-[10px]">
                      {user.username[0]}
                    </div>
                    <span className="truncate max-w-[80px]">{user.username}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-textMuted" />
                  </button>

                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                      <div className="absolute right-0 mt-2 w-48 bg-surface border border-surfaceBorder rounded-xl shadow-xl py-2 z-50 animate-scale-in">
                        <div className="px-4 py-2 border-b border-surfaceBorder mb-2 text-left">
                          <div className="text-xs font-black text-textMain truncate">{user.username}</div>
                          <div className="text-[10px] text-textMuted truncate mb-1.5">{user.email}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[9px] bg-primary/15 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-black uppercase">
                              Lvl {user.level || 1}
                            </span>
                            <span className="text-[10px] text-textDim font-bold">{user.xp || 0} XP</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-danger hover:bg-danger/5 flex items-center gap-2 font-semibold transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-5 py-2 bg-primary text-white border border-primary-hover rounded-md font-semibold text-xs tracking-wide hover:bg-primary-hover transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/topic/:id" element={<TopicDetail />} />
          <Route path="/topic/:id/concept/:conceptIndex" element={<ConceptDetail />} />
          <Route path="/challenges" element={<Challenges />} />
        </Routes>
      </main>

      <GlobalAssistant />

      {/* Footer */}
      <footer className="relative z-10 border-t border-surfaceBorder py-16 mt-auto bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-md border border-primary/20">
                  <Terminal className="w-6 h-6 text-primary" />
                </div>
                <span className="font-black text-xl tracking-tighter">DEV EMPIRE</span>
              </div>
              <p className="text-textMuted text-sm max-w-xs leading-relaxed">
                A complete coding education ecosystem. Learn, build, and master modern development skills.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-textDim mb-4">Platform</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Roadmaps', path: '/roadmap' },
                  { name: 'Playground', path: '/' },
                  { name: 'Challenges', path: '/challenges' },
                  { name: 'Community', path: '/' }
                ].map(item => (
                  <li key={item.name}><Link to={item.path} className="text-sm text-textMuted hover:text-textMain transition-colors">{item.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-textDim mb-4">Learning Paths</h4>
              <ul className="space-y-3">
                {['Frontend Dev', 'Backend Dev', 'Full Stack', 'AI / ML'].map(item => (
                  <li key={item}><Link to="/roadmap" className="text-sm text-textMuted hover:text-primary transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-surfaceBorder pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-textDim">© {new Date().getFullYear()} Dev Empire. Built for developers, by developers.</p>
            <div className="flex items-center gap-2 text-xs text-textDim">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}




