import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Edit ke liye Link import kiya
import { getMatches, createMatch, deleteMatch } from '../../api/matches';

const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    date: '',
    venue: '',
    format: 'T20'
  });
  const [loading, setLoading] = useState(true);

  // 1. READ: Data fetch karna
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await getMatches();
        setMatches(response.data);
      } catch (error) {
        console.error("Error fetching matches. Kya JSON Server chal raha hai?", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMatches();
  }, []);

  // 2. CREATE: Naya match add karna
  const handleAddMatch = async (e) => {
    e.preventDefault();
    try {
      await createMatch(formData);
      setFormData({ team1: '', team2: '', date: '', venue: '', format: 'T20' });
      
      // Form submit hone ke baad dobara data mangwayein
      const response = await getMatches();
      setMatches(response.data);
      
      alert("Match added successfully!");
    } catch (error) {
      console.error("Error adding match:", error);
    }
  };

  // 3. DELETE: Match delete karna
  const handleDelete = async (id) => {
    if (window.confirm("Kya aap waqai ye match delete karna chahte hain?")) {
      try {
        await deleteMatch(id);
        // Delete ke baad dobara data mangwayein
        const response = await getMatches();
        setMatches(response.data);
      } catch (error) {
        console.error("Error deleting match:", error);
      }
    }
  };

  if (loading) return <div className="text-center p-5 text-xl font-bold">Loading matches...</div>;

  return (
    <div className="space-y-6">
      {/* ADD MATCH FORM */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Match</h2>
        <form onSubmit={handleAddMatch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input type="text" placeholder="Team 1" value={formData.team1} onChange={(e) => setFormData({...formData, team1: e.target.value})} required className="border p-2 rounded" />
          <input type="text" placeholder="Team 2" value={formData.team2} onChange={(e) => setFormData({...formData, team2: e.target.value})} required className="border p-2 rounded" />
          <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required className="border p-2 rounded" />
          <input type="text" placeholder="Venue" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} required className="border p-2 rounded" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Add Match</button>
        </form>
      </div>

      {/* MATCHES LIST */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">All Matches</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Teams</th>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Venue</th>
                <th className="py-2 px-4 border-b text-left">Format</th>
                <th className="py-2 px-4 border-b text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {matches.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-gray-500">No matches found.</td></tr>
              ) : (
                matches.map((match) => (
                  <tr key={match.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b font-semibold">{match.team1} vs {match.team2}</td>
                    <td className="py-2 px-4 border-b">{match.date}</td>
                    <td className="py-2 px-4 border-b">{match.venue}</td>
                    <td className="py-2 px-4 border-b"><span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{match.format}</span></td>
                    
                    {/* ACTION BUTTONS (Edit & Delete) */}
                    <td className="py-2 px-4 border-b space-x-3">
                      <Link to={`/matches/edit/${match.id}`} className="text-blue-600 hover:text-blue-800 font-semibold">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(match.id)} className="text-red-600 hover:text-red-800 font-semibold">
                        Delete
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MatchList;