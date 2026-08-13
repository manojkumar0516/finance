import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 relative">
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      <div className={`transition-all duration-300 ease-in-out ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <Navbar 
          collapsed={collapsed} 
          setMobileOpen={setMobileOpen} 
          mobileOpen={mobileOpen}
        />
        
        <main className="p-4 md:p-6 min-h-screen max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
