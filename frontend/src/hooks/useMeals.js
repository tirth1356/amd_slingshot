import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export function useMeals() {
  const { token } = useAuth();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMeals = useCallback(async (dateString) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/meals?date=${dateString}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMeals(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addMeal = async (mealData) => {
    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(mealData)
      });
      const data = await res.json();
      if (res.ok) {
        setMeals(prev => [...prev, data]);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteMeal = async (id) => {
    try {
      const res = await fetch(`/api/meals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMeals(prev => prev.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { meals, loading, fetchMeals, addMeal, deleteMeal };
}
