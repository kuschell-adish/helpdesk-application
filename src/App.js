import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FileTicket from './pages/FileTicket';
import Tickets from './pages/Tickets';
import Articles from './pages/Articles';
import Profile from './pages/Profile';

import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ticket/create" element={<FileTicket />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
