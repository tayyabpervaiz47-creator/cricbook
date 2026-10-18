import { useState, useEffect } from 'react';
import { getMatches } from '../api/matches';
import { getTeams } from '../api/teams';
import { getStadiums } from '../api/stadiums';
import { getBookings } from '../api/bookings';
import { CalendarDays, Users, MapPin, Ticket, ArrowUpRight, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ matches: 0, teams: 0, stadiums: 0, bookings: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [matchesRes, teamsRes, stadiumsRes, bookingsRes] = await Promise.all([
          getMatches(), getTeams(), getStadiums(), getBookings()
        ]);
        setStats({
          matches: matchesRes.data.length,
          teams: teamsRes.data.length,
          stadiums: stadiumsRes.data.length,
          bookings: bookingsRes.data.length
        });
      } catch (error) { console.error(error); }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Total Matches", count: stats.matches, icon: <CalendarDays size={24} />, color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200" },
    { title: "Total Teams", count: stats.teams, icon: <Users size={24} />, color: "text-purple-600", bg: "bg-purple-100", border: "border-purple-200" },
    { title: "Total Stadiums", count: stats.stadiums, icon: <MapPin size={24} />, color: "text-orange-600", bg: "bg-orange-100", border: "border-orange-200" },
    { title: "Total Bookings", count: stats.bookings, icon: <Ticket size={24} />, color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-200" },
  ];

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-2 font-medium text-lg">Welcome back! Here's what's happening today.</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl transition-all flex items-center gap-2">
          Download Report <ArrowUpRight size={18} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 hover:shadow-xl transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">{card.title}</p>
                <p className="text-5xl font-black text-slate-800 mt-4 tracking-tighter">{card.count}</p>
              </div>
              <div className={`w-14 h-14 rounded-2xl ${card.bg} ${card.color} border ${card.border} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                <div className="bg-emerald-100 p-1 rounded-full"><TrendingUp size={14} /></div> 
                <span>Active</span>
              </div>
              <span className="text-xs font-bold text-slate-400">System Data</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 mt-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full mb-4 border border-emerald-500/30">PRO PLATFORM</div>
          <h2 className="text-4xl font-black mb-4 tracking-tight">Manage Your Cricket Empire 🏏</h2>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">
            CricBook is your all-in-one solution. Schedule matches, manage teams and stadiums, and handle ticket bookings seamlessly.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-30 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;