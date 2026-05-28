import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, FileCode2, Globe, Clock, Copy, GitFork } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

export default function Explore() {
  const { token, user } = useContext(AuthContext);
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [upvoting, setUpvoting] = useState(null);

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/explore/snippets`);
      if (res.ok) {
        const data = await res.json();
        setSnippets(data);
      }
    } catch (err) {
      console.error('Failed to fetch snippets', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id) => {
    if (!token) return alert('Please login to upvote snippets.');
    setUpvoting(id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/explore/snippets/${id}/upvote`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSnippets(prev => prev.map(s => s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s));
      } else {
        const data = await res.json();
        if (data.error === 'Already upvoted') {
          alert('You have already upvoted this snippet!');
        }
      }
    } catch (err) {
      console.error(err);
    }
    setUpvoting(null);
  };

  const filteredSnippets = snippets.filter(s => 
    (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.language || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-2">
            Explore Snippets
          </h1>
          <p className="text-gray-400 text-lg">
            Discover, upvote, and fork code snippets shared by the community.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 bg-background-light border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredSnippets.length === 0 ? (
        <div className="text-center py-20 bg-background-light/50 border border-white/5 rounded-2xl">
          <FileCode2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-300 mb-2">No snippets found</h2>
          <p className="text-gray-500">
            Be the first to share something awesome from the Playground!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSnippets.map((snippet) => (
            <div key={snippet.id} className="bg-background-light border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-all group flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  {snippet.language === 'web' ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-400 text-xs font-medium">
                      <Globe className="w-3.5 h-3.5" /> Web Sandbox
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary-light text-xs font-medium">
                      <Terminal className="w-3.5 h-3.5" /> {snippet.language}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(snippet.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{snippet.title}</h3>
              <p className="text-gray-400 text-sm mb-6 flex-1 line-clamp-3">
                {snippet.description || 'No description provided.'}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-[10px]">
                    {snippet.author ? snippet.author.charAt(0).toUpperCase() : '?'}
                  </div>
                  <span>{snippet.author || 'Anonymous'}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleUpvote(snippet.id)}
                    disabled={upvoting === snippet.id}
                    className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${snippet.upvotes > 0 ? 'text-red-400 fill-red-400' : ''}`} />
                    <span className="text-sm font-medium">{snippet.upvotes}</span>
                  </button>
                  <Link 
                    to={`/playground?snippet=${snippet.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-primary hover:text-white transition-all text-sm font-medium text-gray-300"
                  >
                    <GitFork className="w-4 h-4" /> Fork
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
