import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTeamById, updateTeam } from '../../api/teams';

const EditTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', captain: '', coach: '' });

  useEffect(() => {
    getTeamById(id).then(res => setFormData(res.data)).catch(err => console.error(err));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateTeam(id, formData);
      alert("Team updated!");
      navigate('/teams');
    } catch (error) { console.error(error); }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Edit Team</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="border p-2 rounded w-full" placeholder="Team Name" />
        <input type="text" value={formData.captain} onChange={e => setFormData({...formData, captain: e.target.value})} required className="border p-2 rounded w-full" placeholder="Captain" />
        <input type="text" value={formData.coach} onChange={e => setFormData({...formData, coach: e.target.value})} required className="border p-2 rounded w-full" placeholder="Coach" />
        <div className="flex gap-4 pt-4">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded w-full">Update Team</button>
          <button type="button" onClick={() => navigate('/teams')} className="bg-gray-400 text-white px-6 py-2 rounded w-full">Cancel</button>
        </div>
      </form>
    </div>
  );
};
export default EditTeam;