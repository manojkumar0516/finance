import { Search, Bell, Moon, Sun, User } from 'lucide-react';
import { useState } from 'react';

export function Navbar({ collapsed }) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="sticky top-0 z-30 glass-card border-b rounded-none px-4 lg:px-6 py-3 flex items-center justify-between w-full">
      
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            className="block w-full p-2 pl-10 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-full focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700/50 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white transition-all shadow-inner" 
            placeholder="Search customers, loans, receipts..." 
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 ml-4">
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>
          </button>
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700 ml-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 overflow-hidden shadow-sm">
            <User size={18} />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">Admin User</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Super Admin</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
