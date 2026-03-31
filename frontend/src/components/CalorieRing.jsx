import React from 'react';
import { motion } from 'framer-motion';

export default function CalorieRing({ consumed, target, size = 200 }) {
  const percentage = Math.min(100, Math.round((consumed / target) * 100)) || 0;
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage < 85) return 'var(--accent)';
    if (percentage < 105) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="12"
          fill="transparent"
        />
        {/* Progress Value */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold font-syne">{consumed}</span>
        <div className="w-12 h-px bg-white/10 my-1" />
        <span className="text-text-3 text-xs uppercase tracking-widest">{target} kcal</span>
      </div>
    </div>
  );
}
