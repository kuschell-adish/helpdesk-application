import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import axiosInstance from '../utils/axiosInstance';

import Loading from '../pages/Loading';

const PrivateRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    axiosInstance.get('/user')
    .then(() => setIsAuthenticated(true))
    .catch(() => setIsAuthenticated(false)); 
  }, []); 

  if (isAuthenticated === null) return <Loading />; 
  if (isAuthenticated === false) return <Navigate to="/login" />;
  return element; 


};

export default PrivateRoute;
