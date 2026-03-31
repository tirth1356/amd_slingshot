import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Sparkles } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 text-center">
      <AnimatedBackground />
      
      {/* Navbar Shimmer */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Zap className="text-white w-5 h-5 fill-current" />
          </div>
          <span className="font-syne font-bold text-xl tracking-tight">NutriSmart</span>
        </div>
        <button 
          onClick={() => navigate('/auth')}
          className="btn-ghost py-2 px-6"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass bg-accent/10 border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-4">
          <Sparkles className="w-3 h-3" /> The Future of Bio-Nutrition
        </div>
        
        <h1 className="text-6xl md:text-8xl font-syne font-extrabold leading-[1.1] tracking-tighter">
          Eat <span className="text-accent">Smart.</span><br />
          Live Better.
        </h1>
        
        <p className="text-text-2 text-xl md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed">
          Precision nutrition powered by biological insights. Transform your body with AI-generated diet protocols tailored to your unique metabolism.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-6">
          <button 
            onClick={() => navigate('/auth')}
            className="btn-accent text-lg px-10 py-4"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </button>
          <button className="btn-ghost text-lg px-10 py-4">
            See How It Works
          </button>
        </div>
      </motion.div>

      {/* Floating Features */}
      <div className="absolute bottom-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full px-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
        <div className="flex items-center gap-4 p-4 glass bg-white/3 border-white/5">
          <Shield className="text-accent" />
          <div className="text-left">
            <h4 className="font-bold text-sm">Secure Data</h4>
            <p className="text-xs text-text-3">End-to-end encrypted profile</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 glass bg-white/3 border-white/5">
          <Zap className="text-accent-violet" />
          <div className="text-left">
            <h4 className="font-bold text-sm">Groq AI Engine</h4>
            <p className="text-xs text-text-3">LLaMA 3.1 precision planning</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 glass bg-white/3 border-white/5 text-left">
          <div className="text-accent font-bold text-xl">₹</div>
          <div className="text-left">
            <h4 className="font-bold text-sm">Budget Aware</h4>
            <p className="text-xs text-text-3">Indian cuisine cost tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
}
