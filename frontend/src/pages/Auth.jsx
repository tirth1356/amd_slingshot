import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import AnimatedBackground from '../components/AnimatedBackground';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { name: formData.name } }
        });
        if (error) throw error;
        setToast({ type: 'success', message: 'Account created! Please sign in.' });
        setIsLogin(true);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6">
      <AnimatedBackground />
      
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <div className="w-32 h-32 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🧩</span>
          </div>
          <h2 className="text-3xl font-syne font-bold leading-tight">
            {isLogin ? 'Access Dashboard' : 'Create Account'}
          </h2>
          <p className="text-text-2 text-sm mt-2">
            {isLogin ? 'Welcome back to your biological prism' : 'Start your precision nutrition journey today'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <label className="text-xs font-bold text-text-3 uppercase tracking-widest pl-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  required 
                  className="mt-1.5"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="text-xs font-bold text-text-3 uppercase tracking-widest pl-1">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              required 
              className="mt-1.5"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <div className="flex justify-between items-center pl-1">
              <label className="text-xs font-bold text-text-3 uppercase tracking-widest">Password</label>
              {isLogin && <button type="button" className="text-[10px] text-accent hover:underline">Forgot password?</button>}
            </div>
            <input 
              type="password" 
              placeholder="••••••••"
              required 
              className="mt-1.5"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-accent w-full py-4 mt-4 shadow-xl shadow-accent/20"
          >
            {loading ? <LoadingSpinner size="sm" /> : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-text-2 hover:text-accent font-medium transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
          <button className="btn-ghost w-full py-3 flex items-center justify-center gap-3">
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4 rounded-full" alt="Google" />
            Continue with Google
          </button>
        </div>
      </motion.div>
    </div>
  );
}
