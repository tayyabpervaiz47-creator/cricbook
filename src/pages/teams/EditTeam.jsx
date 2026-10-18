import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTeamById, updateTeam } from '../../api/teams';
import { Save, ArrowLeft } from 'lucide-react';

const EditTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', captain: '', coach: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await getTeamById(id);
        setFormData(res.data);
      } catch (error) { 
        console.error(error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchTeam();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateTeam(id, formData);
      alert("Team updated successfully!");
      navigate('/teams');
    } catch (error) { console.error(error); }
  };

  if (loading) return <div className="text-center p-10 font-bold text-slate-500">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <button onClick={() => navigate('/teams')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold mb-6 transition-colors">
        <ArrowLeft size={18} /> Back to Teams
      </button>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <h2 className="text-2xl font-extrabold text-slate-800 mb-8">Edit Team Details</h2>
        
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Team Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-slate-700" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Captain Name</label>
              <input type="text" value={formData.captain} onChange={e => setFormData({...formData, captain: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-slate-700" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Coach Name</label>
              <input type="text" value={formData.coach} onChange={e => setFormData({...formData, coach: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-slate-700" />
            </div>
          </div>
          
          <div className="flex gap-4 pt-6">
            <button type="submit" className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md flex items-center gap-2 w-full justify-center">
              <Save size={18} /> Save Changes
            </button>
            <button type="button" onClick={() => navigate('/teams')} className="bg-slate-100 text-slate-600 font-bold px-8 py-3 rounded-xl hover:bg-slate-200 transition-all w-full justify-center">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeam;