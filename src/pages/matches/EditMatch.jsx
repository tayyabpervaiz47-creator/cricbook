import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatchById, updateMatch } from '../../api/matches';

const EditMatch = () => {
  const { id } = useParams(); // URL se ID nikalne ke liye
  const navigate = useNavigate(); // Update ke baad wapas list par jane ke liye
  const [formData, setFormData] = useState({
    team1: '', team2: '', date: '', venue: '', format: 'T20'
  });
  const [loading, setLoading] = useState(true);

  // Purana data form mein load karna
  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await getMatchById(id);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching match:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [id]);

  // Update save karna
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateMatch(id, formData);
      alert("Match updated successfully!");
      navigate('/matches'); // Wapas list par le jayein
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };

  if (loading) return <div className="text-center p-5 font-bold">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Match</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Team 1" value={formData.team1} onChange={(e) => setFormData({...formData, team1: e.target.value})} required className="border p-2 rounded" />
          <input type="text" placeholder="Team 2" value={formData.team2} onChange={(e) => setFormData({...formData, team2: e.target.value})} required className="border p-2 rounded" />
          <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required className="border p-2 rounded" />
          <input type="text" placeholder="Venue" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} required className="border p-2 rounded" />
        </div>
        
        <div className="flex gap-4 pt-4">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full md:w-auto">
            Update Match
          </button>
          <button type="button" onClick={() => navigate('/matches')} className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition w-full md:w-auto">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMatch;