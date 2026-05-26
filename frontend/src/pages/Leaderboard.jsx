import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge } from '../components/ui/Shared';
import { API_BASE_URL } from '../config';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/leaderboard`);
        if (!res.ok) throw new Error('Failed to fetch leaderboard');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

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

  const getRankBadge = (index) => {
    switch(index) {
      case 0: return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 1: return <Medal className="w-6 h-6 text-gray-400" />;
      case 2: return <Medal className="w-6 h-6 text-amber-700" />;
      default: return <span className="font-bold text-textMuted text-lg w-6 text-center">{index + 1}</span>;
    }
  };

  const getRankStyle = (index) => {
    switch(index) {
      case 0: return 'bg-yellow-400/10 border-yellow-400/30';
      case 1: return 'bg-gray-400/10 border-gray-400/30';
      case 2: return 'bg-amber-700/10 border-amber-700/30';
      default: return 'surface border-surfaceBorder';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 w-full animate-fade-in">
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

      <div className="space-y-4">
        {users.length === 0 ? (
          <div className="text-center text-textMuted py-12 surface rounded-2xl border border-surfaceBorder">
            No users found. Be the first to earn XP!
          </div>
        ) : (
          users.map((user, index) => (
            <Card key={user.id} hover={true} className={`!p-4 sm:!p-6 flex items-center gap-4 sm:gap-6 ${getRankStyle(index)}`}>
              <div className="flex-shrink-0 w-10 flex justify-center items-center">
                {getRankBadge(index)}
              </div>
              
              <div className="flex-grow min-w-0">
                <h3 className="text-lg font-bold text-textMain truncate">{user.username}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="accent" className="!text-[10px]">Level {user.level}</Badge>
                </div>
              </div>
              
              <div className="flex-shrink-0 text-right">
                <span className="block text-2xl font-black tracking-tighter text-textMain">
                  {user.xp}
                </span>
                <span className="text-xs font-bold text-textMuted uppercase tracking-widest">XP</span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
