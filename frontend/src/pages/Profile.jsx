import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Card, Badge } from '../components/ui/Shared';
import { 
  User, Award, Trophy, BookOpen, Star, 
  ChevronRight, Activity, Zap, CheckCircle2,
  MoreHorizontal, Flame, Code2, FolderOpen, ExternalLink
} from 'lucide-react';
import { getTopicById } from '../utils/topicContent';
import { Link, Navigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export default function Profile() {
  const { user, loading } = useContext(AuthContext);
  
  const [completedTopics, setCompletedTopics] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [conceptScores, setConceptScores] = useState({});
  const [achievementsData, setAchievementsData] = useState({ earned: [], all: [] });
  const [newlyUnlocked, setNewlyUnlocked] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadProgress = async () => {
      let savedChallengesList = [];
      const savedTopics = localStorage.getItem('codepath_completed');
      if (savedTopics) setCompletedTopics(JSON.parse(savedTopics));

      const savedChallenges = localStorage.getItem('completed_challenges');
      if (savedChallenges) {
        savedChallengesList = JSON.parse(savedChallenges);
        setCompletedChallenges(savedChallengesList);
      }

      const savedScores = localStorage.getItem('concept_scores');
      if (savedScores) setConceptScores(JSON.parse(savedScores));
      
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/user/achievements/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ challengeCount: savedChallengesList.length })
          });
          if (res.ok) {
            const data = await res.json();
            setAchievementsData({ earned: data.earned, all: data.all });
            if (data.newlyUnlocked && data.newlyUnlocked.length > 0) {
              setNewlyUnlocked(data.newlyUnlocked);
            }
          }
          
          const projRes = await fetch(`${API_BASE_URL}/api/user/projects`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (projRes.ok) {
            setProjects(await projRes.json());
          }
        } catch (err) {
          console.error("Failed to sync profile data", err);
        }
      }
    };

    loadProgress();
    window.addEventListener('userProgressSynced', loadProgress);
    return () => window.removeEventListener('userProgressSynced', loadProgress);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const formatChallengeId = (id) => {
    return id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const currentXp = user.xp || 0;
  const currentLevel = user.level || 1;
  const progressToNextLevel = currentXp % 100;
  const totalQuizzesPassed = Object.values(conceptScores).filter(s => s.score > 0).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 w-full animate-fade-in relative z-10">
      
      {/* Sleek Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full bg-surface border border-surfaceBorder flex items-center justify-center shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10"></div>
            <span className="text-4xl font-semibold text-primary relative z-10 uppercase tracking-tighter">
              {user.username.slice(0, 2)}
            </span>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-background border border-surfaceBorder rounded-full p-1 shadow-sm">
            <div className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" />
              Lv.{currentLevel}
            </div>
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left mt-2">
          <h1 className="text-3xl font-bold tracking-tight text-textMain mb-1">{user.username}</h1>
          <p className="text-textMuted text-sm font-medium">{user.email}</p>
          
          <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
            <Badge variant="outline" className="text-xs bg-surface/50">Developer</Badge>
            <Badge variant="outline" className="text-xs bg-surface/50">Joined 2026</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Stats & XP */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Progress Card (Shadcn Metric Style) */}
          <div className="rounded-xl border border-surfaceBorder bg-surface/40 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-textMuted flex items-center gap-2">
                <Zap className="w-4 h-4 text-warning" /> Level Progress
              </h3>
              <MoreHorizontal className="w-4 h-4 text-textDim" />
            </div>
            
            <div className="flex items-center justify-center mb-6 relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" className="stroke-surfaceBorder/50" strokeWidth="8" />
                <circle 
                  cx="64" cy="64" r="56" fill="none" 
                  className="stroke-primary transition-all duration-1000 ease-out drop-shadow-md" 
                  strokeWidth="8" 
                  strokeDasharray="352" 
                  strokeDashoffset={352 - (352 * progressToNextLevel) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-textMain">{progressToNextLevel}%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center px-2">
              <div className="text-xs text-textMuted font-medium">Total XP</div>
              <div className="text-lg font-semibold text-textMain">{currentXp}</div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-surfaceBorder bg-surface/40 p-4 shadow-sm flex flex-col gap-2 hover:bg-surface/60 transition-colors">
              <Flame className="w-4 h-4 text-warning" />
              <div>
                <div className="text-xl font-bold text-textMain leading-none">{user.streak_count || 0}</div>
                <div className="text-[11px] font-medium text-textMuted mt-1">Day Streak</div>
              </div>
            </div>
            <div className="rounded-xl border border-surfaceBorder bg-surface/40 p-4 shadow-sm flex flex-col gap-2 hover:bg-surface/60 transition-colors">
              <BookOpen className="w-4 h-4 text-accent" />
              <div>
                <div className="text-xl font-bold text-textMain leading-none">{completedTopics.length}</div>
                <div className="text-[11px] font-medium text-textMuted mt-1">Topics</div>
              </div>
            </div>
            <div className="rounded-xl border border-surfaceBorder bg-surface/40 p-4 shadow-sm flex flex-col gap-2 hover:bg-surface/60 transition-colors">
              <Trophy className="w-4 h-4 text-warning" />
              <div>
                <div className="text-xl font-bold text-textMain leading-none">{completedChallenges.length}</div>
                <div className="text-[11px] font-medium text-textMuted mt-1">Challenges</div>
              </div>
            </div>
            <div className="rounded-xl border border-surfaceBorder bg-surface/40 p-4 shadow-sm flex flex-col gap-2 hover:bg-surface/60 transition-colors">
              <Activity className="w-4 h-4 text-success" />
              <div>
                <div className="text-xl font-bold text-textMain leading-none">{totalQuizzesPassed}</div>
                <div className="text-[11px] font-medium text-textMuted mt-1">Quizzes Passed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Activity History */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Completed Topics */}
          <div className="rounded-xl border border-surfaceBorder bg-surface/40 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-surfaceBorder/50 flex items-center justify-between bg-surface/20">
              <h3 className="text-sm font-semibold text-textMain flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-textMuted" /> Roadmap Progress
              </h3>
            </div>
            
            <div className="p-2">
              {completedTopics.length === 0 ? (
                <div className="text-center py-10 text-textMuted text-sm">
                  You haven't completed any topics yet. <br/>
                  <Link to="/roadmap" className="text-primary hover:underline font-medium mt-2 inline-block">Explore Roadmaps</Link>
                </div>
              ) : (
                <div className="space-y-1">
                  {completedTopics.map((topicId) => {
                    const topicDetail = getTopicById(topicId);
                    return (
                      <Link 
                        key={topicId} 
                        to={`/topic/${topicId}`}
                        className="flex items-center justify-between p-3 px-4 rounded-lg hover:bg-surface/80 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-success opacity-80" />
                          <div>
                            <div className="font-medium text-sm text-textMain group-hover:text-primary transition-colors">{topicDetail?.title || topicId}</div>
                            {topicDetail?.level && <div className="text-[11px] text-textDim mt-0.5">{topicDetail.level}</div>}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-textDim group-hover:text-primary transition-colors" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Completed Challenges */}
          <div className="rounded-xl border border-surfaceBorder bg-surface/40 shadow-sm overflow-hidden mt-6">
            <div className="p-6 border-b border-surfaceBorder/50 flex items-center justify-between bg-surface/20">
              <h3 className="text-sm font-semibold text-textMain flex items-center gap-2">
                <Trophy className="w-4 h-4 text-textMuted" /> Solved Challenges
              </h3>
            </div>
            
            <div className="p-2">
              {completedChallenges.length === 0 ? (
                <div className="text-center py-10 text-textMuted text-sm">
                  You haven't solved any challenges yet. <br/>
                  <Link to="/challenges" className="text-primary hover:underline font-medium mt-2 inline-block">Try a Challenge</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-2">
                  {completedChallenges.map((challengeId) => (
                    <Link 
                      key={challengeId} 
                      to="/challenges"
                      className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-surfaceBorder hover:bg-surface/60 transition-colors group"
                    >
                      <div className="font-medium text-sm text-textMain group-hover:text-warning transition-colors">{formatChallengeId(challengeId)}</div>
                      <Trophy className="w-3.5 h-3.5 text-textDim group-hover:text-warning transition-colors" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Portfolio / Submitted Projects */}
          {projects.length > 0 && (
            <div className="rounded-xl border border-surfaceBorder bg-surface/40 shadow-sm overflow-hidden mt-6">
              <div className="p-6 border-b border-surfaceBorder/50 flex items-center justify-between bg-surface/20">
                <h3 className="text-sm font-semibold text-textMain flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-textMuted" /> Project Portfolio
                </h3>
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                  {projects.length} Projects
                </Badge>
              </div>
              
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map(proj => {
                  const topicDetail = getTopicById(proj.topic_id);
                  return (
                    <div key={proj.id} className="flex flex-col p-4 rounded-xl border border-surfaceBorder bg-surface/60 hover:bg-surface transition-colors">
                      <div className="font-bold text-sm mb-1 text-textMain flex items-center justify-between">
                        {topicDetail?.project?.title || topicDetail?.title || 'Project'}
                      </div>
                      <div className="text-[11px] text-textMuted mb-4 flex-1">
                        {topicDetail?.project?.description?.slice(0, 80) || 'Hands-on practice project.'}...
                      </div>
                      <div className="flex items-center gap-3 mt-auto pt-3 border-t border-surfaceBorder/50">
                        <a href={proj.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-textDim hover:text-white transition-colors">
                          <Code2 className="w-3.5 h-3.5" /> Source
                        </a>
                        {proj.live_url && (
                          <a href={proj.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-accent hover:text-white transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Achievements / Badges */}
          <div className="rounded-xl border border-surfaceBorder bg-surface/40 shadow-sm overflow-hidden mt-6">
            <div className="p-6 border-b border-surfaceBorder/50 flex items-center justify-between bg-surface/20">
              <h3 className="text-sm font-semibold text-textMain flex items-center gap-2">
                <Award className="w-4 h-4 text-textMuted" /> Badges & Achievements
              </h3>
              <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                {achievementsData.earned.length} / {achievementsData.all.length} Unlocked
              </Badge>
            </div>
            
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {achievementsData.all.map(ach => {
                const isEarned = achievementsData.earned.find(e => e.id === ach.id);
                const IconComp = {
                  'User': User,
                  'Flame': Flame,
                  'Code2': Code2,
                  'Star': Star,
                  'BookOpen': BookOpen,
                  'Trophy': Trophy,
                  'Award': Award
                }[ach.icon] || Award;
                
                const rarityColor = {
                  'Common': 'text-textMuted border-surfaceBorder bg-surface',
                  'Rare': 'text-accent border-accent/30 bg-accent/10 shadow-[0_0_15px_rgba(167,139,250,0.1)]',
                  'Epic': 'text-primary border-primary/30 bg-primary/10 shadow-[0_0_20px_rgba(124,58,237,0.2)]',
                  'Legendary': 'text-warning border-warning/30 bg-warning/10 shadow-[0_0_25px_rgba(250,204,21,0.25)]'
                }[ach.rarity] || 'text-textMuted border-surfaceBorder bg-surface';

                return (
                  <div key={ach.id} className={`flex flex-col items-center text-center p-4 rounded-xl border ${isEarned ? rarityColor : 'border-surfaceBorder bg-surface/20 opacity-40 grayscale'} transition-all`}>
                    <div className="mb-2 p-2.5 rounded-full bg-background/60 shadow-inner">
                      <IconComp className={`w-6 h-6 ${isEarned ? '' : 'text-textMuted'}`} />
                    </div>
                    <div className="font-bold text-xs mb-1 text-textMain leading-tight">{ach.title}</div>
                    <div className="text-[9px] text-textDim leading-tight">{ach.description}</div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Achievement Unlocked Toast */}
      {newlyUnlocked.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          {newlyUnlocked.map((ach, idx) => (
            <div key={idx} className="bg-surface border border-warning/30 shadow-2xl p-4 rounded-xl flex items-center gap-4 animate-slide-up transform transition-all">
              <div className="bg-warning/10 p-2 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                <Trophy className="w-6 h-6 text-warning" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-black tracking-widest text-warning mb-0.5">Achievement Unlocked!</div>
                <div className="font-bold text-textMain text-sm">{ach.title}</div>
              </div>
              <button onClick={() => setNewlyUnlocked(prev => prev.filter((_, i) => i !== idx))} className="ml-2 text-textMuted hover:text-white transition-colors">
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
