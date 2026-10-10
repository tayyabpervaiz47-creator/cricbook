import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStadiumById, updateStadium } from '../../api/stadiums';

const EditStadium = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', city: '', capacity: '' });

  useEffect(() => {
    getStadiumById(id).then(res => setFormData(res.data)).catch(err => console.error(err));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateStadium(id, formData);
      alert("Stadium updated!");
      navigate('/stadiums');
    } catch (error) { console.error(error); }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Edit Stadium</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="border p-2 rounded w-full" placeholder="Stadium Name" />
        <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required className="border p-2 rounded w-full" placeholder="City" />
        <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} required className="border p-2 rounded w-full" placeholder="Capacity" />
        <div className="flex gap-4 pt-4">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded w-full">Update Stadium</button>
          <button type="button" onClick={() => navigate('/stadiums')} className="bg-gray-400 text-white px-6 py-2 rounded w-full">Cancel</button>
        </div>
      </form>
    </div>
  );
};
export default EditStadium;