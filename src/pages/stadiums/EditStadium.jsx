import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStadiumById, updateStadium } from '../../api/stadiums';
import { Save, ArrowLeft } from 'lucide-react';

const EditStadium = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', city: '', capacity: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStadium = async () => {
      try {
        const res = await getStadiumById(id);
        setFormData(res.data);
      } catch (error) { 
        console.error(error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchStadium();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateStadium(id, formData);
      alert("Stadium updated successfully!");
      navigate('/stadiums');
    } catch (error) { console.error(error); }
  };

  if (loading) return <div className="text-center p-10 font-bold text-slate-500">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <button onClick={() => navigate('/stadiums')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold mb-6 transition-colors">
        <ArrowLeft size={18} /> Back to Stadiums
      </button>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <h2 className="text-2xl font-extrabold text-slate-800 mb-8">Edit Stadium Details</h2>
        
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Stadium Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-orange-500 font-medium text-slate-700" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">City</label>
              <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-orange-500 font-medium text-slate-700" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Capacity</label>
              <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-orange-500 font-medium text-slate-700" />
            </div>
          </div>
          
          <div className="flex gap-4 pt-6">
            <button type="submit" className="bg-orange-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-600 transition-all shadow-md flex items-center gap-2 w-full justify-center">
              <Save size={18} /> Save Changes
            </button>
            <button type="button" onClick={() => navigate('/stadiums')} className="bg-slate-100 text-slate-600 font-bold px-8 py-3 rounded-xl hover:bg-slate-200 transition-all w-full justify-center">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStadium;