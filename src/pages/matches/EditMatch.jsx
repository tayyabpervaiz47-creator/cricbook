import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatchById, updateMatch } from '../../api/matches';
import { Save, ArrowLeft } from 'lucide-react';

const EditMatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ team1: '', team2: '', date: '', venue: '', format: 'T20' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await getMatchById(id);
        setFormData(res.data);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchMatch();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateMatch(id, formData);
      alert("Match updated successfully!");
      navigate('/matches');
    } catch (error) { console.error(error); }
  };

  if (loading) return <div className="text-center p-10 font-bold text-slate-500 animate-pulse">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <button onClick={() => navigate('/matches')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold mb-6 transition-colors">
        <ArrowLeft size={18} /> Back to Matches
      </button>

      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100">
        <h2 className="text-2xl font-extrabold text-slate-800 mb-8">Edit Match Details</h2>
        
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Team 1</label>
              <input type="text" value={formData.team1} onChange={e => setFormData({...formData, team1: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Team 2</label>
              <input type="text" value={formData.team2} onChange={e => setFormData({...formData, team2: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Date</label>
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-600" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Venue</label>
              <input type="text" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-600 mb-2">Format</label>
              <select value={formData.format} onChange={e => setFormData({...formData, format: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700">
                <option value="T20">T20</option>
                <option value="ODI">ODI</option>
                <option value="Test">Test</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-4 pt-6">
            <button type="submit" className="bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2 w-full justify-center">
              <Save size={18} /> Save Changes
            </button>
            <button type="button" onClick={() => navigate('/matches')} className="bg-slate-100 text-slate-600 font-bold px-8 py-3 rounded-xl hover:bg-slate-200 transition-all w-full justify-center">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMatch;