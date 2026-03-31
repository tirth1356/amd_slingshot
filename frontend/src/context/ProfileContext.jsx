import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const ProfileContext = createContext(null);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within a ProfileProvider');
  return context;
};

export function ProfileProvider({ children }) {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!user || !token) return;
    try {
      setLoading(true);
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setProfile(data);
      else throw new Error(data.error || 'Failed to fetch profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
        return { success: true, data };
      }
      throw new Error(data.error);
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, error, updateProfile, refreshProfile: fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}
