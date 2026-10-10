import { useState, useEffect } from 'react';
import { getMatches } from '../api/matches';
import { getTeams } from '../api/teams';
import { getStadiums } from '../api/stadiums';
import { getBookings } from '../api/bookings';

const Dashboard = () => {
  const [stats, setStats] = useState({ matches: 0, teams: 0, stadiums: 0, bookings: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [matchesRes, teamsRes, stadiumsRes, bookingsRes] = await Promise.all([
          getMatches(), getTeams(), getStadiums(), getBookings()
        ]);
        
        setStats({
          matches: matchesRes.data.length,
          teams: teamsRes.data.length,
          stadiums: stadiumsRes.data.length,
          bookings: bookingsRes.data.length
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Total Matches", count: stats.matches, color: "bg-blue-500" },
    { title: "Total Teams", count: stats.teams, color: "bg-green-500" },
    { title: "Total Stadiums", count: stats.stadiums, color: "bg-yellow-500" },
    { title: "Total Bookings", count: stats.bookings, color: "bg-purple-500" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className={`${card.color} text-white p-6 rounded-lg shadow-lg`}>
            <h2 className="text-lg font-semibold">{card.title}</h2>
            <p className="text-4xl font-bold mt-2">{card.count}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Welcome to CricBook</h2>
        <p className="text-gray-600">
          Yeh CricBook ka admin panel hai. Yahan se aap cricket matches, teams, stadiums aur ticket bookings ko manage kar sakte hain. Upar diye gaye Navbar ka use karein.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;