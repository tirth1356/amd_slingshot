import React, { useState } from 'react';
import { 
  User, 
  Activity, 
  Settings as SettingsIcon, 
  Heart, 
  Target, 
  ShieldAlert, 
  Save,
  Check
} from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

export default function Settings() {
  const { profile, updateProfile, loading } = useProfile();
  const [formData, setFormData] = useState(null);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  // Sync profile to local form state once loaded
  React.useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateProfile(formData);
    setSaving(false);
    if (res.success) {
      setToast({ type: 'success', message: 'Parameters updated globally' });
    } else {
      setToast({ type: 'error', message: res.error });
    }
  };

  if (loading || !formData) return (
    <div className="min-h-screen bg-[#05050f] flex items-center justify-center pl-64">
      <LoadingSpinner message="Calibrating interface settings..." />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05050f] text-text-1 flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-10 max-w-4xl mx-auto space-y-10 overflow-y-auto h-screen custom-scrollbar pb-32">
        
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}

        <header>
          <h1 className="text-5xl font-syne font-bold tracking-tight mb-2">Biological Config</h1>
          <p className="text-text-3 font-medium uppercase tracking-widest text-[10px]">Modify your prism settings and targets</p>
        </header>

        <form onSubmit={handleSave} className="space-y-12">
          
          {/* Section: Profile Identity */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <User className="text-accent" />
              <h3 className="font-syne font-bold text-xl uppercase tracking-tighter">Identity Basics</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-3 pl-1">Full Name</label>
                <input 
                  value={formData.name || ''} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="bg-white/2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-3 pl-1">Age</label>
                    <input 
                      type="number"
                      value={formData.age || ''} 
                      onChange={e => setFormData({...formData, age: e.target.value})}
                      className="bg-white/2"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-3 pl-1">Gender</label>
                    <select 
                      value={formData.gender || ''} 
                      onChange={e => setFormData({...formData, gender: e.target.value})}
                      className="bg-white/2"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                 </div>
              </div>
            </div>
          </section>

          {/* Section: Body Markers */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Activity className="text-accent-violet" />
              <h3 className="font-syne font-bold text-xl uppercase tracking-tighter">Metabolic Markers</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-3 pl-1">Weight (kg)</label>
                  <input 
                    type="number"
                    value={formData.weight_kg || ''} 
                    onChange={e => setFormData({...formData, weight_kg: e.target.value})}
                    className="bg-white/2 font-bold text-accent-violet"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-3 pl-1">Height (cm)</label>
                  <input 
                    type="number"
                    value={formData.height_cm || ''} 
                    onChange={e => setFormData({...formData, height_cm: e.target.value})}
                    className="bg-white/2 font-bold text-accent-violet"
                  />
               </div>
            </div>
            <div className="p-6 glass bg-accent-violet/5 border-accent-violet/10 flex items-center justify-between">
               <div className="text-sm font-bold text-text-2">Current Body Mass Index (BMI)</div>
               <div className="text-2xl font-black font-syne text-accent-violet">{formData.bmi || '0.0'}</div>
            </div>
          </section>

          {/* Section: Diet Logic */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Heart className="text-danger" />
              <h3 className="font-syne font-bold text-xl uppercase tracking-tighter">Dietary Logic</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-3 pl-1">Protocols</label>
                  <select 
                    value={formData.diet_type || ''} 
                    onChange={e => setFormData({...formData, diet_type: e.target.value})}
                    className="bg-white/2"
                  >
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="non_veg">Non-Vegetarian</option>
                    <option value="pescatarian">Pescatarian</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-3 pl-1">Health Goal</label>
                  <select 
                    value={formData.health_goal || ''} 
                    onChange={e => setFormData({...formData, health_goal: e.target.value})}
                    className="bg-white/2"
                  >
                    <option value="lose_weight">Lose Weight</option>
                    <option value="gain_muscle">Gain Muscle</option>
                    <option value="maintain">Maintain Equilibrium</option>
                  </select>
               </div>
            </div>
          </section>

          {/* Sticky Save Bar */}
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 z-50">
             <button 
              type="submit"
              disabled={saving}
              className="btn-accent w-full py-5 text-lg shadow-2xl flex items-center justify-center gap-4 bg-gradient-to-r from-accent to-[#059669]"
             >
               {saving ? <LoadingSpinner size="sm" /> : <><Save className="w-6 h-6" /> Deploy Bio-Updates</>}
             </button>
          </div>

        </form>
      </main>
    </div>
  );
}
