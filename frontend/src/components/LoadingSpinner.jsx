import React from 'react';

export default function LoadingSpinner({ size = "md", message }) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-4"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 min-p-8">
      <div 
        className={`${sizeClasses[size]} border-white/10 border-t-accent rounded-full animate-spin`}
      />
      {message && <p className="text-text-2 text-sm font-medium animate-pulse">{message}</p>}
    </div>
  );
}
