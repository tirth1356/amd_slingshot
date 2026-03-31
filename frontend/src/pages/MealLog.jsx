import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Clock, 
  IndianRupee, 
  ChevronDown,
  Scale,
  Activity,
  Zap
} from 'lucide-react';
import { useMeals } from '../hooks/useMeals';
import { useProfile } from '../hooks/useProfile';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

export default function MealLog() {
  const { profile } = useProfile();
  const { meals, fetchMeals, addMeal, deleteMeal, loading } = useMeals();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [toast, setToast] = useState(null);
  
  const [form, setForm] = useState({
    name: '',
    calories: '',
    protein_g: '',
    carbs_g: '',
    fat_g: '',
    meal_type: 'lunch',
    cost_inr: ''
  });

  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchMeals(selectedDate);
  }, [selectedDate, fetchMeals]);

  const handleSearch = async (query) => {
    if (!query || query.length < 3) return setSearchResults([]);
    setSearching(true);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&json=1&page_size=6`);
      const data = await res.json();
      setSearchResults(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const selectProduct = (p) => {
    setForm({
      ...form,
      name: p.product_name || '',
      calories: Math.round(p.nutriments?.['energy-kcal_100g'] || 0),
      protein_g: p.nutriments?.proteins_100g || 0,
      carbs_g: p.nutriments?.carbohydrates_100g || 0,
      fat_g: p.nutriments?.fat_100g || 0
    });
    setSearchResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await addMeal({ ...form, eaten_at: new Date().toISOString() });
    if (res.success) {
      setToast({ type: 'success', message: 'Meal logged successfully' });
      setForm({ name: '', calories: '', protein_g: '', carbs_g: '', fat_g: '', meal_type: 'lunch', cost_inr: '' });
    } else {
      setToast({ type: 'error', message: res.error });
    }
  };

  return (
    <div className="min-h-screen bg-[#05050f] text-text-1 flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 grid grid-cols-12 gap-8 max-w-7xl mx-auto h-screen overflow-hidden">
        
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}

        {/* Left Column: Logging Form */}
        <section className="col-span-12 lg:col-span-5 space-y-6 overflow-y-auto pr-4 custom-scrollbar">
          <h2 className="text-3xl font-syne font-bold tracking-tight">Log Nutrients</h2>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-text-3" />
            </div>
            <input 
              type="text" 
              placeholder="Search Food Database (OpenFoodFacts)" 
              className="pl-12 !rounded-2xl"
              onChange={(e) => handleSearch(e.target.value)}
            />
            
            {searchResults.length > 0 && (
              <div className="absolute z-20 left-0 right-0 mt-2 glass bg-black/90 p-2 space-y-1 shadow-2xl">
                {searchResults.map((p, i) => (
                  <button 
                    key={i} 
                    onClick={() => selectProduct(p)}
                    className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm font-bold text-text-1">{p.product_name}</p>
                      <p className="text-[10px] text-text-3 uppercase tracking-tighter">{p.brands}</p>
                    </div>
                    <span className="text-xs font-bold text-accent">{Math.round(p.nutriments?.['energy-kcal_100g'] || 0)} kcal</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 glass bg-white/2 border-white/5 p-8">
            <div>
              <label className="text-[10px] font-bold text-text-3 uppercase tracking-widest block mb-2 pl-1">Meal Name</label>
              <input 
                value={form.name}
                required
                onChange={e => setForm({...form, name: e.target.value})}
                placeholder="e.g. Masala Dosa" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-text-3 uppercase tracking-widest block mb-2 pl-1">Calories</label>
                <input 
                  type="number"
                  value={form.calories}
                  required
                  onChange={e => setForm({...form, calories: e.target.value})}
                  placeholder="kcal" 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-3 uppercase tracking-widest block mb-2 pl-1">Meal Type</label>
                <select 
                  value={form.meal_type}
                  onChange={e => setForm({...form, meal_type: e.target.value})}
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="morning_snack">Morning Snack</option>
                  <option value="lunch">Lunch</option>
                  <option value="evening_snack">Evening Snack</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-text-3 uppercase tracking-widest block mb-2 pl-1">Protein (g)</label>
                <input value={form.protein_g} onChange={e => setForm({...form, protein_g: e.target.value})} placeholder="0" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-3 uppercase tracking-widest block mb-2 pl-1">Carbs (g)</label>
                <input value={form.carbs_g} onChange={e => setForm({...form, carbs_g: e.target.value})} placeholder="0" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-3 uppercase tracking-widest block mb-2 pl-1">Fat (g)</label>
                <input value={form.fat_g} onChange={e => setForm({...form, fat_g: e.target.value})} placeholder="0" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-3 uppercase tracking-widest block mb-2 pl-1">Cost (₹)</label>
              <input value={form.cost_inr} onChange={e => setForm({...form, cost_inr: e.target.value})} placeholder="Estimated price" />
            </div>

            <button type="submit" className="btn-accent w-full py-4 mt-4 uppercase tracking-widest text-xs font-black">
              Commit to Log
            </button>
          </form>
        </section>

        {/* Right Column: Today's Log */}
        <section className="col-span-12 lg:col-span-7 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-8 shrink-0">
             <h3 className="font-syne text-2xl font-bold tracking-tight">Today's Consumption</h3>
             <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto py-2 px-4 glass border-white/5 text-sm"
             />
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {loading ? <LoadingSpinner /> : (
              meals.length > 0 ? meals.map(meal => (
                <GlassCard key={meal.id} className="p-4 bg-white/2 hover:bg-white/5 border-white/5 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm tracking-tight">{meal.name}</h4>
                        <div className="flex items-center gap-3 text-[10px] text-text-3 font-bold uppercase tracking-wider mt-1">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(meal.eaten_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className="flex items-center gap-1 text-accent"><IndianRupee className="w-3 h-3" /> ₹{meal.cost_inr || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                       <div className="text-right">
                          <p className="text-xl font-syne font-bold leading-none">{meal.calories}</p>
                          <p className="text-[9px] uppercase tracking-widest text-text-3 font-bold">kcal</p>
                       </div>
                       <button 
                        onClick={() => deleteMeal(meal.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-danger hover:bg-danger/10 rounded-lg transition-all"
                       >
                         <Trash2 className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                </GlassCard>
              )) : (
                <div className="h-full flex flex-col items-center justify-center opacity-40">
                   <Activity className="w-16 h-16 mb-4" />
                   <p className="font-syne font-bold">Chronology is empty.</p>
                   <p className="text-sm">Log your first meal to start tracking.</p>
                </div>
              )
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 shrink-0 grid grid-cols-4 gap-6">
             <div className="text-center">
                <p className="text-[10px] font-bold text-text-3 uppercase tracking-widest mb-1">Total kcal</p>
                <p className="text-xl font-syne font-bold">{meals.reduce((s, m) => s + m.calories, 0)}</p>
             </div>
             <div className="text-center">
                <p className="text-[10px] font-bold text-text-3 uppercase tracking-widest mb-1 text-accent">Protein</p>
                <p className="text-xl font-syne font-bold">{meals.reduce((s, m) => s + (m.protein_g || 0), 0)}g</p>
             </div>
             <div className="text-center">
                <p className="text-[10px] font-bold text-text-3 uppercase tracking-widest mb-1 text-warning">Carbs</p>
                <p className="text-xl font-syne font-bold">{meals.reduce((s, m) => s + (m.carbs_g || 0), 0)}g</p>
             </div>
             <div className="text-center text-accent">
                <p className="text-[10px] font-bold text-text-3 uppercase tracking-widest mb-1">Cost</p>
                <p className="text-xl font-syne font-bold">₹{meals.reduce((s, m) => s + (m.cost_inr || 0), 0)}</p>
             </div>
          </div>
        </section>

      </main>
    </div>
  );
}
