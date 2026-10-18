import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStadiums, createStadium, deleteStadium } from '../../api/stadiums';
import { Plus, Edit, Trash2, Search, Filter, MapPin, X, Globe } from 'lucide-react';

const StadiumList = () => {
  const [stadiums, setStadiums] = useState([]);
  const [formData, setFormData] = useState({ name: '', city: '', capacity: '' });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // 1. READ: Data fetch karna
  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const res = await getStadiums();
        setStadiums(res.data);
      } catch (error) {
        console.error("Error loading stadiums:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStadiums();
  }, []);

  // 2. CREATE: Form Submit (Add Stadium)
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createStadium(formData);
      
      // Form reset karein
      setFormData({ name: '', city: '', capacity: '' });
      
      // Form band karein
      setShowForm(false); 
      
      // List refresh karein
      const res = await getStadiums();
      setStadiums(res.data);
      
      alert("Stadium added successfully!");
    } catch (error) {
      console.error("Error saving stadium:", error);
      alert("Stadium save nahi hua. Kya JSON server chal raha hai?");
    }
  };

  // 3. DELETE: Stadium delete karna
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this stadium?")) {
      try {
        await deleteStadium(id);
        const res = await getStadiums();
        setStadiums(res.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div className="text-center p-10 font-bold text-emerald-500">Loading Stadiums...</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl shadow-sm border border-orange-200">
              <MapPin size={28} />
            </div>
            Stadiums Directory
          </h1>
          <p className="text-slate-500 mt-2 font-medium text-lg">Manage all cricket stadiums and venues.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={`px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center gap-2 ${
            showForm ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          {showForm ? <><X size={18} /> Close Form</> : <><Plus size={18} /> Add New Stadium</>}
        </button>
      </div>

      {/* ADD STADIUM FORM */}
      {showForm && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
          <h2 className="text-xl font-extrabold text-slate-800 mb-6">Add New Stadium</h2>
          
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" placeholder="Stadium Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-orange-500 font-medium text-slate-700" />
            
            <input type="text" placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required className="bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-orange-500 font-medium text-slate-700" />
            
            <input type="number" placeholder="Capacity (e.g. 50000)" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} required className="bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-orange-500 font-medium text-slate-700" />
            
            <button type="submit" className="bg-orange-500 text-white font-bold px-4 py-3 rounded-xl hover:bg-orange-600 transition-all shadow-md">Save Stadium</button>
          </form>
        </div>
      )}

      {/* STADIUMS LIST */}
      <div className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden relative">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
          <div className="flex items-center bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl w-full md:w-96">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Search stadiums..." className="bg-transparent border-none outline-none ml-2 w-full text-sm font-medium text-slate-700" />
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
              <Filter size={16} /> Filter
            </button>
            <div className="bg-orange-50 text-orange-700 border border-orange-100 text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              {stadiums.length} Stadiums
            </div>
          </div>
        </div>

        {stadiums.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
              <MapPin size={40} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">No stadiums added yet</h3>
            <p className="text-slate-500 font-medium max-w-sm mb-6">Get started by adding your first cricket stadium.</p>
            <button onClick={() => setShowForm(true)} className="text-orange-600 font-bold hover:text-orange-700 flex items-center gap-2">
              <Plus size={18} /> Add a Stadium
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Stadium Name</th>
                  <th className="py-4 px-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">City / Location</th>
                  <th className="py-4 px-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Capacity</th>
                  <th className="py-4 px-6 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stadiums.map((stadium) => (
                  <tr key={stadium.id} className="hover:bg-slate-50 transition-colors group">
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-black shadow-sm border border-orange-200">
                          <Globe size={20} />
                        </div>
                        <span className="font-bold text-slate-800 text-base">{stadium.name}</span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className="text-slate-700 font-semibold text-sm flex items-center gap-2">
                        <MapPin size={14} className="text-slate-400"/> {stadium.city}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-lg text-sm border border-slate-200">{stadium.capacity}</span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <Link to={`/stadiums/edit/${stadium.id}`} className="p-2 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"><Edit size={16} /></Link>
                        <button onClick={() => handleDelete(stadium.id)} className="p-2 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"><Trash2 size={16} /></button>
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

export default StadiumList;