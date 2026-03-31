import React from 'react';
import { Clock, Banknote, Plus, Check } from 'lucide-react';
import GlassCard from './GlassCard';

export default function MealCard({ meal, onLog, isLogged }) {
  return (
    <GlassCard className="relative overflow-hidden group border-white/5 bg-white/3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded-full">
              {meal.slot || 'Meal'}
            </span>
            {isLogged && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent-violet bg-accent-violet/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" /> Logged
              </span>
            )}
          </div>
          <h3 className="font-syne font-bold text-lg text-text-1">{meal.name}</h3>
          <p className="text-sm text-text-2 line-clamp-1">{meal.description}</p>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-accent">
            {meal.calories} <span className="text-[10px] text-text-3 font-medium uppercase">kcal</span>
          </div>
          <div className="flex items-center gap-3 mt-1 justify-end opacity-60">
            <div className="flex items-center gap-1 text-[11px] font-medium">
              <Clock className="w-3 h-3" /> {meal.time || '15 min'}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium">
              <Banknote className="w-3 h-3" /> ₹{meal.cost_inr || 0}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex gap-3">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-tighter text-text-3 font-bold">Protein</p>
            <p className="text-xs font-semibold">{meal.protein_g}g</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-tighter text-text-3 font-bold">Carbs</p>
            <p className="text-xs font-semibold">{meal.carbs_g}g</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-tighter text-text-3 font-bold">Fat</p>
            <p className="text-xs font-semibold">{meal.fat_g}g</p>
          </div>
        </div>

        {!isLogged && onLog && (
          <button 
            onClick={() => onLog(meal)}
            className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent hover:bg-accent transition-all duration-300 group-hover:scale-110 active:scale-95"
          >
            <Plus className="w-5 h-5 text-accent group-hover:text-white" />
          </button>
        )}
      </div>

      {isLogged && <div className="absolute right-0 top-0 w-1 h-full bg-accent-violet" />}
    </GlassCard>
  );
}
