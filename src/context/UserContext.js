import React, { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser)); 
    }
  }, []);

  const setUserData = (userData) => {
    setUser(userData);  
    localStorage.setItem('user', JSON.stringify(userData));  
  };

  return (
    <UserContext.Provider value={{ user, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
