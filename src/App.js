import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';

import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FileTicket from './pages/FileTicket';
import TicketList from './pages/Tickets/TicketList';
import TicketDetail from './pages/Tickets/TicketDetail';
import ArticleList from './pages/Articles/ArticleList';
import ArticleDetail from './pages/Articles/ArticleDetail';
import Profile from './pages/Profile';

import { UserProvider } from './context/UserContext';
import { useEffect } from 'react';
function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('user'); 

    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);
  return (
    <UserProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/ticket/create" element={<PrivateRoute element={<FileTicket />} />}/>
            {/* tickets */}
            <Route path="/tickets" element={<PrivateRoute element={<TicketList />} />} />
            <Route path="/tickets/:id" element={<PrivateRoute element={< TicketDetail/>} />} />
            {/* articles */}
            <Route path="/articles" element={<PrivateRoute element={<ArticleList />} />} />
            <Route path="/articles/:id" element={<PrivateRoute element={<ArticleDetail />} />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />}/>
        </Routes>
    </UserProvider>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
