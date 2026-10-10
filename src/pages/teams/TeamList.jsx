import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTeams, createTeam, deleteTeam } from '../../api/teams';

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({ name: '', captain: '', coach: '' });
  const [loading, setLoading] = useState(true);

  // 1. READ: Data fetch karna
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await getTeams();
        setTeams(res.data);
      } catch (error) { 
        console.error(error); 
      } finally { 
        setLoading(false); 
      }
    };
    
    fetchTeams();
  }, []);

  // 2. CREATE
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createTeam(formData);
      setFormData({ name: '', captain: '', coach: '' });
      
      // Dobara data mangwayein
      const res = await getTeams();
      setTeams(res.data);
      alert("Team added!");
    } catch (error) { console.error(error); }
  };

  // 3. DELETE
  const handleDelete = async (id) => {
    if (window.confirm("Delete this team?")) {
      try {
        await deleteTeam(id);
        
        // Dobara data mangwayein
        const res = await getTeams();
        setTeams(res.data);
      } catch (error) { console.error(error); }
    }
  };

  if (loading) return <div className="text-center p-5 font-bold">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Add New Team</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Team Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="border p-2 rounded" />
          <input type="text" placeholder="Captain" value={formData.captain} onChange={e => setFormData({...formData, captain: e.target.value})} required className="border p-2 rounded" />
          <input type="text" placeholder="Coach" value={formData.coach} onChange={e => setFormData({...formData, coach: e.target.value})} required className="border p-2 rounded" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Team</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">All Teams</h2>
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Captain</th>
              <th className="py-2 px-4 border-b text-left">Coach</th>
              <th className="py-2 px-4 border-b text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {teams.map(team => (
              <tr key={team.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b font-semibold">{team.name}</td>
                <td className="py-2 px-4 border-b">{team.captain}</td>
                <td className="py-2 px-4 border-b">{team.coach}</td>
                <td className="py-2 px-4 border-b space-x-3">
                  <Link to={`/teams/edit/${team.id}`} className="text-blue-600 font-semibold">Edit</Link>
                  <button onClick={() => handleDelete(team.id)} className="text-red-600 font-semibold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TeamList;