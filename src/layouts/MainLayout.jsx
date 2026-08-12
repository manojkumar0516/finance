import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div className={`transition-all duration-300 ease-in-out ${collapsed ? 'ml-20' : 'ml-64'}`}>
        <Navbar collapsed={collapsed} />
        
        <main className="p-4 md:p-6 min-h-screen">
          {/* Framer motion can be wrapped around Outlet if needed for page transitions */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
