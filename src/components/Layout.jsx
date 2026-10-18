import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Users, MapPin, Ticket, Bell, Search } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Matches', path: '/matches', icon: <CalendarDays size={20} /> },
    { name: 'Teams', path: '/teams', icon: <Users size={20} /> },
    { name: 'Stadiums', path: '/stadiums', icon: <MapPin size={20} /> },
    { name: 'Bookings', path: '/bookings', icon: <Ticket size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* PREMIUM SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl relative z-20">
        <div className="absolute top-0 left-0 w-full h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
        
        <div className="h-20 flex items-center px-8 border-b border-slate-800/50 relative z-10">
          <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400 flex items-center gap-2">
            <span className="text-3xl">🏏</span> CricBook
          </h1>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 relative z-10">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <div className={`${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-white'} transition-colors`}>
                  {link.icon}
                </div>
                <span className="font-medium">{link.name}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6 relative z-10">
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              A
            </div>
            <div>
              <p className="text-sm font-bold text-white">Admin User</p>
              <p className="text-xs text-slate-400">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* MODERN TOP HEADER */}
        <header className="h-20 bg-white/80 border-b border-slate-200/60 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center bg-slate-100 px-4 py-2.5 rounded-full w-96 border border-slate-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search matches, teams..." 
              className="bg-transparent border-none outline-none ml-3 w-full text-sm text-slate-700 placeholder-slate-400"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative text-slate-500 hover:text-emerald-600 transition-colors">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <p className="text-sm font-semibold text-slate-700 cursor-pointer hover:text-emerald-600 transition-colors">Welcome, Admin</p>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;