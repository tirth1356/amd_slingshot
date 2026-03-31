import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Flame, 
  TrendingUp, 
  IndianRupee, 
  Calendar,
  MessageSquare,
  Send,
  CheckCircle2
} from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useMeals } from '../hooks/useMeals';
import { useGroqAI } from '../hooks/useGroqAI';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CalorieRing from '../components/CalorieRing';
import MacroBar from '../components/MacroBar';
import MealCard from '../components/MealCard';
import StatWidget from '../components/StatWidget';
import GlassCard from '../components/GlassCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const { profile, loading: profileLoading } = useProfile();
  const { meals, fetchMeals, loading: mealsLoading } = useMeals();
  const { askNutriBot } = useGroqAI();
  
  const [activeTab, setActiveTab] = useState('today');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profileLoading && profile && !profile.onboarding_complete) {
      navigate('/onboarding');
      return;
    }
    fetchMeals(new Date().toISOString().split('T')[0]);
  }, [fetchMeals, profile, profileLoading, navigate]);

  const consumedCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const targetCalories = profile?.daily_calorie_target || 2000;
  
  const consumedMacros = meals.reduce((acc, m) => {
    acc.p += m.protein_g || 0;
    acc.c += m.carbs_g || 0;
    acc.f += m.fat_g || 0;
    return acc;
  }, { p: 0, c: 0, f: 0 });

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    const reply = await askNutriBot(chatInput);
    setChatMessages(prev => [...prev, { role: 'bot', content: reply }]);
    setIsTyping(false);
  };

  if (profileLoading) return (
    <div className="min-h-screen bg-[#05050f] flex items-center justify-center">
      <LoadingSpinner size="lg" message="Synchronizing biological data..." />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05050f] text-text-1 font-dm-sans overflow-hidden flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen custom-scrollbar">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-syne font-bold tracking-tight">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {profile?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-text-3 font-medium mt-1 uppercase tracking-widest text-xs flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" /> {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          
          <div className="flex gap-2 p-1 glass bg-white/5 rounded-2xl">
            {['today', 'this_week', 'ai_chat'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-2 hover:bg-white/5'}`}
              >
                {tab === 'today' ? 'Today' : tab === 'this_week' ? 'Weekly' : 'AI Chat'}
              </button>
            ))}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'today' && (
            <motion.div 
              key="today"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-12 gap-6"
            >
              {/* Left Column - Core Stats */}
              <div className="col-span-12 lg:col-span-5 space-y-6">
                <GlassCard className="flex flex-col items-center py-10 relative overflow-hidden bg-white/3 border-white/5">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <TrendingUp className="w-24 h-24 text-accent" />
                  </div>
                  <h3 className="text-text-3 text-xs font-bold uppercase tracking-widest mb-8">Daily Calorie Goal</h3>
                  <CalorieRing consumed={consumedCalories} target={targetCalories} />
                  
                  <div className="grid grid-cols-3 gap-8 w-full mt-10 px-4">
                    <MacroBar label="Protein" current={consumedMacros.p} target={profile?.protein_target_g || 150} colorClass="bg-accent" />
                    <MacroBar label="Carbs" current={consumedMacros.c} target={profile?.carbs_target_g || 250} colorClass="bg-warning" />
                    <MacroBar label="Fat" current={consumedMacros.f} target={profile?.fat_target_g || 70} colorClass="bg-accent-violet" />
                  </div>
                </GlassCard>

                <div className="grid grid-cols-2 gap-6">
                  <StatWidget icon={Flame} label="Daily Streak" value="3 Days" subValue="You're on fire, Alex!" colorClass="bg-danger/20 text-danger" trend={5} />
                  <StatWidget icon={IndianRupee} label="Budget Left" value={`₹${(profile?.budget_inr || 500) - meals.reduce((s, m) => s + (m.cost_inr || 0), 0)}`} subValue="On track with budget" trend={-2} />
                </div>

                <GlassCard className="bg-accent/5 border-accent/20">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2 className="text-accent" />
                    <h4 className="font-syne font-bold">Smart Insight</h4>
                  </div>
                  <p className="text-sm text-text-2 leading-relaxed">
                    You tend to consume more sugar on Thursday afternoons. We've added a fiber-rich snack to your plan for today.
                  </p>
                  <button className="text-accent text-xs font-bold uppercase tracking-widest mt-4 hover:underline">View recommendations →</button>
                </GlassCard>
              </div>

              {/* Right Column - Meal Plan */}
              <div className="col-span-12 lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-syne text-2xl font-bold tracking-tight">Today's Meal Plan</h3>
                  <button className="text-accent text-[10px] uppercase font-bold tracking-widest hover:underline">Edit Plan</button>
                </div>

                <div className="space-y-4">
                  {mealsLoading ? <LoadingSpinner size="md" /> : (
                    meals.length > 0 ? meals.map(meal => (
                      <MealCard key={meal.id} meal={meal} isLogged={true} />
                    )) : (
                      <div className="py-20 text-center glass border-dashed">
                        <p className="text-text-3 font-medium">No meals logged for today.</p>
                        <button onClick={() => window.location.href='/meal-log'} className="btn-accent px-6 mt-4"><Plus className="w-4 h-4" /> Log First Meal</button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'ai_chat' && (
            <motion.div 
              key="ai_chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col h-[75vh]"
            >
              <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden bg-white/3 border-white/5">
                <div className="p-4 border-b border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs">🤖</div>
                  <div>
                    <h3 className="text-sm font-bold">NutriSmart AI</h3>
                    <p className="text-[10px] text-accent font-bold uppercase tracking-widest">Always active</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-20">
                      <p className="text-text-3 text-sm mb-6">Start a conversation with your personal AI nutritionist.</p>
                      <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                        {["Is idli good for weight loss?", "Protein snack under ₹50", "Dosa recipe modifications"].map(q => (
                          <button key={q} onClick={() => {setChatInput(q); }} className="text-[11px] font-bold text-text-3 py-2 px-4 rounded-full border border-white/10 hover:border-accent hover:text-accent transition-all">
                            "{q}"
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-accent/20 border border-accent/30 text-accent' : 'glass bg-white/5 border-white/10'}`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="glass px-5 py-3 rounded-2xl">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-150" />
                          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-300" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleChat} className="p-4 border-t border-white/5 bg-white/2 flex gap-4">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about ingredients, nutrition, or recipes..." 
                    className="flex-1 glass bg-white/5"
                  />
                  <button type="submit" className="btn-accent p-3 rounded-xl aspect-square">
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

