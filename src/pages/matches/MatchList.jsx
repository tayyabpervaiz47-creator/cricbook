import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMatches, createMatch, deleteMatch } from '../../api/matches';
import { Plus, Edit, Trash2, Calendar, MapPin, Search, Filter, Trophy, X } from 'lucide-react';

const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [formData, setFormData] = useState({ team1: '', team2: '', date: '', venue: '', format: 'T20' });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // 1. READ: Data fetch karna
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await getMatches();
        setMatches(res.data);
      } catch (error) {
        console.error("Error loading matches:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  // 2. CREATE: Form Submit (Add Match)
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createMatch(formData);
      
      // Form reset karein
      setFormData({ team1: '', team2: '', date: '', venue: '', format: 'T20' });
      
      // Form band karein
      setShowForm(false); 
      
      // List refresh karein
      const res = await getMatches();
      setMatches(res.data);
      
      alert("Match saved successfully!");
    } catch (error) {
      console.error("Error saving match:", error);
      alert("Match save nahi hua. Kya JSON server chal raha hai?");
    }
  };

  // 3. DELETE: Match delete karna
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this match?")) {
      try {
        await deleteMatch(id);
        const res = await getMatches();
        setMatches(res.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div className="text-center p-10 font-bold text-emerald-500">Loading Matches...</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl shadow-sm border border-emerald-200">
              <Trophy size={28} />
            </div>
            Match Schedule
          </h1>
          <p className="text-slate-500 mt-2 font-medium text-lg">Manage all upcoming cricket matches.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={`px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center gap-2 ${
            showForm ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          {showForm ? <><X size={18} /> Close Form</> : <><Plus size={18} /> Add New Match</>}
        </button>
      </div>

      {/* ADD MATCH FORM */}
      {showForm && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
          <h2 className="text-xl font-extrabold text-slate-800 mb-6">Create New Match</h2>
          
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input type="text" placeholder="Team 1" value={formData.team1} onChange={e => setFormData({...formData, team1: e.target.value})} required className="bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-emerald-500 font-medium text-slate-700" />
            
            <input type="text" placeholder="Team 2" value={formData.team2} onChange={e => setFormData({...formData, team2: e.target.value})} required className="bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-emerald-500 font-medium text-slate-700" />
            
            <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required className="bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-emerald-500 font-medium text-slate-500" />
            
            <input type="text" placeholder="Venue" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} required className="bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-emerald-500 font-medium text-slate-700" />
            
            {/* FORMAT DROPDOWN */}
            <select 
              value={formData.format} 
              onChange={e => setFormData({...formData, format: e.target.value})} 
              required 
              className="bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-emerald-500 font-medium text-slate-700 cursor-pointer"
            >
              <option value="T20">T20</option>
              <option value="ODI">ODI</option>
              <option value="Test">Test</option>
            </select>

            <button type="submit" className="bg-emerald-500 text-white font-bold px-4 py-3 rounded-xl hover:bg-emerald-600 transition-all shadow-md">Save Match</button>
          </form>
        </div>
      )}

      {/* MATCHES LIST */}
      <div className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden relative">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
          <div className="flex items-center bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl w-full md:w-96">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Search teams..." className="bg-transparent border-none outline-none ml-2 w-full text-sm font-medium text-slate-700" />
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
              <Filter size={16} /> Filter
            </button>
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {matches.length} Matches
            </div>
          </div>
        </div>

        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
              <Calendar size={40} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">No matches scheduled yet</h3>
            <p className="text-slate-500 font-medium max-w-sm mb-6">Get started by creating your first cricket match.</p>
            <button onClick={() => setShowForm(true)} className="text-emerald-600 font-bold hover:text-emerald-700 flex items-center gap-2">
              <Plus size={18} /> Create a Match
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Match Details</th>
                  <th className="py-4 px-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Date & Venue</th>
                  <th className="py-4 px-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Format</th>
                  <th className="py-4 px-6 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matches.map((match) => (
                  <tr key={match.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white font-black shadow-sm">
                          {match.team1.charAt(0)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-base">{match.team1}</span>
                          <span className="text-xs font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">VS</span>
                          <span className="font-bold text-slate-800 text-base">{match.team2}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-800 font-bold text-sm flex items-center gap-2">
                          <Calendar size={14} className="text-emerald-500"/> {match.date}
                        </span>
                        <span className="text-slate-500 text-xs font-medium flex items-center gap-2">
                          <MapPin size={14} className="text-slate-400"/> {match.venue}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider">{match.format}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <Link to={`/matches/edit/${match.id}`} className="p-2 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"><Edit size={16} /></Link>
                        <button onClick={() => handleDelete(match.id)} className="p-2 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchList;