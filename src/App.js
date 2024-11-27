import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import './App.css';
import FileTicket from './pages/FileTicket';
import Tickets from './pages/Tickets';
import Articles from './pages/Articles';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ticket/create" element={<FileTicket />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
