import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  RefreshCcw, 
  Printer, 
  ChevronRight,
  Info,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useGroqAI } from '../hooks/useGroqAI';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DietPlan() {
  const { token } = useAuth();
  const { profile } = useProfile();
  const { generateDietPlan, loading: updating } = useGroqAI();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentPlan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/diet/current', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPlan(data?.plan_data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const handleRegenerate = async () => {
    const data = await generateDietPlan();
    if (data.plan) setPlan(data.plan);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#05050f] flex items-center justify-center pl-64">
      <LoadingSpinner size="lg" message="Decrypting your biological nutrition..." />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05050f] text-text-1 font-dm-sans flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-10 space-y-10 max-w-7xl mx-auto overflow-y-auto h-screen custom-scrollbar">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-5xl font-syne font-bold tracking-tight mb-2">Nutritional Prism</h1>
            <p className="text-text-3 font-medium uppercase tracking-widest text-xs flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-accent" /> Active Plan: {new Date().toLocaleDateString()} — {new Date(Date.now() + 7*86400000).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => window.print()}
              className="btn-ghost flex items-center gap-2 px-6"
            >
              <Printer className="w-4 h-4" /> Print Plan
            </button>
            <button 
              onClick={handleRegenerate}
              disabled={updating}
              className="btn-accent flex items-center gap-2 px-6"
            >
              {updating ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />} 
              Regenerate AI Plan
            </button>
          </div>
        </header>

        {/* Summary Card */}
        <GlassCard className="bg-accent/5 border-accent/20 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent rounded-full blur-[80px] opacity-20" />
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent/20 rounded-xl">
              <Info className="text-accent" />
            </div>
            <div>
              <h3 className="font-syne font-bold text-xl mb-1">Dietitian's Overview</h3>
              <p className="text-text-2 leading-relaxed text-sm">
                {plan?.plan_summary || "Generating your personalized summary based on biological markers and macro-distribution protocols."}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* 7-Day Grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const dayData = plan?.days?.[i];
            return (
              <div key={day} className="space-y-4">
                <div className="text-center">
                  <h4 className="font-syne font-bold text-lg">{day}</h4>
                  <div className="w-8 h-0.5 bg-accent/30 mx-auto rounded-full mt-1" />
                </div>
                
                {dayData?.meals?.map((meal, j) => (
                  <GlassCard key={j} className="p-4 py-6 border-white/5 hover:border-accent/40 bg-white/2 transition-all">
                    <p className="text-[9px] uppercase font-bold tracking-widest text-text-3 mb-1 line-clamp-1">{meal.slot}</p>
                    <h5 className="font-bold text-sm text-text-1 leading-tight mb-2 min-h-[2.5rem]">{meal.name}</h5>
                    <div className="flex justify-between items-center bg-white/5 rounded-lg p-2">
                       <span className="text-[10px] font-bold text-accent">{meal.calories}kcal</span>
                       <span className="text-[10px] font-bold text-accent-violet">₹{meal.cost_inr}</span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            );
          })}
        </div>

        {/* Bottom Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard className="border-danger/20 bg-danger/5">
            <div className="flex items-center gap-3 mb-6">
               <AlertTriangle className="text-danger w-6 h-6" />
               <h3 className="font-syne font-bold text-xl">Metabolic Constraints</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(plan?.foods_to_avoid || ["Sugar", "Refined Carbs", "Excess Sodium"]).map(food => (
                <span key={food} className="px-4 py-2 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-bold uppercase tracking-wider">
                  ⚠️ {food}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="border-accent-violet/20 bg-accent-violet/5">
            <div className="flex items-center gap-3 mb-6">
               <Lightbulb className="text-accent-violet w-6 h-6" />
               <h3 className="font-syne font-bold text-xl">Wellness Protocol</h3>
            </div>
            <ul className="space-y-4">
              {(plan?.tips || ["Drink 3L water daily", "Wait 15m before second servings"]).map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm text-text-2 group">
                  <div className="w-5 h-5 rounded-full bg-accent-violet/20 flex items-center justify-center text-[10px] font-bold text-accent-violet shrink-0 group-hover:scale-110 transition-transform">{i+1}</div>
                  {tip}
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>

      </main>
    </div>
  );
}
