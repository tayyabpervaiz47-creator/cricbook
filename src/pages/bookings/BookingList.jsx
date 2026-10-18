import { useState, useEffect } from 'react';
import { getBookings, createBooking, deleteBooking } from '../../api/bookings';
import { getMatches } from '../../api/matches';
import { Plus, Trash2, Search, Filter, Ticket, X, User, Calendar } from 'lucide-react';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [matches, setMatches] = useState([]); 
  const [formData, setFormData] = useState({ customerName: '', matchId: '', seats: '', totalPrice: '' });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // 1. READ: Data fetch karna
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dono APIs se data fetch karein
        const bookingRes = await getBookings();
        const matchRes = await getMatches();
        
        setBookings(bookingRes.data);
        setMatches(matchRes.data);
      } catch (error) { 
        console.error("Error loading data:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  // Match select karne par price calculate karna
  const handleMatchChange = (matchId) => {
    const selectedMatch = matches.find(m => String(m.id) === String(matchId));
    let basePrice = 0;
    
    if (selectedMatch) {
      if (selectedMatch.format === 'T20') basePrice = 2000;
      else if (selectedMatch.format === 'ODI') basePrice = 3000;
      else if (selectedMatch.format === 'Test') basePrice = 5000;
    }

    const seatsCount = formData.seats ? parseInt(formData.seats) : 1;
    
    setFormData({ 
      ...formData, 
      matchId: matchId, 
      totalPrice: basePrice * seatsCount 
    });
  };

  // Seats change karne par price calculate karna
  const handleSeatsChange = (seats) => {
    const selectedMatch = matches.find(m => String(m.id) === String(formData.matchId));
    let basePrice = 0;
    
    if (selectedMatch) {
      if (selectedMatch.format === 'T20') basePrice = 2000;
      else if (selectedMatch.format === 'ODI') basePrice = 3000;
      else if (selectedMatch.format === 'Test') basePrice = 5000;
    }

    const seatsCount = seats ? parseInt(seats) : 0;
    const calculatedPrice = basePrice * seatsCount;

    setFormData({ 
      ...formData, 
      seats: seats, 
      totalPrice: calculatedPrice > 0 ? calculatedPrice : '' 
    });
  };

  // 2. CREATE: Ticket Book karna
  const handleAdd = async (e) => {
    e.preventDefault();
    
    if(!formData.matchId) {
      alert("Please select a match first!");
      return;
    }

    try {
      const dataToSave = {
        customerName: formData.customerName,
        matchId: formData.matchId,
        seats: Number(formData.seats),           
        totalPrice: Number(formData.totalPrice)  
      };

      await createBooking(dataToSave);
      
      // Form reset karein
      setFormData({ customerName: '', matchId: '', seats: '', totalPrice: '' });
      
      // Form band karein
      setShowForm(false); 
      
      // List refresh karein
      const bookingRes = await getBookings();
      setBookings(bookingRes.data);
      
      alert("Ticket Booked Successfully!");
    } catch (error) { 
      console.error("Error booking ticket:", error); 
      alert("Booking failed. Check console for details.");
    }
  };

  // 3. DELETE: Booking cancel karna
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await deleteBooking(id);
        const bookingRes = await getBookings();
        setBookings(bookingRes.data);
      } catch (error) { 
        console.error(error); 
      }
    }
  };

  if (loading) return <div className="text-center p-10 font-bold text-emerald-500">Loading Bookings...</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl shadow-sm border border-purple-200">
              <Ticket size={28} />
            </div>
            Ticket Bookings
          </h1>
          <p className="text-slate-500 mt-2 font-medium text-lg">Manage all customer ticket reservations.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={`px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center gap-2 ${
            showForm ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          {showForm ? <><X size={18} /> Close Form</> : <><Plus size={18} /> Book New Ticket</>}
        </button>
      </div>

      {/* ADD BOOKING FORM */}
      {showForm && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
          <h2 className="text-xl font-extrabold text-slate-800 mb-6">Create New Booking</h2>
          
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-1">
              <input type="text" placeholder="Customer Name" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-purple-500 font-medium text-slate-700" />
            </div>
            
            <div className="md:col-span-1">
              <select 
                value={formData.matchId} 
                onChange={e => handleMatchChange(e.target.value)} 
                required 
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-purple-500 font-medium text-slate-700 cursor-pointer"
              >
                <option value="">Select Match</option>
                {matches.map(match => (
                  <option key={match.id} value={match.id}>{match.team1} vs {match.team2} ({match.format})</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-1">
              <input type="number" placeholder="Seats (e.g. 2)" min="1" value={formData.seats} onChange={e => handleSeatsChange(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-purple-500 font-medium text-slate-700" />
            </div>
            
            <div className="md:col-span-1">
              <input type="number" placeholder="Total Price" value={formData.totalPrice} readOnly className="w-full bg-slate-100 border border-slate-200 p-3 rounded-xl text-slate-500 font-bold cursor-not-allowed" title="Auto-calculated based on seats & format" />
            </div>
            
            <div className="md:col-span-1">
              <button type="submit" className="w-full bg-purple-600 text-white font-bold px-4 py-3 rounded-xl hover:bg-purple-700 transition-all shadow-md">Confirm Booking</button>
            </div>
          </form>
          <p className="text-xs text-slate-400 mt-3 font-medium">* Price is auto-calculated. T20 = 2000, ODI = 3000, Test = 5000 per seat.</p>
        </div>
      )}

      {/* BOOKINGS LIST */}
      <div className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden relative">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
          <div className="flex items-center bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl w-full md:w-96">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Search customers..." className="bg-transparent border-none outline-none ml-2 w-full text-sm font-medium text-slate-700" />
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
              <Filter size={16} /> Filter
            </button>
            <div className="bg-purple-50 text-purple-700 border border-purple-100 text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              {bookings.length} Bookings
            </div>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
              <Ticket size={40} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">No bookings found</h3>
            <p className="text-slate-500 font-medium max-w-sm mb-6">Book a ticket for a match to see it here.</p>
            <button onClick={() => setShowForm(true)} className="text-purple-600 font-bold hover:text-purple-700 flex items-center gap-2">
              <Plus size={18} /> Create a Booking
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="py-4 px-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Match Details</th>
                  <th className="py-4 px-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Seats</th>
                  <th className="py-4 px-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="py-4 px-6 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => {
                  // Match details dhoondein
                  const matchedGame = matches.find(m => String(m.id) === String(booking.matchId));
                  
                  return (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-colors group">
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-black shadow-sm border border-purple-200">
                          <User size={20} />
                        </div>
                        <span className="font-bold text-slate-800 text-base">{booking.customerName}</span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-lg text-sm border border-emerald-100 flex items-center gap-2 w-max">
                        <Calendar size={14} /> 
                        {/* Match ka naam show karein agar mil jaye, warna Match ID dikhayein */}
                        {matchedGame ? `${matchedGame.team1} vs ${matchedGame.team2}` : `Match ID: ${booking.matchId}`}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-slate-700 font-bold text-sm bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">{booking.seats} Seats</span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-black text-slate-800 text-base flex items-center gap-1">
                        Rs. {booking.totalPrice}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDelete(booking.id)} className="p-2 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all shadow-sm" title="Cancel Booking">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingList;