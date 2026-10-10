import { useState, useEffect } from 'react';

import { getBookings, createBooking, deleteBooking } from '../../api/bookings';
import { getMatches } from '../../api/matches';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [matches, setMatches] = useState([]); 
  const [formData, setFormData] = useState({ 
    customerName: '', 
    matchId: '', 
    seats: '', 
    totalPrice: '' 
  });
  const [loading, setLoading] = useState(true);

  // 1. READ: Data fetch karna (Ab error nahi aayega)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingRes = await getBookings();
        const matchRes = await getMatches();
        setBookings(bookingRes.data);
        setMatches(matchRes.data);
      } catch (error) { 
        console.error(error); 
      } finally { 
        setLoading(false); 
      }
    };
    
    fetchData();
  }, []);

  // 2. CREATE: Naya ticket book karna
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createBooking(formData);
      setFormData({ customerName: '', matchId: '', seats: '', totalPrice: '' });
      
      // Dobara data mangwayein
      const bookingRes = await getBookings();
      setBookings(bookingRes.data);
      alert("Ticket Booked Successfully!");
    } catch (error) { console.error(error); }
  };

  // 3. DELETE: Booking cancel karna
  const handleDelete = async (id) => {
    if (window.confirm("Cancel this booking?")) {
      try {
        await deleteBooking(id);
        
        // Dobara data mangwayein
        const bookingRes = await getBookings();
        setBookings(bookingRes.data);
      } catch (error) { console.error(error); }
    }
  };

  if (loading) return <div className="text-center p-5 font-bold">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* ADD BOOKING FORM */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Book a Ticket</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input type="text" placeholder="Customer Name" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} required className="border p-2 rounded" />
          
          {/* MATCH SELECT DROPDOWN */}
          <select value={formData.matchId} onChange={e => setFormData({...formData, matchId: e.target.value})} required className="border p-2 rounded bg-white">
            <option value="">Select Match</option>
            {matches.map(match => (
              <option key={match.id} value={match.id}>
                {match.team1} vs {match.team2} ({match.date})
              </option>
            ))}
          </select>

          <input type="number" placeholder="Seats" value={formData.seats} onChange={e => setFormData({...formData, seats: e.target.value})} required className="border p-2 rounded" />
          <input type="number" placeholder="Total Price" value={formData.totalPrice} onChange={e => setFormData({...formData, totalPrice: e.target.value})} required className="border p-2 rounded" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Book Ticket</button>
        </form>
      </div>

      {/* BOOKINGS LIST */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">All Bookings</h2>
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Customer</th>
              <th className="py-2 px-4 border-b text-left">Match</th>
              <th className="py-2 px-4 border-b text-left">Seats</th>
              <th className="py-2 px-4 border-b text-left">Total Price</th>
              <th className="py-2 px-4 border-b text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-4 text-gray-500">No bookings found.</td></tr>
            ) : (
              bookings.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b font-semibold">{booking.customerName}</td>
                  
                  <td className="py-2 px-4 border-b text-green-700 font-medium">
                    {booking.match ? `${booking.match.team1} vs ${booking.match.team2}` : `Match ID: ${booking.matchId}`}
                  </td>
                  
                  <td className="py-2 px-4 border-b">{booking.seats} Seats</td>
                  <td className="py-2 px-4 border-b">Rs. {booking.totalPrice}</td>
                  <td className="py-2 px-4 border-b space-x-3">
                    <button onClick={() => handleDelete(booking.id)} className="text-red-600 font-semibold">Cancel</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingList;