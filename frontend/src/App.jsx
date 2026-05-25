import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Terminal, Code2, Zap, BookOpen, Trophy, Sun, Moon, User, LogOut, ChevronDown, Award, Menu, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navItems = [
    { name: 'Roadmaps', path: '/roadmap', icon: BookOpen },
    { name: 'Challenges', path: '/challenges', icon: Trophy },
    { name: 'Playground', path: '/', icon: Code2 }
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Glassmorphic Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-surfaceBorder/60 bg-background/85 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-all border border-primary/20 dark:shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <Terminal className="w-5 h-5 text-primary group-hover:scale-105 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tighter text-textMain leading-none bg-clip-text bg-gradient-to-r from-textMain to-textMain/90 group-hover:to-primary transition-colors">DEV EMPIRE</span>
                <span className="text-[8px] font-bold tracking-[0.25em] text-accent uppercase mt-0.5 leading-none">Learning Ecosystem</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden sm:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider uppercase transition-all duration-200 border ${
                      isActive 
                        ? 'text-primary bg-primary/5 dark:bg-primary/10 border-primary/15'
                        : 'text-textMuted hover:text-textMain hover:bg-surface/50 border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-surface/50 border border-surfaceBorder text-textMuted hover:text-textMain transition-all cursor-pointer flex items-center justify-center active:scale-95 group shadow-sm hover:border-surfaceBorderHover"
                aria-label="Toggle light/dark theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-warning group-hover:rotate-45 transition-transform duration-300" />
                ) : (
                  <Moon className="w-4 h-4 group-hover:-rotate-12 transition-transform duration-300" />
                )}
              </button>

              <div className="w-px h-6 bg-surfaceBorder hidden sm:block" />

              {/* Desktop User Section */}
              <div className="hidden sm:block">
                {user ? (
                  <div className="relative">
                    <button 
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="px-3 py-1.5 bg-surface/80 dark:bg-background/40 hover:bg-surface border border-surfaceBorder hover:border-primary/30 rounded-xl text-textMain transition-all font-bold text-xs flex items-center gap-2.5 cursor-pointer shadow-sm active:scale-98"
                    >
                      <div className="relative">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center text-primary font-black uppercase text-[11px] shadow-inner">
                          {user.username[0]}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-primary text-[7px] text-white font-black px-1 rounded-full border border-surface scale-90">
                          {user.level || 1}
                        </div>
                      </div>
                      <span className="truncate max-w-[80px] font-bold">{user.username}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-textMuted transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {dropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                        <div className="absolute right-0 mt-2.5 w-56 bg-surface border border-surfaceBorder rounded-2xl shadow-xl py-3.5 z-50 animate-scale-in">
                          <div className="px-4 pb-3 border-b border-surfaceBorder mb-3 text-left">
                            <div className="text-xs font-black text-textMain truncate">{user.username}</div>
                            <div className="text-[10px] text-textMuted truncate mb-2">{user.email}</div>
                            
                            {/* XP Progress Section */}
                            <div className="mt-2.5 pt-2.5 border-t border-surfaceBorder/60">
                              <div className="flex justify-between text-[9px] text-textDim font-black uppercase tracking-wider mb-1.5">
                                <span className="flex items-center gap-1 text-primary">
                                  <Award className="w-3 h-3" />
                                  Level {user.level || 1}
                                </span>
                                <span>{(user.xp || 0) % 100}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-surfaceBorder rounded-full overflow-hidden shadow-inner">
                                <div 
                                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500" 
                                  style={{ width: `${(user.xp || 0) % 100}%` }}
                                />
                              </div>
                              <div className="text-[8px] text-textDim font-bold text-right mt-1">{(user.xp || 0)} total XP</div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => {
                              logout();
                              setDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-danger hover:bg-danger/5 flex items-center gap-2 font-bold transition-colors cursor-pointer"
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
                    className="px-4 py-2 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white border border-primary-hover/50 hover:border-primary/60 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg hover:shadow-primary/10 active:scale-95"
                  >
                    <Zap className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                    Sign In
                  </button>
                )}
              </div>

              {/* Mobile Hamburger menu */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2.5 rounded-xl bg-surface/50 border border-surfaceBorder text-textMuted hover:text-textMain transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-sm"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-background/40 backdrop-blur-sm z-30 sm:hidden" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-surfaceBorder z-40 p-4 shadow-xl flex flex-col gap-3 animate-slide-up sm:hidden">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                      isActive 
                        ? 'text-primary bg-primary/5 dark:bg-primary/10 border border-primary/20 shadow-sm'
                        : 'text-textMuted hover:text-textMain hover:bg-surface/50 border border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
              
              <div className="h-px bg-surfaceBorder/80 my-1" />

              {/* Mobile Profile / Auth */}
              {user ? (
                <div className="flex flex-col gap-3.5 p-2 bg-surface/30 rounded-2xl border border-surfaceBorder/50 mt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center text-primary font-black uppercase text-xs shadow-inner">
                      {user.username[0]}
                    </div>
                    <div>
                      <div className="text-xs font-black text-textMain truncate leading-none">{user.username}</div>
                      <div className="text-[10px] text-textMuted truncate mt-1">{user.email}</div>
                    </div>
                  </div>
                  
                  {/* Mobile XP Progress */}
                  <div className="border-t border-surfaceBorder/60 pt-2.5">
                    <div className="flex justify-between text-[9px] text-textDim font-black uppercase tracking-wider mb-1.5">
                      <span className="flex items-center gap-1 text-primary">
                        <Award className="w-3 h-3" />
                        Level {user.level || 1}
                      </span>
                      <span>{(user.xp || 0) % 100}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surfaceBorder rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full" 
                        style={{ width: `${(user.xp || 0) % 100}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-3 bg-danger/10 border border-danger/20 rounded-xl text-xs text-danger font-bold flex items-center justify-center gap-2 transition-all hover:bg-danger/20 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3.5 bg-primary text-white border border-primary-hover rounded-xl font-bold text-xs tracking-wider hover:bg-primary-hover transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
                  Sign In
                </button>
              )}
            </div>
          </>
        )}
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




