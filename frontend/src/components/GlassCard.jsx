import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function GlassCard({ children, className, onClick, hoverable = true }) {
  return (
    <div 
      onClick={onClick}
      className={twMerge(
        "glass p-6",
        hoverable && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
