import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Lightbulb, 
  Quote, 
  ChevronUp, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useGroqAI } from '../hooks/useGroqAI';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Insights() {
  const { token } = useAuth();
  const { profile } = useProfile();
  const { getWeeklyInsights } = useGroqAI();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/insights/weekly', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const insightData = await res.json();
      setData(insightData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#05050f] flex items-center justify-center pl-64">
      <LoadingSpinner size="lg" message="Synthesizing weekly metabolic performance..." />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05050f] text-text-1 flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-10 max-w-7xl mx-auto space-y-12 overflow-y-auto h-screen custom-scrollbar">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl font-syne font-bold tracking-tight mb-2">Weekly Bio-Synthesis</h1>
            <p className="text-text-3 font-medium uppercase tracking-widest text-xs flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-accent" /> Data Analysis: Last 7 Days
            </p>
          </div>
          <button 
            onClick={fetchInsights}
            className="btn-accent flex items-center gap-2 px-8"
          >
            Refresh AI Analysis
          </button>
        </header>

        {/* Global Wellness Score */}
        <div className="flex justify-center">
           <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90">
                 <circle cx="128" cy="128" r="110" stroke="rgba(255,255,255,0.05)" strokeWidth="16" fill="transparent" />
                 <motion.circle 
                  initial={{ strokeDashoffset: 690 }}
                  animate={{ strokeDashoffset: 690 - (690 * (data?.wellness_score || 0) / 100) }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  cx="128" cy="128" r="110" stroke={data?.wellness_score > 70 ? 'var(--accent)' : 'var(--warning)'} strokeWidth="16" fill="transparent" strokeDasharray="690" strokeLinecap="round" 
                 />
              </svg>
              <div className="text-center">
                 <motion.h2 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-6xl font-syne font-extrabold"
                 >
                   {data?.wellness_score || 0}%
                 </motion.h2>
                 <p className="text-[10px] uppercase font-black tracking-[0.3em] text-text-3 mt-1">Wellness Index</p>
              </div>
           </div>
        </div>

        {/* Core Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <GlassCard className="bg-accent/5 border-accent/20">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent mb-6">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="font-syne font-bold text-xl mb-4">Metabolic Wins</h3>
              <ul className="space-y-4">
                {(data?.well_done || ["Consistent protein intake", "Good hydration levels", "Adherence to calorie surplus"]).map((win, i) => (
                  <li key={i} className="flex gap-3 text-sm text-text-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                    {win}
                  </li>
                ))}
              </ul>
           </GlassCard>

           <GlassCard className="bg-warning/5 border-warning/20">
              <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center text-warning mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-syne font-bold text-xl mb-4">Friction Zones</h3>
              <ul className="space-y-4">
                {(data?.improvements || ["High sodium intake on weekend", "Missed evening snacks twice", "Low fiber coverage"]).map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-text-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
           </GlassCard>

           <GlassCard className="bg-accent-violet/5 border-accent-violet/20">
              <div className="w-10 h-10 rounded-xl bg-accent-violet/20 flex items-center justify-center text-accent-violet mb-6">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="font-syne font-bold text-xl mb-4">Strategic Shifts</h3>
              <ul className="space-y-4">
                {(data?.recommendations || ["Increase leafy greens by 20%", "Prioritize early lunch", "Swap evening tea for protein"]).map((rec, i) => (
                  <li key={i} className="flex gap-3 text-sm text-text-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-violet mt-2 shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
           </GlassCard>
        </div>

        {/* Nutrient Coverage */}
        <GlassCard className="bg-white/2 border-white/5 p-10">
           <h3 className="font-syne font-bold text-3xl mb-8 tracking-tight">RDA Coverage Protocol</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
              {Object.entries(data?.nutrient_gaps || { "Protein": 85, "Fiber": 60, "Iron": 45, "Calcium": 90, "Vitamin C": 75 }).map(([label, pct]) => (
                <div key={label} className="space-y-2">
                   <div className="flex justify-between items-center px-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-text-3">{label}</span>
                      <span className={`text-xs font-black ${pct > 80 ? 'text-accent' : pct > 50 ? 'text-warning' : 'text-danger'}`}>{pct}%</span>
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full ${pct > 80 ? 'bg-accent' : pct > 50 ? 'bg-warning' : 'bg-danger'}`} 
                      />
                   </div>
                </div>
              ))}
           </div>
        </GlassCard>

        {/* Motivational Card */}
        <GlassCard className="p-16 relative overflow-hidden bg-white/1 flex flex-col items-center justify-center text-center">
            <Quote className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 text-accent/5" />
            <p className="text-3xl font-syne font-bold max-w-3xl leading-snug italic relative z-10">
              "{data?.motivational_tip || "Your biological evolution is not a race, it is a persistent recalibration of systems."}"
            </p>
            <div className="w-20 h-1 bg-accent rounded-full mt-10" />
        </GlassCard>

      </main>
    </div>
  );
}
