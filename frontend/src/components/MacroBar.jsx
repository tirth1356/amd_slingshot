import React from 'react';
import { motion } from 'framer-motion';

export default function MacroBar({ label, current, target, colorClass }) {
  const percentage = Math.min(100, Math.round((current / target) * 100)) || 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-text-2">{label}</span>
        <span className="text-text-1">{current}g / {target}g</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-full rounded-full ${colorClass}`}
        />
      </div>
    </div>
  );
}
