import React, { createContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Auto-login on mount
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          
          // Pull latest progress and sync to local storage
          const profileRes = await fetch(`${API_BASE_URL}/api/user/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (profileRes.ok) {
            const profile = await profileRes.json();
            localStorage.setItem('codepath_completed', JSON.stringify(profile.completedTopics));
            localStorage.setItem('concept_scores', JSON.stringify(profile.conceptScores));
            localStorage.setItem('completed_challenges', JSON.stringify(profile.completedChallenges));
          }
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.error('Auto login error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to sign in.');

    localStorage.setItem('auth_token', data.token);
    setToken(data.token);

    // Sync progress from DB to LocalStorage
    const profileRes = await fetch(`${API_BASE_URL}/api/user/profile`, {
      headers: { 'Authorization': `Bearer ${data.token}` }
    });
    if (profileRes.ok) {
      const profile = await profileRes.json();
      setUser(profile.user);
      localStorage.setItem('codepath_completed', JSON.stringify(profile.completedTopics));
      localStorage.setItem('concept_scores', JSON.stringify(profile.conceptScores));
      localStorage.setItem('completed_challenges', JSON.stringify(profile.completedChallenges));
    }
    return data.user;
  };

  const register = async (username, email, password) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to register.');

    localStorage.setItem('auth_token', data.token);
    setToken(data.token);
    setUser(data.user);

    // Guest progress syncing: upload current local storage guest progress to DB
    try {
      const savedCompleted = localStorage.getItem('codepath_completed');
      const completedList = savedCompleted ? JSON.parse(savedCompleted) : [];
      for (const topicId of completedList) {
        await fetch(`${API_BASE_URL}/api/user/progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`
          },
          body: JSON.stringify({ topicId, completed: true })
        });
      }

      const savedScores = localStorage.getItem('concept_scores');
      const scoresDict = savedScores ? JSON.parse(savedScores) : {};
      for (const [key, val] of Object.entries(scoresDict)) {
        await fetch(`${API_BASE_URL}/api/user/concept-score`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`
          },
          body: JSON.stringify({
            conceptKey: key,
            score: val.score,
            selectedOption: val.selected,
            conceptTitle: val.conceptTitle,
            topicId: val.topicId,
            topicTitle: val.topicTitle
          })
        });
      }

      const savedChallenges = localStorage.getItem('completed_challenges');
      const challengesList = savedChallenges ? JSON.parse(savedChallenges) : [];
      for (const challengeId of challengesList) {
        await fetch(`${API_BASE_URL}/api/user/challenge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`
          },
          body: JSON.stringify({ challengeId })
        });
      }
    } catch (e) {
      console.error('Failed to sync guest progress on registration:', e);
    }

    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('codepath_completed');
    localStorage.removeItem('concept_scores');
    localStorage.removeItem('completed_challenges');
    setToken(null);
    setUser(null);
  };

  const updateUserStats = (xp, level) => {
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, xp, level };
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      authModalOpen,
      setAuthModalOpen,
      login,
      register,
      logout,
      updateUserStats
    }}>
      {children}
    </AuthContext.Provider>
  );
}
