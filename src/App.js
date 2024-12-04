import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';

import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FileTicket from './pages/FileTicket';
import Tickets from './pages/Tickets';
import ArticleList from './pages/Articles/ArticleList';
import ArticleDetail from './pages/Articles/ArticleDetail';
import Profile from './pages/Profile';

import { UserProvider } from './context/UserContext';

import Test from './pages/Test';
import { useEffect } from 'react';
function App() {
  const navigate = useNavigate(); // useNavigate hook to programmatically navigate

  // useEffect to check authentication status when the app loads
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('user'); // check authentication in localStorage or context

    // If no user data is found, navigate to the login page
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
          <Route path="/tickets" element={<PrivateRoute element={<Tickets />} />} />
            <Route path="/articles" element={<PrivateRoute element={<ArticleList />} />} />
            <Route path="/articles/:id" element={<PrivateRoute element={<ArticleDetail />} />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />}/>
          <Route path="/test" element={<Test />} />
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
