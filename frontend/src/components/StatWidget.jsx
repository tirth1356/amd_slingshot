import React from 'react';
import GlassCard from './GlassCard';

export default function StatWidget({ icon: Icon, label, value, subValue, trend, colorClass = "bg-accent/10 text-accent" }) {
  return (
    <GlassCard className="flex items-center gap-4 py-5 hover:bg-white/8 transition-colors">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-text-3 text-[10px] font-bold uppercase tracking-widest leading-none mb-1.5">{label}</h4>
        <p className="text-xl font-bold font-syne text-text-1 leading-tight">{value}</p>
        <div className="flex items-center gap-1.5 mt-1">
          {trend && (
            <span className={`text-[10px] font-bold ${trend > 0 ? 'text-accent' : 'text-danger'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
          <span className="text-text-3 text-[10px] font-medium leading-none">{subValue}</span>
        </div>
      </div>
    </GlassCard>
  );
}
