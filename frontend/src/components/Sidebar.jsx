import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { 
  Home, 
  ClipboardList, 
  Utensils, 
  BarChart3, 
  Settings, 
  LogOut,
  User
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/diet-plan', label: 'Diet Plan', icon: ClipboardList },
  { path: '/meal-log',  label: 'Meal Log',  icon: Utensils },
  { path: '/insights',  label: 'Insights', icon: BarChart3 },
  { path: '/settings',  label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass border-y-0 border-l-0 rounded-none z-50 flex flex-col p-6">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
          <Utensils className="text-white w-6 h-6" />
        </div>
        <h1 className="font-syne text-xl font-bold tracking-tight">NutriSmart</h1>
      </div>

      <div className="flex items-center gap-3 mb-10 p-3 glass bg-white/5 border-white/10 rounded-2xl">
        <div className="w-10 h-10 rounded-full bg-accent-violet flex items-center justify-center text-white font-bold">
          {profile?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold truncate">{profile?.name || 'User'}</p>
          <span className="text-[10px] uppercase tracking-wider text-accent font-bold px-2 py-0.5 bg-accent/10 rounded-full">
            {profile?.diet_type?.replace('_', ' ') || 'NutriUser'}
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-accent/10 text-accent border-l-4 border-accent pl-3.5' 
                : 'text-text-2 hover:bg-white/5 hover:text-text-1'}
            `}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 w-full text-text-3 hover:text-danger transition-colors group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
