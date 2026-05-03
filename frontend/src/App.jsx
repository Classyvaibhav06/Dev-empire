import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Terminal } from 'lucide-react';
import Home from './pages/Home';
import Roadmap from './pages/Roadmap';
import TopicDetail from './pages/TopicDetail';
import { useEffect } from 'react';

// this is the app.jsx file

function App() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-surfaceHover">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-surfaceHover p-2 rounded-lg group-hover:bg-primary/10 transition-colors">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight text-textMain">CodePath</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/roadmap" className="text-textMuted hover:text-textMain font-medium transition-colors">
                Roadmap
              </Link>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="px-4 py-2 bg-white text-textMain rounded-full font-medium transition-all border border-surfaceHover hover:border-textMuted/30 shadow-sm">
                Get demo
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/topic/:id" element={<TopicDetail />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-surfaceHover py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-textMuted text-sm">
          <p>© {new Date().getFullYear()} CodePath. Designed for developers.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
