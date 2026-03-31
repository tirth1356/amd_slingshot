import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2,
  Info,
  Activity,
  Target,
  Heart,
  Droplets,
  Coins,
  User,
  AlertCircle,
  Leaf,
  Beef,
  Fish,
  Egg,
  TrendingDown,
  Dumbbell,
  Scale,
  HeartPulse,
  Zap,
  Armchair,
  Footprints,
  Flame,
  Stethoscope,
  UtensilsCrossed
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useGroqAI } from '../hooks/useGroqAI';
import AnimatedBackground from '../components/AnimatedBackground';
import LoadingSpinner from '../components/LoadingSpinner';

const STEPS = [
  { id: 'diet_type', title: "Diet Type", icon: Heart },
  { id: 'basic_info', title: "Basic Info", icon: User },
  { id: 'body_metrics', title: "Body Metrics", icon: Activity },
  { id: 'health_goal', title: "Health Goal", icon: Target },
  { id: 'activity_level', title: "Activity Level", icon: Activity },
  { id: 'meals_per_day', title: "Meals Per Day", icon: User },
  { id: 'budget', title: "Budget", icon: Coins },
  { id: 'allergies', title: "Allergies", icon: AlertCircle },
  { id: 'medical', title: "Medical", icon: Activity },
  { id: 'cuisine', title: "Cuisine", icon: User },
];

const DIET_OPTIONS = [
  { value: 'vegetarian',  icon: Leaf, label: 'Vegetarian',    desc: 'No meat or fish' },
  { value: 'vegan',       icon: Leaf, label: 'Vegan',         desc: 'No animal products' },
  { value: 'non_veg',     icon: Beef, label: 'Non-Vegetarian',desc: 'All foods allowed' },
  { value: 'pescatarian', icon: Fish, label: 'Pescatarian',   desc: 'Veg + seafood' },
  { value: 'eggetarian',  icon: Egg,  label: 'Eggetarian',    desc: 'Veg + eggs' },
];

const GOAL_OPTIONS = [
  { value: 'lose_weight',    icon: TrendingDown, label: 'Lose Weight',     desc: 'Caloric deficit' },
  { value: 'gain_muscle',    icon: Dumbbell,     label: 'Build Muscle',    desc: 'High protein' },
  { value: 'maintain',       icon: Scale,        label: 'Maintain Weight', desc: 'Balanced plan' },
  { value: 'improve_health', icon: HeartPulse,   label: 'Improve Health',  desc: 'Nutrient-dense' },
  { value: 'boost_energy',   icon: Zap,          label: 'Boost Energy',    desc: 'Sustained energy' },
];

const ACTIVITY_OPTIONS = [
  { value: 'sedentary',        icon: Armchair,   label: 'Sedentary', desc: 'Little to no exercise' },
  { value: 'light',            icon: Footprints, label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
  { value: 'moderate',         icon: Activity,   label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
  { value: 'very_active',      icon: Flame,      label: 'Very Active', desc: 'Heavy exercise 6-7 days/week' },
  { value: 'extremely_active', icon: Zap,        label: 'Extremely Active', desc: 'Very heavy exercise/physical job' },
];

const ALLERGY_OPTIONS = ['Peanuts', 'Gluten', 'Dairy', 'Eggs', 'Shellfish', 'Soy', 'None'];
const MEDICAL_OPTIONS = ['Diabetes', 'Hypertension', 'PCOS', 'None'];
const CUISINE_OPTIONS = ['North Indian', 'South Indian', 'Italian', 'Mexican', 'Asian', 'Mediterranean'];

export default function Onboarding() {
  const { token } = useAuth();
  const { updateProfile } = useProfile();
  const { generateDietPlan } = useGroqAI();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [isFinishing, setIsFinishing] = useState(false);
  const [answers, setAnswers] = useState({
    diet_type: '',
    name: '',
    age: '',
    gender: '',
    weight_kg: '',
    height_cm: '',
    health_goal: '',
    activity_level: '',
    meals_per_day: 3,
    budget_type: 'daily',
    budget_inr: 500,
    allergies: [],
    medical_conditions: [],
    cuisine_preferences: []
  });

  const next = () => setStep(s => Math.min(s + 1, 10));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const handleFinish = async () => {
    setIsFinishing(true);
    try {
      await updateProfile({ ...answers, onboarding_complete: true });
      await generateDietPlan();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setIsFinishing(false);
    }
  };

  if (isFinishing) {
    return (
      <div className="min-h-screen bg-[#05050f] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <AnimatedBackground />
        <LoadingSpinner size="lg" message="Architecting your biological plan..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-[#05050f]">
      <AnimatedBackground />
      
      {/* Progress */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-white/5 z-50">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(step/10)*100}%` }}
          className="h-full bg-accent"
        />
      </div>

      <motion.div 
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass w-full max-w-4xl p-10 min-h-[550px] flex flex-col"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-8 opacity-60">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold">
              {step}
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest leading-none">Step {step} of 10</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-syne font-bold mb-4 leading-tight tracking-tight">
            {step === 1 && "What's your diet type?"}
            {step === 2 && "Let's get the basics"}
            {step === 3 && "Tell us your metrics"}
            {step === 4 && "What is your primary goal?"}
            {step === 5 && "How active are you?"}
            {step === 6 && "How many meals a day?"}
            {step === 7 && "What's your daily budget?"}
            {step === 8 && "Any food allergies?"}
            {step === 9 && "Medical conditions?"}
            {step === 10 && "Favorite cuisines?"}
          </h2>

          <div className="py-8">
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DIET_OPTIONS.map(opt => (
                  <button 
                    key={opt.value}
                    onClick={() => { setAnswers({...answers, diet_type: opt.value}); next(); }}
                    className={`p-6 border rounded-2xl text-left transition-all group ${answers.diet_type === opt.value ? 'bg-accent/10 border-accent shadow-xl shadow-accent/5' : 'bg-white/3 border-white/5 hover:border-white/20'}`}
                  >
                    <div className="flex items-center justify-between">
                      <opt.icon className="w-10 h-10 mb-3 text-text-2 group-hover:text-white transition-colors" />
                      {answers.diet_type === opt.value && <CheckCircle2 className="text-accent" />}
                    </div>
                    <h4 className="text-lg font-bold">{opt.label}</h4>
                    <p className="text-sm text-text-3">{opt.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 max-w-lg">
                <div>
                  <label className="text-xs font-bold text-text-3 uppercase tracking-widest pl-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name"
                    className="mt-2"
                    value={answers.name}
                    onChange={(e) => setAnswers({...answers, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-text-3 uppercase tracking-widest pl-1">Age</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 28"
                      className="mt-2"
                      value={answers.age}
                      onChange={(e) => setAnswers({...answers, age: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-3 uppercase tracking-widest pl-1">Gender</label>
                    <select 
                      className="mt-2"
                      value={answers.gender}
                      onChange={(e) => setAnswers({...answers, gender: e.target.value})}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 max-w-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-text-3 uppercase tracking-widest pl-1">Weight (kg)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 75"
                      className="mt-2"
                      value={answers.weight_kg}
                      onChange={(e) => setAnswers({...answers, weight_kg: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-3 uppercase tracking-widest pl-1">Height (cm)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 178"
                      className="mt-2"
                      value={answers.height_cm}
                      onChange={(e) => setAnswers({...answers, height_cm: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GOAL_OPTIONS.map(opt => (
                  <button 
                    key={opt.value}
                    onClick={() => { setAnswers({...answers, health_goal: opt.value}); next(); }}
                    className={`p-6 border rounded-2xl text-left transition-all group ${answers.health_goal === opt.value ? 'bg-accent/10 border-accent' : 'bg-white/3 border-white/5 hover:border-white/20'}`}
                  >
                    <div className="flex items-center justify-between">
                      <opt.icon className="w-10 h-10 mb-3 text-text-2 group-hover:text-white transition-colors" />
                      {answers.health_goal === opt.value && <CheckCircle2 className="text-accent" />}
                    </div>
                    <h4 className="text-lg font-bold">{opt.label}</h4>
                    <p className="text-sm text-text-3">{opt.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {step === 5 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ACTIVITY_OPTIONS.map(opt => (
                  <button 
                    key={opt.value}
                    onClick={() => { setAnswers({...answers, activity_level: opt.value}); next(); }}
                    className={`p-6 border rounded-2xl text-left transition-all group ${answers.activity_level === opt.value ? 'bg-accent/10 border-accent' : 'bg-white/3 border-white/5 hover:border-white/20'}`}
                  >
                    <div className="flex items-center justify-between">
                      <opt.icon className="w-10 h-10 mb-3 text-text-2 group-hover:text-white transition-colors" />
                      {answers.activity_level === opt.value && <CheckCircle2 className="text-accent" />}
                    </div>
                    <h4 className="text-lg font-bold">{opt.label}</h4>
                    <p className="text-sm text-text-3">{opt.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {step === 6 && (
              <div className="space-y-6 max-w-lg">
                <label className="text-xs font-bold text-text-3 uppercase tracking-widest pl-1">How many meals per day?</label>
                <div className="flex gap-4 mt-4">
                  {[2,3,4,5,6].map(num => (
                    <button 
                      key={num}
                      onClick={() => setAnswers({...answers, meals_per_day: num})}
                      className={`flex-1 py-4 border rounded-xl font-bold transition-all ${answers. meals_per_day === num ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' : 'bg-white/3 border-white/5 hover:border-white/20 hover:bg-white/10'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-6 max-w-lg">
                <label className="text-xs font-bold text-text-3 uppercase tracking-widest pl-1">Daily Food Budget (INR)</label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3 font-bold px-1">₹</span>
                  <input 
                    type="number" 
                    className="pl-12"
                    placeholder="500"
                    value={answers.budget_inr}
                    onChange={(e) => setAnswers({...answers, budget_inr: e.target.value})}
                  />
                </div>
                <p className="text-sm text-text-3">This helps the AI recommend ingredients and meals you can reasonably afford daily.</p>
              </div>
            )}

            {step === 8 && (
              <div className="space-y-4 max-w-lg">
                <p className="text-sm text-text-2 mb-4">Select any ingredients you are allergic to to ensure AI safely omits them.</p>
                <div className="flex flex-wrap gap-3">
                  {ALLERGY_OPTIONS.map(allergy => {
                    const isSelected = answers.allergies.includes(allergy);
                    return (
                      <button 
                        key={allergy}
                        onClick={() => {
                          if (allergy === 'None') { setAnswers({...answers, allergies: []}); return; }
                          let newAllergies = isSelected 
                            ? answers.allergies.filter(a => a !== allergy) 
                            : [...answers.allergies, allergy];
                          setAnswers({...answers, allergies: newAllergies});
                        }}
                        className={`px-5 py-3 rounded-full border transition-all text-sm font-bold ${isSelected ? 'bg-danger/20 border-danger/50 text-danger' : 'border-white/10 bg-white/5 text-text-2 hover:bg-white/10'}`}
                      >
                        {allergy}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {step === 9 && (
              <div className="space-y-4 max-w-lg">
                <p className="text-sm text-text-2 mb-4">Select any medical conditions. We'll tune your macros optimally.</p>
                <div className="flex flex-wrap gap-3">
                  {MEDICAL_OPTIONS.map(med => {
                    const isSelected = answers.medical_conditions.includes(med);
                    return (
                      <button 
                        key={med}
                        onClick={() => {
                          if (med === 'None') { setAnswers({...answers, medical_conditions: []}); return; }
                          let newMeds = isSelected 
                            ? answers.medical_conditions.filter(a => a !== med) 
                            : [...answers.medical_conditions, med];
                          setAnswers({...answers, medical_conditions: newMeds});
                        }}
                        className={`px-5 py-3 rounded-full border transition-all text-sm font-bold ${isSelected ? 'bg-warning/20 border-warning/50 text-warning' : 'border-white/10 bg-white/5 text-text-2 hover:bg-white/10'}`}
                      >
                        {med}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {step === 10 && (
              <div className="space-y-4 max-w-lg">
                <p className="text-sm text-text-2 mb-4">What kind of food do you actually enjoy eating? (Select up to 3)</p>
                <div className="flex flex-wrap gap-3">
                  {CUISINE_OPTIONS.map(cuisine => {
                    const isSelected = answers.cuisine_preferences.includes(cuisine);
                    return (
                      <button 
                        key={cuisine}
                        onClick={() => {
                          let newCuisines = isSelected 
                            ? answers.cuisine_preferences.filter(a => a !== cuisine) 
                            : [...answers.cuisine_preferences, cuisine];
                          if (newCuisines.length <= 3) setAnswers({...answers, cuisine_preferences: newCuisines});
                        }}
                        className={`px-5 py-3 rounded-full border transition-all text-sm font-bold ${isSelected ? 'bg-accent/20 border-accent/50 text-accent' : 'border-white/10 bg-white/5 text-text-2 hover:bg-white/10'}`}
                      >
                        {cuisine}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-8 border-t border-white/5">
          <button 
            onClick={prev}
            disabled={step === 1}
            className="btn-ghost disabled:opacity-0"
          >
            <ChevronLeft /> Back
          </button>
          
          {step < 10 ? (
            <button 
              onClick={next}
              className="btn-accent"
            >
              Continue <ChevronRight />
            </button>
          ) : (
            <button 
              onClick={handleFinish}
              className="btn-accent text-lg px-8"
            >
              🚀 Generate My Prism
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
