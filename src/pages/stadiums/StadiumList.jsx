import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStadiums, createStadium, deleteStadium } from '../../api/stadiums';

const StadiumList = () => {
  const [stadiums, setStadiums] = useState([]);
  const [formData, setFormData] = useState({ name: '', city: '', capacity: '' });
  const [loading, setLoading] = useState(true);

  // 1. READ: Data fetch karna
  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const res = await getStadiums();
        setStadiums(res.data);
      } catch (error) { 
        console.error(error); 
      } finally { 
        setLoading(false); 
      }
    };
    
    fetchStadiums();
  }, []);

  // 2. CREATE: Naya stadium add karna
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createStadium(formData);
      setFormData({ name: '', city: '', capacity: '' });
      
      // Dobara data mangwayein
      const res = await getStadiums();
      setStadiums(res.data);
      alert("Stadium added!");
    } catch (error) { console.error(error); }
  };

  // 3. DELETE: Stadium delete karna
  const handleDelete = async (id) => {
    if (window.confirm("Delete this stadium?")) {
      try {
        await deleteStadium(id);
        
        // Dobara data mangwayein
        const res = await getStadiums();
        setStadiums(res.data);
      } catch (error) { console.error(error); }
    }
  };

  if (loading) return <div className="text-center p-5 font-bold">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Add New Stadium</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Stadium Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="border p-2 rounded" />
          <input type="text" placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required className="border p-2 rounded" />
          <input type="number" placeholder="Capacity" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} required className="border p-2 rounded" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Stadium</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">All Stadiums</h2>
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">City</th>
              <th className="py-2 px-4 border-b text-left">Capacity</th>
              <th className="py-2 px-4 border-b text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {stadiums.map(stadium => (
              <tr key={stadium.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b font-semibold">{stadium.name}</td>
                <td className="py-2 px-4 border-b">{stadium.city}</td>
                <td className="py-2 px-4 border-b">{stadium.capacity}</td>
                <td className="py-2 px-4 border-b space-x-3">
                  <Link to={`/stadiums/edit/${stadium.id}`} className="text-blue-600 font-semibold">Edit</Link>
                  <button onClick={() => handleDelete(stadium.id)} className="text-red-600 font-semibold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default StadiumList;