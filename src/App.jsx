import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import EditTeam from './pages/teams/EditTeam.jsx';
import EditStadium from './pages/stadiums/EditStadium.jsx';
// .jsx extension ka hona zaroori hai taake VS Code pehchan sake
import Dashboard from './pages/Dashboard.jsx';
import MatchList from './pages/matches/MatchList.jsx';
import TeamList from './pages/teams/TeamList.jsx';
import StadiumList from './pages/stadiums/StadiumList.jsx';
import BookingList from './pages/bookings/BookingList.jsx';
import EditMatch from './pages/matches/EditMatch.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="matches" element={<MatchList />} />
          <Route path="teams" element={<TeamList />} />
          <Route path="stadiums" element={<StadiumList />} />
          <Route path="bookings" element={<BookingList />} />
          <Route path="matches/edit/:id" element={<EditMatch />} />
          <Route path="teams/edit/:id" element={<EditTeam />} />
<Route path="stadiums/edit/:id" element={<EditStadium />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;