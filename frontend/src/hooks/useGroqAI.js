import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function useGroqAI() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const generateDietPlan = async (preferences = {}) => {
    setLoading(true);
    try {
      const res = await fetch('/api/diet/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(preferences)
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Groq AI Error:', err);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const askNutriBot = async (message) => {
    try {
      const res = await fetch('/api/diet/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      if (!res.ok) {
        return `Backend Error: ${data.error || 'Something went wrong'}`;
      }
      return data.reply || 'No response generated.';
    } catch (err) {
      return `Connection Error: ${err.message}`;
    }
  };

  return { generateDietPlan, askNutriBot, loading };
}
