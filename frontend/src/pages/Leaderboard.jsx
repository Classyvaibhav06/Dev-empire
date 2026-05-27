import React, { useState, useEffect, useContext } from 'react';
import { Trophy, Medal, Award, Loader2, ArrowLeft, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge } from '../components/ui/Shared';
import { API_BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';

export default function Leaderboard() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const url = user ? `${API_BASE_URL}/api/leaderboard?userId=${user.id}` : `${API_BASE_URL}/api/leaderboard`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch leaderboard');
        const data = await res.json();
        setUsers(data.topUsers || []);
        setUserRank(data.userRank || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-danger font-semibold mb-2">Error loading leaderboard</p>
        <p className="text-textMuted text-sm">{error}</p>
      </div>
    );
  }

  const top3 = users.slice(0, 3);
  const others = users.slice(3);

  const PodiumAvatar = ({ userData, rank }) => {
    if (!userData) return null;
    const isFirst = rank === 1;
    const colors = {
      1: { border: 'border-yellow-400', grad: 'from-yellow-400 to-amber-600', text: 'text-yellow-400', shadow: 'shadow-[0_0_30px_rgba(250,204,21,0.4)]' },
      2: { border: 'border-gray-300', grad: 'from-gray-300 to-gray-500', text: 'text-gray-300', shadow: 'shadow-[0_0_20px_rgba(209,213,219,0.3)]' },
      3: { border: 'border-amber-600', grad: 'from-amber-600 to-amber-800', text: 'text-amber-600', shadow: 'shadow-[0_0_20px_rgba(217,119,6,0.3)]' }
    };
    const c = colors[rank];
    const height = isFirst ? 'h-40 md:h-48' : 'h-32 md:h-40';
    const avatarSize = isFirst ? 'w-20 h-20' : 'w-16 h-16';

    return (
      <div className={`flex flex-col items-center justify-end ${isFirst ? 'order-2 z-10 -mt-8' : rank === 2 ? 'order-1' : 'order-3'} flex-1 max-w-[120px]`}>
        <div className={`relative flex items-center justify-center ${avatarSize} rounded-full bg-surface border-4 ${c.border} mb-4 z-10 ${c.shadow}`}>
          <span className="text-xl font-bold text-textMain uppercase">{userData.username.slice(0, 2)}</span>
          <div className="absolute -bottom-3 bg-background rounded-full p-1 border border-surfaceBorder">
            {rank === 1 ? <Trophy className={`w-4 h-4 ${c.text}`} /> : <Medal className={`w-4 h-4 ${c.text}`} />}
          </div>
        </div>
        
        <div className={`w-full ${height} rounded-t-xl bg-gradient-to-t ${c.grad} opacity-90 p-4 flex flex-col items-center justify-start border-t border-l border-r border-white/20 relative overflow-hidden group`}>
           <div className="absolute inset-0 bg-white opacity-5 mix-blend-overlay pointer-events-none"></div>
           <h3 className="font-bold text-white text-center truncate w-full shadow-sm text-sm">{userData.username}</h3>
           <Badge variant="accent" className="mt-1 !text-[9px] bg-black/30 border-none text-white/90">Lv.{userData.level}</Badge>
           <span className="mt-auto font-black text-xl text-white drop-shadow-md">{userData.xp}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 w-full animate-fade-in pb-32">
      <Link to="/roadmap" className="inline-flex items-center gap-2 text-sm text-textMuted hover:text-primary transition-colors mb-8 font-semibold uppercase tracking-widest">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 border border-primary/20">
          <Award className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-textMain">Global Leaderboard</h1>
        <p className="text-lg text-textMuted max-w-2xl mx-auto">
          Top professionals ranked by XP. Complete concepts and projects to climb the ranks.
        </p>
      </div>

      <div className="space-y-10">
        {users.length === 0 ? (
          <div className="text-center text-textMuted py-12 surface rounded-2xl border border-surfaceBorder">
            No users found. Be the first to earn XP!
          </div>
        ) : (
          <>
            {/* Podium */}
            <div className="flex justify-center items-end gap-2 md:gap-4 mt-16 mb-8 px-4">
              {top3.length > 1 && <PodiumAvatar userData={top3[1]} rank={2} />}
              {top3.length > 0 && <PodiumAvatar userData={top3[0]} rank={1} />}
              {top3.length > 2 && <PodiumAvatar userData={top3[2]} rank={3} />}
            </div>

            {/* Rest of the list */}
            <div className="space-y-3 bg-surface/30 p-4 rounded-3xl border border-surfaceBorder/50">
              {others.map((u, index) => {
                const globalRank = index + 4;
                const isCurrentUser = user && user.id === u.id;
                
                return (
                  <Card key={u.id} hover={true} className={`!p-4 sm:!p-5 flex items-center gap-4 sm:gap-6 ${isCurrentUser ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/50' : 'bg-surface border-surfaceBorder'} transition-all`}>
                    <div className="flex-shrink-0 w-8 flex justify-center items-center">
                      <span className={`font-black text-lg ${isCurrentUser ? 'text-primary' : 'text-textDim'}`}>#{globalRank}</span>
                    </div>
                    
                    <div className="w-10 h-10 rounded-full bg-background border border-surfaceBorder flex items-center justify-center shrink-0">
                      <span className="font-bold text-xs text-textMuted uppercase">{u.username.slice(0,2)}</span>
                    </div>

                    <div className="flex-grow min-w-0">
                      <h3 className={`text-base font-bold truncate ${isCurrentUser ? 'text-primary' : 'text-textMain'}`}>
                        {u.username} {isCurrentUser && <span className="text-xs font-normal text-textMuted ml-2">(You)</span>}
                      </h3>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider">Level {u.level}</span>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 text-right">
                      <span className={`block text-xl font-black tracking-tighter ${isCurrentUser ? 'text-textMain' : 'text-textMuted'}`}>
                        {u.xp}
                      </span>
                      <span className="text-[10px] font-bold text-textDim uppercase tracking-widest">XP</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Current User Sticky Banner */}
      {userRank && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none flex justify-center animate-slide-up">
          <div className="pointer-events-auto bg-surface border border-primary/30 shadow-[0_0_40px_rgba(124,58,237,0.15)] rounded-2xl p-4 w-full max-w-4xl flex items-center justify-between backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10"></div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-0.5">Your Global Status</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className="text-lg font-black text-textMain leading-none">Rank #{userRank.rank}</span>
                  <span className="hidden sm:block text-textDim">•</span>
                  <span className="text-sm font-semibold text-textMuted">Level {userRank.level} • {userRank.xp} XP</span>
                </div>
              </div>
            </div>
            
            {userRank.rank > 3 && (
              <Link to="/roadmap" className="relative z-10 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl uppercase tracking-widest transition-all">
                Earn XP
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
